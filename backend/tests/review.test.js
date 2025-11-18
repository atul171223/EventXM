import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/server.js";
import { connectTestDB, closeTestDB } from "./test-db.js";
import User from "../src/models/User.js";
import Event from "../src/models/Event.js";

let token;
let eventId;

beforeAll(async () => {
  await connectTestDB();

  const user = await User.create({
    name: "Atul",
    email: "atul@test.com",
    password: "123456",
    role: "customer"
  });

  token = jwt.sign({ id: user._id, role: user.role }, "testsecret");

  const event = await Event.create({
    title: "Test Event",
    description: "Test event description",
    category: "Tech",
    date: new Date(),
    location: "Test Location",
    organizer: user._id,
    status: "approved"
  });

  eventId = event._id;
}, 30000);

afterAll(async () => {
  await closeTestDB();
});

describe("Review API", () => {
  test("GET empty reviews", async () => {
    const res = await request(app).get(`/api/reviews/${eventId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.reviews)).toBe(true);
  });
});