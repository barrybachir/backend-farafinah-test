import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("Auth routes", () => {
  it("GET /api/auth should return route information", async () => {
    const response = await request(app).get("/api/auth");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Route auth active. Utilise POST /api/auth pour te connecter.",
    });
  });

  it("POST /api/auth should return 400 when body is missing", async () => {
    const response = await request(app).post("/api/auth");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "username et password sont requis",
    });
  });
});
