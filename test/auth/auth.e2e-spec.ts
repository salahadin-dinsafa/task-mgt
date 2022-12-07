import { HttpStatus } from "@nestjs/common";

import { Role } from "../../src/auth/types/role.enum";

import * as request from 'supertest';

const mockUser = {
    username: 'testuser',
    password: 'testPassword1234.',
}

describe('AuthController (e2e)', () => {
    const authUrl = 'http://localhost:3000/api/auth';

    describe('auth/signup (POST)', () => {
        describe('When user successfuly registered', () => {
            it('should register a user and return a new user object', () => {
                return request(authUrl)
                    .post('/signup')
                    .set('Accept', 'application/json')
                    .send(mockUser)
                    .expect(async (response: request.Response) => {
                        const result = await response.body;
                        expect(result).toBeDefined();
                        expect(typeof result.id).toBe('number');
                        expect(result.username).toEqual(mockUser.username);
                        expect(result.role).toEqual(Role.USER);
                    })
                    .expect(HttpStatus.CREATED);
            })
        })
        describe('Otherwise', () => {
            it('should not register if username and password not given', () => {
                return request(authUrl)
                    .post('/signup')
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.BAD_REQUEST);
            })
            it('should not register if username is to short', () => {
                return request(authUrl)
                    .post('/signup')
                    .set('Accept', 'application/json')
                    .send({ ...mockUser, username: 't' })
                    .expect(HttpStatus.BAD_REQUEST);
            })
            it('should not register if password is to weak', () => {
                return request(authUrl)
                    .post('/signup')
                    .set('Accept', 'application/json')
                    .send({ ...mockUser, password: 'weak' })
                    .expect(HttpStatus.BAD_REQUEST);
            })
            it('should not register if user already exist', () => {
                return request(authUrl)
                    .post('/signup')
                    .set('Accept', 'application/json')
                    .send(mockUser)
                    .expect(HttpStatus.CONFLICT);
            })

        })
    })

    describe('auth/login (POST)', () => {
        describe('When successfuly logged in', () => {
            it('should return accesstoken', () => {
                return request(authUrl)
                    .post('/login')
                    .set('Accept', 'application/json')
                    .send(mockUser)
                    .expect(async (response: request.Response) => {
                        const result = await response.body;
                        expect(result).toBeDefined();
                        expect(typeof result.accessToken).toBe('string');
                    })
                    .expect(HttpStatus.CREATED)
            })
        })
        describe('Otherwise', () => {

            it('should not logged in if username and password not given', () => {
                return request(authUrl)
                    .post('/login')
                    .set('Accept', 'application/json')
                    .expect(HttpStatus.BAD_REQUEST)
            })
            it('should not logged in if username is incorrect', () => {
                return request(authUrl)
                    .post('/login')
                    .set('Accept', 'application/json')
                    .send({ ...mockUser, username: 'wrongname' })
                    .expect(HttpStatus.UNAUTHORIZED)
            })
            it('should not logged in if password is incorrect', () => {
                return request(authUrl)
                    .post('/login')
                    .set('Accept', 'application/json')
                    .send({ ...mockUser, password: 'wrongpassword' })
                    .expect(HttpStatus.UNAUTHORIZED)
            })
        })
    })

})