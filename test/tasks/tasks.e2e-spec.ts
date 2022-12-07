import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import * as request from 'supertest';

import { TaskStatus } from '../../src/tasks/types/task-status.enum';

const mockTask = {
    title: 'test task title',
    description: 'test task description'
}

describe('TasksController (e2d)', () => {
    const taskUrl = 'http://localhost:3000/api/tasks';
    const token =
        `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjcwNDI2NjY1LCJleHAiOjE2NzA0MzAyNjV9.OBD7NdzzVFopKXhj3NrmSpSIJdEXeSjpjOc8Zp-oSp0`
    const deleteTaskId = 5;

    describe('tasks/ (GET)', () => {
        describe('When successfuly retrived', () => {
            it('should return all tasks', () => {
                return request(taskUrl)
                    .get('/')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(async (response: request.Response) => {

                        const result = await response.body;
                        expect(result).toBeDefined();
                        expect(result).toBeInstanceOf(Array);
                    })
                    .expect(HttpStatus.OK)
            })
            it('should return task with pagination limit=1 offset=0', () => {
                return request(taskUrl)
                    .get('/?limit=1&offset=0')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(async (response: request.Response) => {

                        const result = await response.body;
                        expect(result).toBeDefined();
                        expect(result).toBeInstanceOf(Array);
                    })
                    .expect(HttpStatus.OK)
            })
        })
        describe('Otherwise', () => {
            it('should throw exception if user not logged in', () => {
                return request(taskUrl)
                    .get('/')
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.UNAUTHORIZED)
            })
        })
    })
    describe('tasks/{id} (GET)', () => {
        describe('When a task retrived successfuly', () => {
            it('should return a task object', () => {
                return request(taskUrl)
                    .get('/1')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(async (response: request.Response) => {
                        const result = await response.body;
                        expect(result).toBeDefined();
                        expect(result.id).toEqual(1);
                    })
                    .expect(HttpStatus.OK)

            })
        })
        describe('Otherwise', () => {
            it('should throw exception if user not logged in', () => {
                return request(taskUrl)
                    .get('/1')
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.UNAUTHORIZED)
            })
            it('should throw exception if task not found', () => {
                return request(taskUrl)
                    .get(`/300`)
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(HttpStatus.NOT_FOUND)

            })
        })
    })
    describe('tasks/ (POST)', () => {
        describe('When a task is successfuly created', () => {
            it('should create a task', () => {
                return request(taskUrl)
                    .post('/')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send(mockTask)
                    .expect(async (response: request.Response) => {
                        const result = await response.body;
                        expect(result).toBeDefined();
                        expect(result.title).toEqual(mockTask.title);
                        expect(result.status).toEqual(TaskStatus.OPEN);
                    })
                    .expect(HttpStatus.CREATED)
            })
        })
        describe('Otherwise', () => {
            it('should throw exception if user not logged in', () => {
                return request(taskUrl)
                    .post('/')
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.UNAUTHORIZED);
            })
        })
    })
    describe('tasks/{id} (PATCH)', () => {
        describe('When successfuly updated', () => {
            it('should update a task', () => {
                return request(taskUrl)
                    .patch('/1/status')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ status: TaskStatus.DONE })
                    .expect(async (response: request.Response) => {
                        const result = await response.body;
                        expect(result).toBeDefined();
                        expect(result.status).toEqual(TaskStatus.DONE);
                    })
                    .expect(HttpStatus.OK)
            })
        })
        describe('Otherwise', () => {
            it('should throw exception if user not logged in', () => {
                return request(taskUrl)
                    .patch('/1/status')
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.UNAUTHORIZED)
            })
            it('should throw exception if status payload not provided', () => {
                return request(taskUrl)
                    .patch('/3000/status')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(HttpStatus.BAD_REQUEST)
            })
            it('should throw exception if task not found', () => {
                return request(taskUrl)
                    .patch('/3000/status')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ status: TaskStatus.IN_PROGRESS })
                    .expect(HttpStatus.NOT_FOUND)
            })
        })
    })
    describe('tasks/{id} (DELETE)', () => {
        describe('When a task is successfuly deleted', () => {
            it('should delete a task', () => {
                return request(taskUrl)
                    .delete(`/${deleteTaskId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(HttpStatus.OK)
            })
        })
        describe('Otherwise', () => {
            it('should throw exception if user not logged in', () => {
                return request(taskUrl)
                    .delete(`/${deleteTaskId}`)
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.UNAUTHORIZED)
            })
            it('should throw exception if task not found', () => {
                return request(taskUrl)
                    .delete(`/${deleteTaskId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .expect(HttpStatus.NOT_FOUND)
            })
        })
    })
})