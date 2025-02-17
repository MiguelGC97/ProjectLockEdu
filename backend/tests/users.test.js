require("dotenv").config();
const bcrypt = require("bcryptjs");
const utils = require("../utils.js");

const db = require("../models/index.js");
const User = db.user;

const request = require("supertest");
const { app, server } = require("../testServer.js");


let ADMIN_USER_ID = "";
let ADMIN_TOKEN = "";
let MANAGER_USER_ID = "";
let MANAGER_TOKEN = "";
let A_USER = {};
const A_USER_PASSWORD = "1111";
let A_USER_TOKEN = "";

beforeAll(async () => {
  const adminData = await User.findOne({
    where: { username: process.env.ADMIN_USER },
  });
  ADMIN_USER_ID = adminData.id;
  ADMIN_TOKEN = utils.generateToken(adminData);

  const managerData = await User.findOne({
    where: { username: process.env.MANAGER_USER },
  });
  MANAGER_USER_ID = managerData.id;
  MANAGER_TOKEN = utils.generateToken(managerData);

  const user = {
    name: "Lola",
    surname: "Flores",
    password: bcrypt.hashSync(A_USER_PASSWORD),
    username: "lolaflores@gmail.com",
    avatar: "img",
    role: "TEACHER",
  };
  A_USER = await User.create(user);
  A_USER_TOKEN = utils.generateToken(A_USER);
});

describe("POST /api/users/signin", () => {
  it("should authenticate", async () => {
    const BASIC_AUTH_CODE = btoa(
      `${process.env.ADMIN_USER}:${process.env.ADMIN_PASSWORD}`
    );
    const res = await request(app)
      .post("/api/users/signin")
      .set("Authorization", `Basic ${BASIC_AUTH_CODE}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("access_token");
  });
});

describe("POST /api/users/signin", () => {
  it("should NOT authenticate with fake password", async () => {
    const FAKE_PASSWORD = "a fake password";
    const BASIC_AUTH_CODE = btoa(`${process.env.ADMIN_USER}:${FAKE_PASSWORD}`);
    const res = await request(app)
      .post("/api/users/signin")
      .set("Authorization", `Basic ${BASIC_AUTH_CODE}`);

    expect(res.statusCode).toEqual(401);
  });
});

describe("GET /api/users", () => {
  it("should show all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data[0]).toHaveProperty("username");
  });
});

describe("POST /api/users", () => {
  it("should create a new user", async () => {
    const payload = {
      name: "MariaDb",
      surname: "SQL del Carmen",
      password: "holaholita",
      username: "Mariaa@gmail.com",
      avatar: "img",
      role: "TEACHER",
    };

    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
      .send(payload);

    expect(res.statusCode).toEqual(200);
    expect(res.body.user.name).toEqual("MariaDb");
    expect(res.body.user.surname).toEqual("SQL del Carmen");
    expect(res.body.user.username).toEqual("Mariaa@gmail.com");
    expect(bcrypt.compareSync("holaholita", res.body.user.password)).toBe(true);
    expect(res.body.user.role).toEqual("TEACHER");
    expect(res.body.user.avatar).toEqual("img");
    expect(res.body).toHaveProperty("access_token");
  });
});

describe("PUT /api/users/:id", () => {
  const A_USER_NEW_PASSWORD = "3333";
  it("should update a user", async () => {
    const payload = {
      name: "Johnny",
      surname: "Silverhand",
      password: A_USER_NEW_PASSWORD,
      username: "johnySilverhand@gmail.com",
      role: "MANAGER",
    };
    const res = await request(app)
      .put(`/api/users/${A_USER.id}`)
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
      .send(payload);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("User updated");
  });

  it("should show the previously updated user with updated data", async () => {
    const res = await request(app)
      .get(`/api/users/${A_USER.id}`)
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(res.statusCode).toEqual(200);

    expect(res.body.name).toEqual("Johnny");
    expect(res.body.surname).toEqual("Silverhand");
    expect(bcrypt.compareSync(A_USER_NEW_PASSWORD, res.body.password)).toBe(
      true
    );
    expect(res.body.username).toEqual("johnySilverhand@gmail.com");
    expect(res.body.role).toEqual("MANAGER");
  });
});

describe("GET /api/users/:userId", () => {
  it("should show a user by userId", async () => {
    const res = await request(app)
      .get(`/api/users/${ADMIN_USER_ID}`)
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`);



    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("username");
  });
});

