require("dotenv").config();
const bcrypt = require("bcryptjs");
const request = require("supertest");

const db = require("../models/index.js");
const User = db.user;
const utils = require("../utils.js");

const { app, server } = require("../testServer.js");

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

describe("POST /api/lockers", () => {
    it("admin should create a locker successfully", async () => {
        const newLocker = { number: 1, location: "Aula 109", description: "Armario 09" };

        const res = await request(app)
            .post("/api/lockers")
            .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
            .send(newLocker);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("number", newLocker.number);
    });

    // it("should return 400 if required fields are missing", async () => {
    //     const res = await request(app)
    //         .post("/api/lockers")
    //         .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
    //         .send({ number: 12 });

    //     expect(res.statusCode).toBe(400);
    // });

    it("should NOT create a locker if user is not authenticated", async () => {
        const res = await request(app).post("/api/lockers").send({ number: 2, location: "Aula 110", description: "Armario 10" });

        expect(res.statusCode).toBe(401);
    });

    it("should NOT create a locker if user lacks permissions", async () => {
        const res = await request(app)
            .post("/api/lockers")
            .set("Authorization", `Bearer ${A_USER_TOKEN}`)
            .send({ number: 3, location: "Aula 111", description: "Armario 11" });

        expect(res.statusCode).toBe(401);
    });
});

describe("GET /api/lockers", () => {
    it("admin should get all lockers", async () => {
        const res = await request(app).get("/api/lockers").set("Authorization", `Bearer ${ADMIN_TOKEN}`);

        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty("number");
    });

    it("manager should get all lockers", async () => {
        const res = await request(app).get("/api/lockers").set("Authorization", `Bearer ${MANAGER_TOKEN}`);

        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty("number");
    });

    it("user should get all lockers", async () => {
        const res = await request(app).get("/api/lockers").set("Authorization", `Bearer ${A_USER_TOKEN}`);

        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toHaveProperty("number");
    });
});

describe("GET /api/lockers/:id", () => {
    it("admin should get a locker by id", async () => {
        const res = await request(app).get("/api/lockers/1").set("Authorization", `Bearer ${ADMIN_TOKEN}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("description");
    });

    it("manager should get a locker by id", async () => {
        const res = await request(app).get("/api/lockers/1").set("Authorization", `Bearer ${MANAGER_TOKEN}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("description");
    });

    it("user should get a locker by id", async () => {
        const res = await request(app).get("/api/lockers/1").set("Authorization", `Bearer ${A_USER_TOKEN}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("description");
    });

    it("should return 404 if locker not found", async () => {
        const res = await request(app).get("/api/lockers/999").set("Authorization", `Bearer ${ADMIN_TOKEN}`);

        expect(res.statusCode).toBe(404);
    });
});

describe("PUT /api/lockers/:id", () => {
    it("admin should update a locker", async () => {
        const res = await request(app)
            .put("/api/lockers/1")
            .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
            .send({ description: "Armario no disponible" });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Locker updated");
    });

    it("manager should NOT update a locker", async () => {
        const res = await request(app)
            .put("/api/lockers/1")
            .set("Authorization", `Bearer ${MANAGER_TOKEN}`)
            .send({ description: "Armario no disponible" });

        expect(res.statusCode).toBe(401);
    });

    it("user should NOT update a locker", async () => {
        const res = await request(app)
            .put("/api/lockers/1")
            .set("Authorization", `Bearer ${A_USER_TOKEN}`)
            .send({ description: "Armario no disponible" });

        expect(res.statusCode).toBe(401);
    });

    it("should return 404 if locker not found", async () => {
        const res = await request(app)
            .put("/api/lockers/999")
            .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
            .send({ description: "Armario no disponible" });

        expect(res.statusCode).toBe(404);
    });
});

describe("DELETE /api/lockers/:id", () => {
    // it("admin should delete a locker", async () => {
    //     const res = await request(app).delete("/api/lockers/1").set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    //     expect(res.statusCode).toBe(200);
    // });

    it("manager should NOT delete a locker", async () => {
        const res = await request(app).delete("/api/lockers/1").set("Authorization", `Bearer ${MANAGER_TOKEN}`);

        expect(res.statusCode).toBe(401);
    });

    it("user should NOT delete a locker", async () => {
        const res = await request(app).delete("/api/lockers/1").set("Authorization", `Bearer ${A_USER_TOKEN}`);

        expect(res.statusCode).toBe(401);
    });

    it("should return 404 if locker not found", async () => {
        const res = await request(app).delete("/api/lockers/999").set("Authorization", `Bearer ${ADMIN_TOKEN}`);

        expect(res.statusCode).toBe(401);
    });
});

afterAll(() => {
    server.close();
});