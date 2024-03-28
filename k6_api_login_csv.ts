import { Httpx } from "https://jslib.k6.io/httpx/0.1.0/index.js";
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
import { SharedArray } from "k6/data";
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

const userCredentials = new SharedArray("User Credentials", () => {
  return papaparse.parse(open("./credentials.csv"), { header: true }).data;
});

let token;

const urlK6Api = new Httpx({
  baseURL: "https://test-api.k6.io",
  headers: { "Content-Type": "application/json", Vary: "Accept" },
});

export default function () {
  // Generate user credentials
  let randomCredential = randomItem(userCredentials);

  // POST - /auth/token/login/
  let loginBody = {
    username: `${randomCredential.username}`,
    password: `${randomCredential.password}`,
  };

  let res = urlK6Api.post("/auth/token/login/", JSON.stringify(loginBody));

  try {
    token = JSON.parse(res.body).access;
  } catch (error) {
    token = 0;
  }

  urlK6Api.addHeader("Authorization", `Bearer ${token}`);
  sleep(randomIntBetween(1, 3));

  // GET - /public/crocodiles/
  res = urlK6Api.get("/public/crocodiles/");

  sleep(randomIntBetween(1, 3));

  // GET - /public/crocodiles/${id}
  let publicCrocodileIds = findBetween(res.body, '"id":', ',"', true);
  let randomPublicId = randomItem(publicCrocodileIds);

  res = urlK6Api.get(`/public/crocodiles/${randomPublicId}/`);

  sleep(randomIntBetween(1, 3));

  // POST - /my/crocodiles/
  for (let i = 0; i < 10; i++) {
    let crocodileInfo = {
      name: `${randomString(5, `aeioubcdfghijpqrstuv`)}`,
      sex: `${randomString(1, `MF`)}`,
      date_of_birth: "2000-01-01",
    };
    res = urlK6Api.post("/my/crocodiles/", JSON.stringify(crocodileInfo));
    sleep(randomIntBetween(1, 2));
  }

  // GET - /my/crocodiles/
  res = urlK6Api.get("/my/crocodiles/");
  let privateCrocodileIds = findBetween(res.body, '"id":', ',"', true);
  let randomPrivateId = randomItem(privateCrocodileIds);

  sleep(randomIntBetween(1, 3));
  // GET - 	/my/crocodiles/{id}/
  res = urlK6Api.get(`/my/crocodiles/${randomPrivateId}/`);

  sleep(randomIntBetween(1, 3));

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

  sleep(randomIntBetween(1, 3));

  // PATCH - /my/crocodiles/{id}/
  let newCrocodileName = { name: `${randomString(5, `aeioubcdfghijpqrstuv`)}` };
  res = urlK6Api.patch(
    `/my/crocodiles/${randomPrivateId}/`,
    JSON.stringify(newCrocodileName)
  );

  sleep(randomIntBetween(1, 3));

  // DELETE - 	/my/crocodiles/{id}/
  for (let i = 0; i < privateCrocodileIds.length; i++) {
    res = urlK6Api.delete(`/my/crocodiles/${privateCrocodileIds[i]}/`);

    sleep(randomIntBetween(1, 3));
  }

  // GET - /my/crocodiles/
  res = urlK6Api.get("/my/crocodiles/");
  sleep(randomIntBetween(1, 3));
}
