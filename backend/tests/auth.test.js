import request from "supertest";
import app from "../src/server.js";
import { connectTestDB, closeTestDB } from "./test-db.js";

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("Auth API", () => {
  test("Login without body returns 400", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.statusCode).toBe(400);
  });
});