import { Httpx } from "https://jslib.k6.io/httpx/0.1.0/index.js";
import { group } from "k6";
import {
  randomItem,
  findBetween,
  randomString,
} from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

const urlK6Api = new Httpx({
  baseURL: "https://test-api.k6.io",
  headers: { "Content-Type": "application/json", Vary: "Accept" },
});

export default function () {
  // Generate user credentials
  const firstName = `${randomString(5, `aeioubcdfghijpqrstuv`)}`;
  const lastName = `${randomString(5, `aeioubcdfghijpqrstuv`)}`;
  const email = `${firstName}_${lastName}@gmail.com`;
  const username = `${firstName}_${lastName}_${randomString(3, `0123456789`)}`;
  const password = `${randomString(10)}`;

  // GET - /public/crocodiles/
  let res = urlK6Api.get("/public/crocodiles/");

  // GET - /public/crocodiles/${id}
  let publicCrocodileIds = findBetween(res.body, '"id":', ',"', true);
  let randomPublicId = randomItem(publicCrocodileIds);

  res = urlK6Api.get(`/public/crocodiles/${randomPublicId}/`);

  // POST - /user/register/
  let registerBody = {
    username: `${username}`,
    first_name: `${firstName}`,
    last_name: `${lastName}`,
    email: `${email}`,
    password: `${password}`,
  };

  res = urlK6Api.post("/user/register/", JSON.stringify(registerBody));

  // POST - /auth/token/login/
  let loginBody = {
    username: `${username}`,
    password: `${password}`,
  };
  res = urlK6Api.post("/auth/token/login/", JSON.stringify(loginBody));

  const token = JSON.parse(res.body).access;
  urlK6Api.addHeader("Authorization", `Bearer ${token}`);

  // POST - /my/crocodiles/
  for (let i = 0; i < 10; i++) {
    let crocodileInfo = {
      name: `${randomString(5, `aeioubcdfghijpqrstuv`)}`,
      sex: `${randomString(1, `MF`)}`,
      date_of_birth: "2000-01-01",
    };
    res = urlK6Api.post("/my/crocodiles/", JSON.stringify(crocodileInfo));
  }

  // GET - /my/crocodiles/
  res = urlK6Api.get("/my/crocodiles/");
  let privateCrocodileIds = findBetween(res.body, '"id":', ',"', true);
  let randomPrivateId = randomItem(privateCrocodileIds);

  // GET - 	/my/crocodiles/{id}/
  res = urlK6Api.get(`/my/crocodiles/${randomPrivateId}/`);

  // PUT - 	/my/crocodiles/{id}/
  let crocodileInfo = {
    name: `${randomString(5, `aeioubcdfghijpqrstuv`)}`,
    sex: `${randomString(1, `MF`)}`,
    date_of_birth: "2000-01-01",
  };
  res = urlK6Api.put(
    `/my/crocodiles/${randomPrivateId}/`,
    JSON.stringify(crocodileInfo)
  );

  // PATCH - /my/crocodiles/{id}/
  let newCrocodileName = { name: `${randomString(5, `aeioubcdfghijpqrstuv`)}` };
  res = urlK6Api.patch(
    `/my/crocodiles/${randomPrivateId}/`,
    JSON.stringify(newCrocodileName)
  );

  // DELETE - 	/my/crocodiles/{id}/
  for (let i = 0; i < privateCrocodileIds.length; i++) {
    res = urlK6Api.delete(`/my/crocodiles/${privateCrocodileIds[i]}/`);
  }

  // GET - /my/crocodiles/
  res = urlK6Api.get("/my/crocodiles/");
}
