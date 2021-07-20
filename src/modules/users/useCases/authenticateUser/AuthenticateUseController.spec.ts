/**
 * Created by Pablo Silva
 * Date: 2021/07/19
 * Time: 13:17
 */

import {Connection, createConnection} from "typeorm";
import request from "supertest";
import {app} from "../../../../app";
let connection: Connection;

describe("authenticate controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {

    await request(app)
      .post("/api/v1/users")
      .send({
        name: "name",
        email: "email",
        password: "password"
      });

    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "email",
        password: "password"
      });

    expect(response.body).toHaveProperty("token");

  });

  it("should not be able to authenticate an nonexistent user", async () => {
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "use@user.com.br",
        password: "user"
      });

    expect(response.status).toBe(401);
  });

  it("should not be able to authenticate an user with wrong password", async () => {
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@user.com.br",
        password: "use"
      });

    expect(response.status).toBe(401);
  });
});
