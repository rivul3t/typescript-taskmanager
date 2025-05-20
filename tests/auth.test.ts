import request from "supertest";
import app from "../src/app";

describe("Auth api", () => {
  const login: string = "test";
  const password: string = "test";

  it("should handle bad request I(register)", async () => {
    const res = await request(app).post("/api/users/register").send({
      password: password,
      email: "test@ma.com",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should handle bad request II(register)", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: login,

      email: "test@ma.com",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should handle bad request III(register)", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: login,
      password: password,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should successfully create user", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: login,
      password: password,
      email: "test@ma.com",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("token");
  });

  it("should fail on duplicate", async () => {
    const res = await request(app).post("/api/users/register").send({
      name: login,
      password: password,
      email: "test@ma.com",
    });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
  });

  it("should handle bad request I(login)", async () => {
    const res = await request(app).post("/api/users/login").send({
      password: password,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should handle bad request II(login)", async () => {
    const res = await request(app).post("/api/users/login").send({
      name: login,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should successfully login", async () => {
    const res = await request(app).post("/api/users/login").send({
      name: login,
      password: password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("token");
  });

  it("should handle wrong password", async () => {
    const res = await request(app).post("/api/users/login").send({
      name: login,
      password: "zxc",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should handle wrong username", async () => {
    const res = await request(app).post("/api/users/login").send({
      name: "zxc",
      password: "zxc",
    });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});
