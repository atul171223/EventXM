import request from "supertest";
import app from "../src/server.js";
import { connectTestDB, closeTestDB } from "./test-db.js";

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("Events API", () => {
  test("GET /events returns list", async () => {
    const res = await request(app).get("/api/events");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.events)).toBe(true);
  });
});