import { Httpx } from "https://jslib.k6.io/httpx/0.1.0/index.js";
import { sleep } from "k6";
import {
  randomItem,
  findBetween,
  randomString,
  randomIntBetween,
} from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export const options = {
  scenarios: {
    contacts: {
      executor: "constant-vus",
      vus: 1,
      duration: "2m",
    },
  },
};

let token;

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
  let res = urlK6Api.get("/public/crocodiles/", null, {
    tags: { name: "GET - /public/crocodiles/" },
  });

  sleep(randomIntBetween(1, 3));

  // GET - /public/crocodiles/${randomPublicId}
  let publicCrocodileIds = findBetween(res.body, '"id":', ',"', true);
  let randomPublicId = randomItem(publicCrocodileIds);

  res = urlK6Api.get(`/public/crocodiles/${randomPublicId}/`, null, {
    tags: { name: "GET - /public/crocodiles/${randomPublicId}" },
  });

  sleep(randomIntBetween(1, 3));

  // POST - /user/register/
  let registerBody = {
    username: `${username}`,
    first_name: `${firstName}`,
    last_name: `${lastName}`,
    email: `${email}`,
    password: `${password}`,
  };

  res = urlK6Api.post("/user/register/", JSON.stringify(registerBody), {
    tags: { name: "POST - /user/register/" },
  });

  sleep(randomIntBetween(1, 3));

  // POST - /auth/token/login/
  let loginBody = {
    username: `${username}`,
    password: `${password}`,
  };
  res = urlK6Api.post("/auth/token/login/", JSON.stringify(loginBody), {
    tags: { name: "POST - /auth/token/login/" },
  });

  try {
    token = JSON.parse(res.body).access;
  } catch (error) {
    token = 0;
  }

  urlK6Api.addHeader("Authorization", `Bearer ${token}`);
  sleep(randomIntBetween(1, 3));

  // POST - /my/crocodiles/
  for (let i = 0; i < 10; i++) {
    let crocodileInfo = {
      name: `${randomString(5, `aeioubcdfghijpqrstuv`)}`,
      sex: `${randomString(1, `MF`)}`,
      date_of_birth: "2000-01-01",
    };
    res = urlK6Api.post("/my/crocodiles/", JSON.stringify(crocodileInfo), {
      tags: { name: "POST - /my/crocodiles/" },
    });

    sleep(randomIntBetween(1, 2));
  }

  // GET - /my/crocodiles/
  (res = urlK6Api.get("/my/crocodiles/")),
    null,
    { tags: { name: "GET - /my/crocodiles/" } };

  let privateCrocodileIds = findBetween(res.body, '"id":', ',"', true);
  let randomPrivateId = randomItem(privateCrocodileIds);

  sleep(randomIntBetween(1, 3));

  // GET - 	/my/crocodiles/{id}/
  (res = urlK6Api.get(`/my/crocodiles/${randomPrivateId}/`)),
    null,
    { tags: { name: "GET - 	/my/crocodiles/{randomPrivateId}/" } };

  sleep(randomIntBetween(1, 3));

  // PUT - 	/my/crocodiles/{id}/
  let crocodileInfo = {
    name: `${randomString(5, `aeioubcdfghijpqrstuv`)}`,
    sex: `${randomString(1, `MF`)}`,
    date_of_birth: "2000-01-01",
  };
  res = urlK6Api.put(
    `/my/crocodiles/${randomPrivateId}/`,
    JSON.stringify(crocodileInfo),
    { tags: { name: "PUT - 	/my/crocodiles/{id}/" } }
  );

  sleep(randomIntBetween(1, 3));

  // PATCH - /my/crocodiles/{id}/
  let newCrocodileName = { name: `${randomString(5, `aeioubcdfghijpqrstuv`)}` };
  res = urlK6Api.patch(
    `/my/crocodiles/${randomPrivateId}/`,
    JSON.stringify(newCrocodileName),
    { tags: { name: "PATCH - /my/crocodiles/{randomPrivateId}/" } }
  );

  sleep(randomIntBetween(1, 3));

  // DELETE - 	/my/crocodiles/{id}/
  for (let i = 0; i < privateCrocodileIds.length; i++) {
    res = urlK6Api.delete(`/my/crocodiles/${privateCrocodileIds[i]}/`, null, {
      tags: { name: "DELETE - /my/crocodiles/{privateCrocodileIds}/" },
    });

    sleep(randomIntBetween(1, 3));
  }

  // GET - /my/crocodiles/
  res = urlK6Api.get("/my/crocodiles/", null, {
    tags: { name: "GET - /my/crocodiles/" },
  });

  sleep(randomIntBetween(1, 3));
}
