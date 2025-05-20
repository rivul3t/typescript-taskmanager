import request from "supertest";
import app from "../src/app";
import { createTestProject, createTestUser } from "./setup";

describe("Project API", () => {
  let token1: string;
  let token2: string;
  let userId2: number;

  const someProjectName = "Test project";
  let someProjectId: number;
  let anotherProjectId: number;

  beforeAll(async () => {
    const user1 = await createTestUser(
      "testProjectUser1",
      "aboba",
      "test@nc.com",
    );
    const user2 = await createTestUser(
      "testProjectUser2",
      "aboba",
      "test@mc.com",
    );

    token1 = user1.body.token;
    token2 = user2.body.token;

    userId2 = user2.body.id;
  });

  it("should properly handle bad request body", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token1}`)
      .send({
        description: "wiu",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should create a new project", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token1}`)
      .send({
        name: "Test project",
        description: "wiu",
      });

    someProjectId = res.body.id;

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
  });

  it("should fail on duplicate", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token1}`)
      .send({
        name: someProjectName,
        description: "wiu",
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
  });

  it("should return only user projects", async () => {
    const anotherProject = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token2}`)
      .send({
        name: "Another project",
        description: "You could not see that project",
      });

    anotherProjectId = anotherProject.body.id;

    const res = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${token1}`);

    const found = res.body.projects.some(
      (project: any) => project.id === anotherProjectId,
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.projects)).toBe(true);
    expect(found).toBe(false);
  });

  it("should return project by its id", async () => {
    const res = await request(app)
      .get(`/api/projects/${someProjectId}`)
      .set("Authorization", `Bearer ${token1}`);

    expect(res.status).toBe(200);
    expect(res.body.project.id).toBe(someProjectId);
    expect(res.body.project.name).toBe(someProjectName);
  });

  it("should handle bad project id", async () => {
    const res = await request(app)
      .get(`/api/projects/999`)
      .set("Authorization", `Bearer ${token1}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should not return foreign project", async () => {
    const res = await request(app)
      .get(`/api/projects/${anotherProjectId}`)
      .set("Authorization", `Bearer ${token1}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should add new member", async () => {
    const res = await request(app)
      .post(`/api/projects/${someProjectId}/members`)
      .set("Authorization", `Bearer ${token1}`)
      .send({
        user_id: userId2,
      });

    expect(res.status).toBe(200);
    expect(res.body.member.userId).toBe(userId2);
    expect(res.body.member.projectId).toBe(someProjectId);
  });

  it("should check that user already member", async () => {
    const res = await request(app)
      .post(`/api/projects/${someProjectId}/members`)
      .set("Authorization", `Bearer ${token1}`)
      .send({
        user_id: userId2,
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
  });

  it("should check that user_id field specified", async () => {
    const res = await request(app)
      .post(`/api/projects/${anotherProjectId}/members`)
      .set("Authorization", `Bearer ${token1}`)
      .send({
        aboba: "123",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should check that only can owner add new member", async () => {
    const res = await request(app)
      .post(`/api/projects/${anotherProjectId}/members`)
      .set("Authorization", `Bearer ${token1}`)
      .send({
        user_id: userId2,
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("error");
  });
});
