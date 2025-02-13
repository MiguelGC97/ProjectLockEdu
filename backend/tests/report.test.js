require("dotenv").config();
const bcrypt = require("bcryptjs");

const db = require("../models/index.js");
const User = db.user;
const Report = db.report;
const Box = db.box;

const utils = require("../utils.js");

const request = require("supertest");
const { app, server } = require("../index");

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

describe("POST /api/reports", () => {
  it("user should create a report successfully", async () => {
    const newReport = {
      content: "This is a test report",
      isSolved: false,
      userId: A_USER.id,
      boxId: 1,
    };

    const res = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${A_USER_TOKEN}`)
      .send(newReport);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("report");
    expect(res.body.report).toHaveProperty("content", newReport.content);
    expect(res.body.report).toHaveProperty("isSolved", newReport.isSolved);
  });

  it("should return 400 if content is missing", async () => {
    const invalidReport = {
      isSolved: false,
      userId: A_USER.id,
      boxId: 1,
    };

    const res = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${A_USER_TOKEN}`)
      .send(invalidReport);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Content can not be empty!");
  });

  it("should return 401 if user is not authenticated", async () => {
    const newReport = {
      content: "Unauthorized test report",
      isSolved: false,
      userId: MANAGER_USER_ID.id,
      boxId: 1,
    };

    const res = await request(app).post("/api/reports").send(newReport);

    expect(res.statusCode).toBe(401);
  });

  it("should return 401 if user does not have permission", async () => {
    const newReport = {
      content: "Unauthorized role report",
      isSolved: false,
      userId: A_USER.id,
      boxId: 1,
    };

    const res = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${MANAGER_TOKEN}`)
      .send(newReport);

    expect(res.statusCode).toBe(401);
  });
});

describe("GET /api/reports", () => {
    it("admin should show all reports", async () => {
      const res = await request(app)
        .get("/api/reports")
        .set("Authorization", `Bearer ${ADMIN_TOKEN}`);
  
      expect(res.statusCode).toEqual(200);
      expect(res.body.data[0]).toHaveProperty("isSolved");
    });
  });

describe("GET /api/reports", () => {
  it("manager should show all reports", async () => {
    const res = await request(app)
      .get("/api/reports")
      .set("Authorization", `Bearer ${MANAGER_TOKEN}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data[0]).toHaveProperty("isSolved");
    expect(res.body.data[0]).toHaveProperty("content");
  });
});

