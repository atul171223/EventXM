import request from "supertest";
import app from "../src/server.js";
import { connectTestDB, closeTestDB } from "./test-db.js";

beforeAll(async () => {
  await connectTestDB();
}, 30000);

afterAll(async () => {
  await closeTestDB();
});

describe("Stats API", () => {
  test("GET /stats/summary works", async () => {
    const res = await request(app).get("/api/stats/summary");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("totals");
  });
});