describe("GET /api/users/username/:username", () => {
  it("should show a user by username", async () => {
    const res = await request(app)
      .get(`/api/users/username/${process.env.ADMIN_USER}`)
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`);


    expect(res.statusCode).toEqual(200);
    expect(res.body.data[0]).toHaveProperty("username");
  });
});

describe("PUT /api/users/:userId", () => {
  const A_USER_NEW_PASSWORD = "3333";
  it("should update a user", async () => {
    const payload = {
      name: "Vincent",
      surname: "Valery",
      password: A_USER_NEW_PASSWORD,
      username: "nofuture@nightcity.blackwall.net",
      avatar: "img",
      role: "MANAGER",
    };
    const res = await request(app)
      .put(`/api/users/${A_USER.id}`)
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
      .send(payload);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("User updated");
  });

  it("should show the previously updated user with updated data", async () => {
    const res = await request(app)
      .get(`/api/users/${A_USER.id}`)
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(res.body.name).toEqual("Vincent");
    expect(res.body.surname).toEqual("Valery");
    expect(bcrypt.compareSync(A_USER_NEW_PASSWORD, res.body.password)).toBe(
      true
    );
    expect(res.body.username).toEqual("nofuture@nightcity.blackwall.net");
    expect(res.body.role).toEqual("MANAGER");
  });
});

describe("GET /api/users/:userId", () => {
  it("manager should NOT show a user by userId", async () => {
    const res = await request(app)
      .get(`/api/users/${MANAGER_USER_ID}`)
      .set("Authorization", `Bearer ${MANAGER_TOKEN}`);

    expect(res.statusCode).toEqual(401);
  });
});

describe("GET /api/users/username/:username", () => {
  it("manager should NOT show a user by username", async () => {
    const res = await request(app)
      .get(`/api/users/username/${process.env.ADMIN_USER}`)
      .set("Authorization", `Bearer ${MANAGER_TOKEN}`);



    expect(res.statusCode).toEqual(401);
  });
});

describe("GET /api/users", () => {
  it("manager should NOT show all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${MANAGER_TOKEN}`);

    expect(res.statusCode).toEqual(401);
  });
});

describe("POST /api/users", () => {
  it("manager should NOT create a new user", async () => {
    const payload = {
      name: "MariaDb",
      surname: "SQL del Carmen",
      password: "holaholita",
      username: "Mariaa@gmail.com",
      avatar: "img",
      role: "TEACHER",
    };

    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${MANAGER_TOKEN}`)
      .send(payload);

    expect(res.statusCode).toEqual(401);
  });
});

describe("PUT /api/users/:id", () => {
  const A_USER_NEW_PASSWORD = "3333";
  it("manager should NOT update a user", async () => {
    const payload = {
      name: "Johnny",
      surname: "Silverhand",
      password: A_USER_NEW_PASSWORD,
      username: "johnySilverhand@gmail.com",
      role: "MANAGER",
    };
    const res = await request(app)
      .put(`/api/users/${A_USER.id}`)
      .set("Authorization", `Bearer ${MANAGER_TOKEN}`)
      .send(payload);

    expect(res.statusCode).toEqual(401);
  });
});

describe("DELETE /api/users/:userId", () => {
  it("manager should NOT delete a user", async () => {
    const res = await request(app)
      .delete(`/api/users/${A_USER.id}`)
      .set("Authorization", `Bearer ${MANAGER_TOKEN}`);
    expect(res.statusCode).toEqual(401);
  });
});

describe("POST /api/users", () => {
  it("should NOT create a new user with a user Token", async () => {
    const payload = {
      name: "Ernesto",
      surname: "Cabrera",
      password: bcrypt.hashSync(A_USER_PASSWORD),
      username: "ernesto200@gmail.com",
      avatar: "img",
      role: "TEACHER",
    };
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${A_USER_TOKEN}`)
      .send(payload);

    expect(res.statusCode).toEqual(401);
  });
});

describe("PUT /api/users/:userId", () => {
  const A_USER_NEW_PASSWORD = "3333";
  it("should NOT update a user with a user token", async () => {
    const payload = {
      name: "Johnny",
      surname: "Silverhand",
      password: bcrypt.hashSync(A_USER_NEW_PASSWORD),
      username: "wakeupsamurai@arasaka.blackwall.net",
      avatar: "img",
      role: "MANAGER",
    };
    const res = await request(app)
      .put(`/api/users/${A_USER.id}`)
      .set("Authorization", `Bearer ${A_USER_TOKEN}`)
      .send(payload);

    expect(res.statusCode).toEqual(401);
  });
});

describe("GET /api/users/username/:username", () => {
  it("should NOT show a user by username", async () => {
    const res = await request(app)
      .get(`/api/users/username/${process.env.ADMIN_USER}`)
      .set("Authorization", `Bearer ${A_USER_TOKEN}`);



    expect(res.statusCode).toEqual(401);
  });
});

describe("GET /api/users", () => {
  it("should NOT show all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${A_USER_TOKEN}`);

    expect(res.statusCode).toEqual(401);
  });
});

describe("DELETE /api/users/:userId", () => {
  it("should NOT delete a user by userId with a user token", async () => {
    const res = await request(app)
      .delete(`/api/users/${A_USER.id}`)
      .set("Authorization", `Bearer ${A_USER_TOKEN}`);
    expect(res.statusCode).toEqual(401);
  });
});

describe("DELETE /api/users/:userId", () => {
  it("should delete a user by userId", async () => {
    const res = await request(app)
      .delete(`/api/users/${A_USER.id}`)
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("User deleted");
  });
});

afterAll(() => {
  server.close();
});
