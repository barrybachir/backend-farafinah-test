import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("Users routes security", () => {
  it("GET /api/users/me should return 401 without token", async () => {
    const response = await request(app).get("/api/users/me");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Token manquant" });
  });

  it("GET /api/users/:username should return 401 without token", async () => {
    const response = await request(app).get("/api/users/johndoe");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Token manquant" });
  });
});
