import prismaClient from "../src/lib/prisma";
import request from "supertest";
import app from "../src/app";

export let token1: string;
export let token2: string;
export let userId1: number;
export let userId2: number;
export let projectId1: number;
export let projectId2: number;

export async function createTestUser(
  name: string,
  password: string,
  email: string,
) {
  return await request(app).post("/api/users/register").send({
    name: name,
    password: password,
    email: email,
  });
}

export async function createTestProject(name: string, token: string) {
  return await request(app)
    .post("/api/projects")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: name,
    });
}

beforeAll(async () => {
  await prismaClient.task.deleteMany({});
  await prismaClient.projectMember.deleteMany({});
  await prismaClient.project.deleteMany({});
  await prismaClient.user.deleteMany({});
});

afterAll(async () => {
  await prismaClient.task.deleteMany({});
  await prismaClient.projectMember.deleteMany({});
  await prismaClient.project.deleteMany({});
  await prismaClient.user.deleteMany({});
  await prismaClient.$disconnect();
});
