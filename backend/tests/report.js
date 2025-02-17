require("dotenv").config();
const bcrypt = require("bcryptjs");
const request = require("supertest");

const db = require("../models/index.js");
const User = db.user;
const utils = require("../utils.js");

const { app, server } = require("../testServer");

let ADMIN_USER_ID = "", ADMIN_TOKEN = "";
let MANAGER_USER_ID = "", MANAGER_TOKEN = "";
let A_USER = {}, A_USER_PASSWORD = "1111", A_USER_TOKEN = "";

beforeAll(async () => {
  const adminData = await User.findOne({ where: { username: process.env.ADMIN_USER } });
  ADMIN_USER_ID = adminData.id;
  ADMIN_TOKEN = utils.generateToken(adminData);

  const managerData = await User.findOne({ where: { username: process.env.MANAGER_USER } });
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
    const newReport = { content: "This is a test report", isSolved: false, userId: A_USER.id, boxId: 1 };

    const res = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${A_USER_TOKEN}`)
      .send(newReport);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("report");
    expect(res.body.report).toHaveProperty("content", newReport.content);
  });

  it("should return 400 if content is missing", async () => {
    const res = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${A_USER_TOKEN}`)
      .send({ isSolved: false, userId: A_USER.id, boxId: 1 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Content can not be empty!");
  });

  it("should NOT create a report if user is not authenticated", async () => {
    const res = await request(app).post("/api/reports").send({ content: "Unauthorized report", isSolved: false, userId: MANAGER_USER_ID, boxId: 1 });

    expect(res.statusCode).toBe(401);
  });

  it("should NOT create a report if user lacks permissions", async () => {
    const res = await request(app)
      .post("/api/reports")
      .set("Authorization", `Bearer ${MANAGER_TOKEN}`)
      .send({ content: "Unauthorized role report", isSolved: false, userId: A_USER.id, boxId: 1 });

    expect(res.statusCode).toBe(401);
  });
});


describe("GET /api/reports", () => {
  it("admin should get all reports", async () => {
    const res = await request(app).get("/api/reports").set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data[0]).toHaveProperty("isSolved");
  });

  it("manager should get all reports", async () => {
    const res = await request(app).get("/api/reports").set("Authorization", `Bearer ${MANAGER_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data[0]).toHaveProperty("content");
  });

  it("manager should get reports by userId", async () => {
    const res = await request(app).get(`/api/reports/user/${A_USER.id}`).set("Authorization", `Bearer ${MANAGER_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("username");
  });

  it("manager should get reports by username", async () => {
    const res = await request(app).get(`/api/reports/${A_USER.username}`).set("Authorization", `Bearer ${MANAGER_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("username");
  });
});


describe("PUT /api/reports/update/:reportId", () => {
  it("user should update their report", async () => {
    const res = await request(app)
      .put(`/api/reports/update/9`)
      .set("Authorization", `Bearer ${A_USER_TOKEN}`)
      .send({ content: "comentario actualizado" });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Incidence content updated");
  });

  it("should show the updated report comment", async () => {
    const res = await request(app).get(`/api/reports/user/${A_USER.id}`).set("Authorization", `Bearer ${MANAGER_TOKEN}`);

    expect(res.body.reports[0].content).toBe("comentario actualizado");
  });

  it("manager should NOT update a report", async () => {
    const res = await request(app)
      .put(`/api/reports/update/9`)
      .set("Authorization", `Bearer ${MANAGER_TOKEN}`)
      .send({ content: "comentario actualizado" });

    expect(res.statusCode).toBe(401);
  });

  it("user should NOT update another user's report", async () => {
    const res = await request(app)
      .put(`/api/reports/update/8`)
      .set("Authorization", `Bearer ${A_USER_TOKEN}`)
      .send({ content: "comentario actualizado" });

    expect(res.statusCode).toBe(403);
  });
});


describe("PUT /api/reports/resolve/:id", () => {
  it("admin should resolve a report", async () => {
    const res = await request(app)
      .put(`/api/reports/resolve/7`)
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
      .send({ isSolved: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.isSolved).toBe(true);
  });

  it("manager should resolve a report", async () => {
    const res = await request(app)
      .put(`/api/reports/resolve/8`)
      .set("Authorization", `Bearer ${MANAGER_TOKEN}`)
      .send({ isSolved: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.isSolved).toBe(true);
  });

  it("teacher should NOT resolve a report", async () => {
    const res = await request(app)
      .put(`/api/reports/resolve/9`)
      .set("Authorization", `Bearer ${A_USER_TOKEN}`)
      .send({ isSolved: true });

    expect(res.statusCode).toBe(401);
  });
});


describe("DELETE /api/reports/:id", () => {
  it("admin should delete a report", async () => {
    const res = await request(app).delete(`/api/reports/8`).set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Report deleted successfully");
  });

  it("manager should NOT delete a report", async () => {
    const res = await request(app).delete(`/api/reports/9`).set("Authorization", `Bearer ${MANAGER_TOKEN}`);

    expect(res.statusCode).toBe(401);
  });

  it("user should NOT delete a report", async () => {
    const res = await request(app).delete(`/api/reports/1`).set("Authorization", `Bearer ${A_USER_TOKEN}`);

    expect(res.statusCode).toBe(401);
  });
});

afterAll(() => {
  server.close();
});
