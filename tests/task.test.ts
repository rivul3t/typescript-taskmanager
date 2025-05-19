import request from 'supertest';
import app from '../src/app';
import { createTestProject, createTestUser } from './setup';

describe('Task API', () => {
    let token1: string;
    let token2: string;
    let projectId1: number;
    let projectId2: number;

    beforeAll(async () => {
        
        const user1 = await createTestUser('testTask1', 'aboba', 'test@ac.com');
        const user2 = await createTestUser('testTask2', 'aboba', 'test@bc.com');

        token1 = user1.body.token;
        token2 = user2.body.token;

        const project1 = await createTestProject('testProject1', token1);
        const project2 = await createTestProject('testProject2', token2);

        projectId1 = project1.body.id;
        projectId2 = project2.body.id;
    });


    it('should create new task', async () => {
        const task = await request(app)
            .post(`/api/projects/${projectId1}/tasks`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                name: 'New taskie',
            });        

        expect(task.status).toBe(200);
        expect(task.body).toHaveProperty('id');
    });

    it('should check required fields in the create request', async () => {
        const task = await request(app)
            .post(`/api/projects/${projectId1}/tasks`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                zxc: 'New taskie',
            });

        expect(task.status).toBe(400);
        expect(task.body).toHaveProperty('error');
    });

    it('should fail on create duplicate task', async () => {
        await request(app)
            .post(`/api/projects/${projectId1}/tasks`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                name: 'Test task',
            });

        const task2 = await request(app)
            .post(`/api/projects/${projectId1}/tasks`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                name: 'Test task',
            });

        expect(task2.status).toBe(409);
        expect(task2.body).toHaveProperty('error');
    });

    it('should fail create task on non-existent project', async () => {
        const task = await request(app)
            .post(`/api/projects/77777/tasks`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                name: 'New taskie',
            });

        expect(task.status).toBe(404);
        expect(task.body).toHaveProperty('error');
    });

    it('should fail create task on foreign project', async () => {
        const task = await request(app)
            .post(`/api/projects/${projectId2}/tasks`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                name: 'Test tasg',
            });

        expect(task.status).toBe(404);
        expect(task.body).toHaveProperty('error');
    });

    it('should return all tasks of project', async () => {
        const tasks = await request(app)
            .get(`/api/projects/${projectId1}/tasks`)
            .set('Authorization', `Bearer ${token1}`)

        expect(tasks.status).toBe(200);
        expect(Array.isArray(tasks.body)).toBe(true);
    });

    it('should fail on return all tasks of foreign project', async () => {
        const task = await request(app)
            .get(`/api/projects/${projectId2}/tasks`)
            .set('Authorization', `Bearer ${token1}`)

        expect(task.status).toBe(404);
        expect(task.body).toHaveProperty('error');
    });

    it('should return task of the project', async () => {

        const task = await request(app)
            .post(`/api/projects/${projectId1}/tasks`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                name: 'uUwUu',
            });
            
        const receivedTask = await request(app)
            .get(`/api/projects/${projectId1}/tasks/${task.body.id}`)
            .set('Authorization', `Bearer ${token1}`)

        expect(receivedTask.status).toBe(200);
        expect(receivedTask.body).toHaveProperty('id');
        expect(receivedTask.body.id === task.body.id).toBe(true);
    });

    it('should fail get non-existent task', async () => {
            
        const receiveTask = await request(app)
            .get(`/api/projects/${projectId1}/tasks/77777`)
            .set('Authorization', `Bearer ${token1}`)

        expect(receiveTask.status).toBe(404);
        expect(receiveTask.body).toHaveProperty('error');
    });

    it('should fail get foreign task', async () => {

        const task = await request(app)
            .post(`/api/projects/${projectId2}/tasks`)
            .set('Authorization', `Bearer ${token2}`)
            .send({
                name: 'uUuwuUu',
            });
            
        const receiveTask = await request(app)
            .get(`/api/projects/${projectId1}/tasks/${task.body.id}`)
            .set('Authorization', `Bearer ${token1}`)

        expect(receiveTask.status).toBe(404);
        expect(receiveTask.body).toHaveProperty('error');
    });

    it('should assign task', async () => {

        const task = await request(app)
            .post(`/api/projects/${projectId1}/tasks`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                name: 'CCC',
        });

        const assginedTask = await request(app)
            .patch(`/api/projects/${projectId2}/tasks/${task.body.id}/assign`)
            .set('Authorization', `Bearer ${token1}`)

        expect(assginedTask.status).toBe(200);
        expect(assginedTask.body).toHaveProperty('result');
    });

    it('should fail assign task on non-existent project', async () => {
        const task = await request(app)
            .patch(`/api/projects/${projectId2}/tasks/77777/assign`)
            .set('Authorization', `Bearer ${token1}`)


        expect(task.status).toBe(404);
        expect(task.body).toHaveProperty('error');
    });

    it('should fail assign task on foreign project', async () => {

        const task = await request(app)
            .post(`/api/projects/${projectId2}/tasks`)
            .set('Authorization', `Bearer ${token2}`)
            .send({
                name: 'CCC',
        });

        const assginedTask = await request(app)
            .patch(`/api/projects/${projectId2}/tasks/${task.body.id}/assign`)
            .set('Authorization', `Bearer ${token1}`)

        expect(assginedTask.status).toBe(404);
        expect(assginedTask.body).toHaveProperty('error');
    });

    it('should fail assign task that in progress', async () => {

        const task = await request(app)
            .post(`/api/projects/${projectId1}/tasks`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                name: 'UwU',
        });

        await request(app)
            .patch(`/api/projects/${projectId1}/tasks/${task.body.id}/assign`)
            .set('Authorization', `Bearer ${token1}`)

        await request(app)
            .patch(`/api/projects/${projectId1}/tasks/${task.body.id}/complete`)
            .set('Authorization', `Bearer ${token1}`)

        const assignedTask = await request(app)
            .patch(`/api/projects/${projectId1}/tasks/${task.body.id}/assign`)
            .set('Authorization', `Bearer ${token1}`)

        expect(assignedTask.status).toBe(404);
        expect(assignedTask.body).toHaveProperty('error');
    });

    it('should complete task', async () => {
        const task = await request(app)
            .post(`/api/projects/${projectId1}/tasks`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                name: 'UUwUU',
        });

        await request(app)
            .patch(`/api/projects/${projectId1}/tasks/${task.body.id}/assign`)
            .set('Authorization', `Bearer ${token1}`)

        const completedTask = await request(app)
            .patch(`/api/projects/${projectId1}/tasks/${task.body.id}/complete`)
            .set('Authorization', `Bearer ${token1}`)


        expect(completedTask.status).toBe(200);
        expect(completedTask.body).toHaveProperty('result');
    });

    it('should fail on completing not started task', async () => {
        const task = await request(app)
            .post(`/api/projects/${projectId1}/tasks`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                name: 'IUUwUUI',
        });


        const completedTask = await request(app)
            .patch(`/api/projects/${projectId1}/tasks/${task.body.id}/complete`)
            .set('Authorization', `Bearer ${token1}`)


        expect(completedTask.status).toBe(400);
        expect(completedTask.body).toHaveProperty('error');
    });

    it('should fail on completing non-existing task', async () => {

        const completedTask = await request(app)
            .patch(`/api/projects/${projectId1}/tasks/7777777/complete`)
            .set('Authorization', `Bearer ${token1}`)


        expect(completedTask.status).toBe(400);
        expect(completedTask.body).toHaveProperty('error');
    });

    it('should fail on completing foreign task', async () => {
        const task = await request(app)
            .post(`/api/projects/${projectId1}/tasks`)
            .set('Authorization', `Bearer ${token1}`)
            .send({
                name: 'UUwwUU',
        });

        await request(app)
            .patch(`/api/projects/${projectId1}/tasks/${task.body.id}/assign`)
            .set('Authorization', `Bearer ${token1}`)

        const completedTask = await request(app)
            .patch(`/api/projects/${projectId1}/tasks/${task.body.id}/complete`)
            .set('Authorization', `Bearer ${token2}`)


        expect(completedTask.status).toBe(400);
        expect(completedTask.body).toHaveProperty('error');
    });
});