describe("GET /api/reports/:userId", () => {
  it("manager should show a report by userId", async () => {
    const res = await request(app)
      .get(`/api/reports/user/${A_USER.id}`)
      .set("Authorization", `Bearer ${MANAGER_TOKEN}`);

    console.log("Respuesta completa:", res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("username");
  });
});

describe("GET /api/reports/:userId", () => {
  it("manager should show a report by username", async () => {
    const res = await request(app)
      .get(`/api/reports/${A_USER.username}`)
      .set("Authorization", `Bearer ${MANAGER_TOKEN}`);

    console.log("Respuesta completa:", res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("username");
  });
});

// describe("PUT /api/report/:id", () => {
//   const A_USER_NEW_PASSWORD = "3333";
//   it("should update a report", async () => {
//     const payload = {
//       name: "Johnny",
//       surname: "Silverhand",
//       password: A_USER_NEW_PASSWORD,
//       username: "johnySilverhand@gmail.com",
//       role: "MANAGER",
//     };
//     const res = await request(app)
//       .put(`/api/users/${A_USER.id}`)
//       .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
//       .send(payload);

//     expect(res.statusCode).toEqual(200);
//     expect(res.body.message).toEqual("User updated");
//   });

//   it("should show the previously updated user with updated data", async () => {
//     const res = await request(app)
//       .get(`/api/users/${A_USER.id}`)
//       .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

//     expect(res.statusCode).toEqual(200);

//     expect(res.body.name).toEqual("Johnny");
//     expect(res.body.surname).toEqual("Silverhand");
//     expect(bcrypt.compareSync(A_USER_NEW_PASSWORD, res.body.password)).toBe(
//       true
//     );
//     expect(res.body.username).toEqual("johnySilverhand@gmail.com");
//     expect(res.body.role).toEqual("MANAGER");
//   });
// });

// describe("GET /api/users/:userId", () => {
//   it("should show a user by userId", async () => {
//     const res = await request(app)
//       .get(`/api/users/${ADMIN_USER_ID}`)
//       .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

//     console.log("Respuesta completa:", res.body);

//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty("username");
//   });
// });

// describe("GET /api/users/username/:username", () => {
//   it("should show a user by username", async () => {
//     const res = await request(app)
//       .get(`/api/users/username/${process.env.ADMIN_USER}`)
//       .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

//     console.log("hola soy SEARCH BY USERNAME Respuesta completa:", res.body);

//     console.log();

//     expect(res.statusCode).toEqual(200);
//     expect(res.body.data[0]).toHaveProperty("username");
//   });
// });

// describe("PUT /api/users/:userId", () => {
//   const A_USER_NEW_PASSWORD = "3333";
//   it("should update a user", async () => {
//     const payload = {
//       name: "Vincent",
//       surname: "Valery",
//       password: A_USER_NEW_PASSWORD,
//       username: "nofuture@nightcity.blackwall.net",
//       avatar: "img",
//       role: "MANAGER",
//     };
//     const res = await request(app)
//       .put(`/api/users/${A_USER.id}`)
//       .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
//       .send(payload);

//     expect(res.statusCode).toEqual(200);
//     expect(res.body.message).toEqual("User updated");
//   });

//   it("should show the previously updated user with updated data", async () => {
//     const res = await request(app)
//       .get(`/api/users/${A_USER.id}`)
//       .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

//     expect(res.body.name).toEqual("Vincent");
//     expect(res.body.surname).toEqual("Valery");
//     expect(bcrypt.compareSync(A_USER_NEW_PASSWORD, res.body.password)).toBe(
//       true
//     );
//     expect(res.body.username).toEqual("nofuture@nightcity.blackwall.net");
//     expect(res.body.role).toEqual("MANAGER");
//   });
// });

// describe("GET /api/users/:userId", () => {
//   it("manager should NOT show a user by userId", async () => {
//     const res = await request(app)
//       .get(`/api/users/${MANAGER_USER_ID}`)
//       .set("Authorization", `Bearer ${MANAGER_TOKEN}`);

//     expect(res.statusCode).toEqual(401);
//   });
// });

// describe("GET /api/users/username/:username", () => {
//   it("manager should NOT show a user by username", async () => {
//     const res = await request(app)
//       .get(`/api/users/username/${process.env.ADMIN_USER}`)
//       .set("Authorization", `Bearer ${MANAGER_TOKEN}`);

//     console.log("hola soy SEARCH BY USERNAME Respuesta completa:", res.body);

//     console.log();

//     expect(res.statusCode).toEqual(401);
//   });
// });

// describe("GET /api/users", () => {
//   it("manager should NOT show all users", async () => {
//     const res = await request(app)
//       .get("/api/users")
//       .set("Authorization", `Bearer ${MANAGER_TOKEN}`);

//     expect(res.statusCode).toEqual(401);
//   });
// });

// describe("POST /api/users", () => {
//   it("manager should NOT create a new user", async () => {
//     const payload = {
//       name: "MariaDb",
//       surname: "SQL del Carmen",
//       password: "holaholita",
//       username: "Mariaa@gmail.com",
//       avatar: "img",
//       role: "TEACHER",
//     };

//     const res = await request(app)
//       .post("/api/users")
//       .set("Authorization", `Bearer ${MANAGER_TOKEN}`)
//       .send(payload);

//     expect(res.statusCode).toEqual(401);
//   });
// });

// describe("PUT /api/users/:id", () => {
//   const A_USER_NEW_PASSWORD = "3333";
//   it("manager should NOT update a user", async () => {
//     const payload = {
//       name: "Johnny",
//       surname: "Silverhand",
//       password: A_USER_NEW_PASSWORD,
//       username: "johnySilverhand@gmail.com",
//       role: "MANAGER",
//     };
//     const res = await request(app)
//       .put(`/api/users/${A_USER.id}`)
//       .set("Authorization", `Bearer ${MANAGER_TOKEN}`)
//       .send(payload);

//     expect(res.statusCode).toEqual(401);
//   });
// });

// describe("DELETE /api/users/:userId", () => {
//   it("manager should NOT delete a user", async () => {
//     const res = await request(app)
//       .delete(`/api/users/${A_USER.id}`)
//       .set("Authorization", `Bearer ${MANAGER_TOKEN}`);
//     expect(res.statusCode).toEqual(401);
//   });
// });

// describe("POST /api/users", () => {
//   it("should NOT create a new user with a user Token", async () => {
//     const payload = {
//       name: "Ernesto",
//       surname: "Cabrera",
//       password: bcrypt.hashSync(A_USER_PASSWORD),
//       username: "ernesto200@gmail.com",
//       avatar: "img",
//       role: "TEACHER",
//     };
//     const res = await request(app)
//       .post("/api/users")
//       .set("Authorization", `Bearer ${A_USER_TOKEN}`)
//       .send(payload);

//     expect(res.statusCode).toEqual(401);
//   });
// });

// describe("PUT /api/users/:userId", () => {
//   const A_USER_NEW_PASSWORD = "3333";
//   it("should NOT update a user with a user token", async () => {
//     const payload = {
//       name: "Johnny",
//       surname: "Silverhand",
//       password: bcrypt.hashSync(A_USER_NEW_PASSWORD),
//       username: "wakeupsamurai@arasaka.blackwall.net",
//       avatar: "img",
//       role: "MANAGER",
//     };
//     const res = await request(app)
//       .put(`/api/users/${A_USER.id}`)
//       .set("Authorization", `Bearer ${A_USER_TOKEN}`)
//       .send(payload);

//     expect(res.statusCode).toEqual(401);
//   });
// });

// describe("GET /api/users/username/:username", () => {
//   it("should NOT show a user by username", async () => {
//     const res = await request(app)
//       .get(`/api/users/username/${process.env.ADMIN_USER}`)
//       .set("Authorization", `Bearer ${A_USER_TOKEN}`);

//     console.log("hola soy SEARCH BY USERNAME Respuesta completa:", res.body);

//     console.log();

//     expect(res.statusCode).toEqual(401);
//   });
// });

// describe("GET /api/users", () => {
//   it("should NOT show all users", async () => {
//     const res = await request(app)
//       .get("/api/users")
//       .set("Authorization", `Bearer ${A_USER_TOKEN}`);

//     expect(res.statusCode).toEqual(401);
//   });
// });

// describe("DELETE /api/users/:userId", () => {
//   it("should NOT delete a user by userId with a user token", async () => {
//     const res = await request(app)
//       .delete(`/api/users/${A_USER.id}`)
//       .set("Authorization", `Bearer ${A_USER_TOKEN}`);
//     expect(res.statusCode).toEqual(401);
//   });
// });

// describe("DELETE /api/users/:userId", () => {
//   it("should delete a user by userId", async () => {
//     const res = await request(app)
//       .delete(`/api/users/${A_USER.id}`)
//       .set("Authorization", `Bearer ${ADMIN_TOKEN}`);
//     expect(res.statusCode).toEqual(200);
//     expect(res.body.message).toEqual("User deleted");
//   });
// });

afterAll(() => {
  server.close();
});
