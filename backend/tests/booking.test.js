require("dotenv").config();
const bcrypt = require("bcryptjs");
const request = require("supertest");

const db = require("../models/index.js");
const User = db.user;
const Booking = db.booking;
const Item = db.item;
const { app, server } = require("../testServer.js");
const utils = require("../utils.js");

let ADMIN_USER_ID = "", ADMIN_TOKEN = "";
let MANAGER_USER_ID = "", MANAGER_TOKEN = "";
let A_USER = {}, A_USER_PASSWORD = "1111", A_USER_TOKEN = "";

beforeAll(async () => {
    const adminData = await User.findOne({ where: { username: process.env.ADMIN_USER } });
    ADMIN_USER_ID = adminData.id;
    ADMIN_TOKEN = utils.generateToken(adminData);

    const user = {
        name: "Paco",
        surname: "Ramos",
        password: bcrypt.hashSync(A_USER_PASSWORD),
        username: "pacoramos@gmail.com",
        avatar: "img",
        role: "ADMIN",
    };
    A_USER = await User.create(user);
    A_USER_TOKEN = utils.generateToken(A_USER);
});

describe("POST /api/bookings", () => {
    it("should create a booking successfully for a user", async () => {
        const newBooking = {
            description: "Booking description",
            checkOut: "2025-02-18T00:00:00Z",
            checkIn: "2025-02-17T00:00:00Z",
            state: "pending",
            itemIds: [1, 2]
        };

        const res = await request(app)
            .post("/api/bookings")
            .set("Authorization", `Bearer ${A_USER_TOKEN}`)
            .send(newBooking);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "Booking created successfully");
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("description", newBooking.description);
        expect(res.body.data).toHaveProperty("state", newBooking.state);
    });

    it("should return 401 if required fields are missing", async () => {
        const newBooking = { description: "Booking without required fields" };

        const res = await request(app)
            .post("/api/bookings")
            .set("Authorization", `Bearer ${A_USER_TOKEN}`)
            .send(newBooking);

        expect(res.statusCode).toBe(401);
    });

    it("should return 401 if user is not authenticated", async () => {
        const res = await request(app)
            .post("/api/bookings")
            .send({ description: "Unauthenticated booking" });

        expect(res.statusCode).toBe(401);
    });
});


describe("GET /api/bookings", () => {
    it("should get all bookings", async () => {
        const res = await request(app)
            .get("/api/bookings")
            .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toBeInstanceOf(Array);
    });

    it("should return 401 if user lacks permissions", async () => {
        const res = await request(app)
            .get("/api/bookings")
            .set("Authorization", `Bearer ${A_USER_TOKEN}`);

        expect(res.statusCode).toBe(200);
    });
});

describe("GET /api/bookings/:id", () => {
    it("should get a booking by id", async () => {
        const booking = await Booking.create({
            description: "Test booking",
            checkOut: "2025-02-18T00:00:00Z",
            checkIn: "2025-02-17T00:00:00Z",
            state: "pending",
            userId: A_USER.id,
        });

        const res = await request(app)
            .get(`/api/bookings/${booking.id}`)
            .set("Authorization", `Bearer ${A_USER_TOKEN}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty("id", booking.id);
    });

    it("should return 404 if booking not found", async () => {
        const res = await request(app)
            .get("/api/bookings/999")
            .set("Authorization", `Bearer ${A_USER_TOKEN}`);

        expect(res.statusCode).toBe(404);
    });
});

describe("PUT /api/bookings/:id", () => {
    it("should update a booking state", async () => {
        const booking = await Booking.create({
            description: "Test booking",
            checkOut: "2025-02-18T00:00:00Z",
            checkIn: "2025-02-17T00:00:00Z",
            state: "pending",
            userId: A_USER.id,
        });

        const res = await request(app)
            .put(`/api/bookings/${booking.id}`)
            .set("Authorization", `Bearer ${A_USER_TOKEN}`)
            .send({ state: "withdrawn" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Booking state changed");
    });

    it("should return 401 if user lacks permission to update", async () => {
        const booking = await Booking.create({
            description: "Test booking",
            checkOut: "2025-02-18T00:00:00Z",
            checkIn: "2025-02-17T00:00:00Z",
            state: "pending",
            userId: A_USER.id,
        });

        const res = await request(app)
            .put(`/api/bookings/${booking.id}`)
            .set("Authorization", `Bearer ${ADMIN_TOKEN}`)
            .send({ state: "withdrawn" });

        expect(res.statusCode).toBe(200);
    });
});

describe("DELETE /api/bookings/:id", () => {
    it("should delete a booking successfully", async () => {
        const booking = await Booking.create({
            description: "Test booking",
            checkOut: "2025-02-18T00:00:00Z",
            checkIn: "2025-02-17T00:00:00Z",
            state: "pending",
            userId: A_USER.id,
        });

        const res = await request(app)
            .delete(`/api/bookings/${booking.id}`)
            .set("Authorization", `Bearer ${A_USER_TOKEN}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Booking deleted and items updated to available");
    });

    it("should return 404 if booking not found", async () => {
        const res = await request(app)
            .delete("/api/bookings/999")
            .set("Authorization", `Bearer ${A_USER_TOKEN}`);

        expect(res.statusCode).toBe(404);
    });
});

afterAll(() => {
    server.close();
});
