/**
 * Created by Pablo Silva
 * Date: 2021/07/16
 * Time: 12:54
 */

import {Connection, createConnection} from "typeorm";
import request from "supertest";
import {app} from "../../../../app";
let connection: Connection;

describe("create a new user - Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should able to create a new user", async () => {

    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "name",
        email: "email",
        password: "password"
      });

    expect(response.status).toBe(201);
  });

  it("should not able to create a new user with same email", async () => {

    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "name1",
        email: "email",
        password: "password1"
      });

    expect(response.status).toBe(400);
  });

});
