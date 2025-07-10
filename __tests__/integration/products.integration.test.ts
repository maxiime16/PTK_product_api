import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from "jsonwebtoken";
import app from "../../src/server.js";

describe("Products API Integration", () => {
  let mongoServer: MongoMemoryServer;

  const token = jwt.sign(
    { id: "test-user", role: "admin" },
    process.env.JWT_SECRET || "super-secret",
    { expiresIn: "1h" }
  );

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  it("should create a product", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Product",
        price: 42,
      })
      .expect(201);

    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Test Product");
  });
});