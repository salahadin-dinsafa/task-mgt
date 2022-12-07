import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AuthService } from "./auth.service";
import { UserEntity } from "./entities/user.entity";
import { LoginType } from "./types/login.interface";
import { SignupType } from "./types/signup.interface";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockJwtService = Partial<Record<keyof JwtService, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn()
})
const createMockJwtService = (): MockJwtService => ({
    signAsync: jest.fn(),
})
describe('AuthService', () => {
    let authService: AuthService;
    let userRepository: MockRepository;
    jest.setTimeout(30);
    
    const mockUser = {
        username: 'foo',
        password: '$2a$15$ruyi7lFfNFSoQoLaFMKiP.Fe6h6bT6Z.Ofab9ceu77x3HWkCBTMl2',
        role: 'USER'
    }
    const mockSignupType: SignupType = { username: 'foooo', password: 'foooo' }
    const mockloginType: LoginType = { username: 'foo', password: 'A/ur14648/10' }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: createMockJwtService()
                },
                { provide: getRepositoryToken(UserEntity), useValue: createMockRepository() }
            ]
        })
            .compile();

        authService = module.get<AuthService>(AuthService);
        userRepository = module.get<MockRepository>(getRepositoryToken(UserEntity));
    })

    it('should be defined', () => {
        expect(authService).toBeDefined();
    })

    describe('findByName', () => {
        describe('When user with USERNAME exists', () => {
            it('should return user', async () => {
                const username: string = 'admin';
                const expectedUser = {};

                userRepository.findOne.mockReturnValue(expectedUser);
                const user = await authService.findByName(username);
                expect(user).toEqual(expectedUser);
            })
        })
        describe('Otherwise', () => {
            it('should return null', async () => {
                const username: string = 'folofolofolo';

                userRepository.findOne.mockReturnValue(null);
                const user = await authService.findByName(username);
                expect(user).toEqual(null)
            })
        })
    })
    describe('signup', () => {
        describe('When the user successfuly signed up', () => {
            it('should return user', async () => {
                userRepository.save.mockReturnValue(mockUser);
                const user = await authService.signup(mockSignupType);
                expect(user).toEqual(mockUser);
            })
        })
        describe('Otherwise', () => {
            it('should throw exception', async () => {
                userRepository.save.mockReturnValue(undefined);
                try {
                    await authService.signup({ ...mockSignupType, username: 'admin' });
                } catch (error) {
                    expect(error).toBeInstanceOf(ConflictException);
                    expect(error.message).toEqual('user already exist');
                }
            })
        })
    })
    describe('login', () => {
        describe('When user successfuly logged in', () => {
            it('should return accessToken', async () => {
                userRepository.findOne.mockReturnValue(mockUser);
                const accessToken = await authService.login(mockloginType);
                expect(accessToken).toBeDefined(),
                    expect(accessToken).toBeInstanceOf(Object)
            })
        })
        describe('Otherwise', () => {
            it('should throw exception if user does not exist', async () => {
                try {
                    const accessToken = await authService.login(mockloginType);
                    expect(accessToken).toThrowError();
                } catch (error) {
                    expect(error).toBeInstanceOf(UnauthorizedException);
                    expect(error.message).toEqual('Invalid Creadential');
                }
            })
            it('should throw exception if password not correct', async () => {
                userRepository.findOne.mockReturnValue(mockUser);
                try {
                    const accessToken = await authService.login({ ...mockloginType, password: 'wrongpassword' });
                    expect(accessToken).toThrowError();
                } catch (error) {
                    expect(error).toBeInstanceOf(UnauthorizedException);
                    expect(error.message).toEqual('Invalid Creadential')
                }

            })
        })
    })
})