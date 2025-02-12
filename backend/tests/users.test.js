require("dotenv").config();
const bcrypt = require("bcryptjs");

const db = require("../models/index.js");
const User = db.user;

const utils = require("../utils.js");

const auth = require("../middlewares/auth.js");

const permissions = require("../middlewares/permissions.js");


const request = require("supertest");
const { app, server } = require("../index");

let ADMIN_USER_ID = "";
let ADMIN_TOKEN = "";
let A_USER = {};
const A_USER_PASSWORD = "1111";
let A_USER_TOKEN = "";

beforeAll(async () => {
  const data = await User.findOne({
    where: { username: process.env.ADMIN_USER },
  });
  ADMIN_USER_ID = data.id;
  ADMIN_TOKEN = utils.generateToken(data);

  console.log(ADMIN_USER_ID, ADMIN_TOKEN);

  const user = {
    name: "Lola",
    surname: "flores",
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

describe("GET /api/users/:userId", () => {
  it("should show a user by userId", async () => {
    const res = await request(app)
      .get(`/api/users/${ADMIN_USER_ID}`)
      .set("Authorization", `Bearer ${ADMIN_TOKEN}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("username");
  });
});

describe("POST /api/users", () => {
  it("should create a new user", async () => {
    const payload = {
      name: "MariaDb",
      surname: "SQL del Carmen",
      password: "holaholita", // Contraseña en texto plano
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
      surname:'Silverhand',
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
    expect(bcrypt.compareSync(A_USER_NEW_PASSWORD , res.body.password)).toBe(true);
    expect(res.body.username).toEqual("johnySilverhand@gmail.com");
    expect(res.body.role).toEqual("MANAGER");
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


describe('POST /api/users/signin', () => {
  it('should NOT authenticate with fake password', async () => {
    const FAKE_PASSWORD = "a fake password";
    const BASIC_AUTH_CODE = btoa(`${process.env.ADMIN_USER}:${FAKE_PASSWORD}`);
    const res = await request(app)
      .post('/api/users/signin')
      .set('Authorization', `Basic ${BASIC_AUTH_CODE}`)

    expect(res.statusCode).toEqual(401) 
  })
})

describe('GET /api/users', () => {
  it('should show all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body.data[0]).toHaveProperty('username')
  })
})

describe('GET /api/users/:id', () => {
  it('should show a user by userId', async () => {
    const res = await request(app)
      .get(`/api/users/${ADMIN_USER_ID}`)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      console.log("Respuesta completa:", res.body);

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('username')
  })
})

describe('POST /api/users', () => {
  it('should NOT create a new user with a user Token', async () => {
    const payload = {
      name: "Lola",
    surname: "flores",
    password: bcrypt.hashSync(A_USER_PASSWORD),
    username: "lolaflores@gmail.com",
    avatar: "img",
    role: "TEACHER",
    };
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${A_USER_TOKEN}`)
      .send(payload)

    expect(res.statusCode).toEqual(401) 
  })
})


describe('PUT /api/users/:id', () => {

  const A_USER_NEW_PASSWORD = '3333';
  it('should NOT update a user with a user token', async () => {
    const payload = {
      name: "Lola",
      surname: "flores",
      password: bcrypt.hashSync(A_USER_NEW_PASSWORD),
      username: "lolaflores@gmail.com",
      avatar: "img",
      role: "TEACHER",
    };
    const res = await request(app)
      .put(`/api/users/${A_USER.id}`)
      .set('Authorization', `Bearer ${A_USER_TOKEN}`)
      .send(payload)

    expect(res.statusCode).toEqual(401)
  })
})

describe('PUT /api/users/:id', () => {

  const A_USER_NEW_PASSWORD = '3333';
  it('should update a user', async () => {
    const payload = {
      name: "Lola",
      surname: "flores",
      password: bcrypt.hashSync(A_USER_PASSWORD),
      username: "lolaflores@gmail.com",
      avatar: "img",
      role: "TEACHER",
    };
    const res = await request(app)
      .put(`/api/users/${A_USER.id}`)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .send(payload)

    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('User was updated successfully.')
  })

  it('should show the previously updated user with updated data', async () => {
    const res = await request(app)
      .get(`/api/users/${A_USER.id}`)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(res.body.user.name).toEqual("Johnny");
      expect(res.body.user.surname).toEqual("Silverhand");
      expect(bcrypt.compareSync(A_USER_NEW_PASSWORD , res.body.user.password)).toBe(true);
      expect(res.body.user.username).toEqual("johnySilverhand@gmail.com");
      expect(res.body.userrole).toEqual("MANAGER");
  })
})

// describe('DELETE /api/users/:userId', () => {
//   it('should NOT delete a user by userId with a user token', async () => {
//     const res = await request(app)
//       .delete(`/api/users/${A_USER.id}`)
//       .set('Authorization', `Bearer ${A_USER_TOKEN}`)
//     expect(res.statusCode).toEqual(401)
//   })
// })

// describe('DELETE /api/users/:userId', () => {
//   it('should delete a user by userId', async () => {
//     const res = await request(app)
//       .delete(`/api/users/${A_USER.id}`)
//       .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
//     expect(res.statusCode).toEqual(200)
//     expect(res.body.message).toEqual('User was deleted successfully!')
//   })
// })
