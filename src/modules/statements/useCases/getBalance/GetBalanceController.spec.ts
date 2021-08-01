/**
 * Created by Pablo Silva
 * Date: 2021/07/20
 * Time: 15:04
 */


import {app} from "../../../../app";
import {Connection, createConnection} from "typeorm";
import request from "supertest";

let connection: Connection;

describe("Get Statements Balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to receive a token and get balance - 200", async () => {
    await request(app).post("/api/v1/users/").send({
      name: "User3",
      email: "test3@email.com",
      password: "admin",
    });

    const responseToken = await request(app).post("/api/v1/sessions/").send({
      email: "test3@email.com",
      password: "admin",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({ amount: 100, description: "deposit" })
      .set({ Authorization: `Bearer ${token}` });

    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({ amount: 50, description: "withdraw" })
      .set({ Authorization: `Bearer ${token}` });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` });

    const {balance} = response.body

    expect(response.status).toBe(200);
    expect(balance).toBe(50);
  });
});
