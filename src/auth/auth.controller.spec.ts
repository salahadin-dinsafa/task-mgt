import { Test, TestingModule } from "@nestjs/testing"
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service"
import { SignupDto } from "./dto/signup.dto";
import { LoginType } from "./types/login.interface";
import { SignupType } from "./types/signup.interface";


const mockAuthService = {
    signup: jest.fn().mockImplementation((singup: SignupType) => {
        return {
            id: 1,
            ...singup
        }
    }),
    login: jest.fn().mockImplementation((login: LoginType) => {
        return {
            accessToken: 'access token'
        }
    })
}
const signupDto: SignupDto = { username: 'foo', password: 'fooo' }

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    jest.setTimeout(30);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService]
        })
            .overrideProvider(AuthService).useValue(mockAuthService)
            .compile()
        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    })

    it('should be defined', () => {
        expect(authController).toBeDefined();
    })

    describe('singup', () => {
        it('should return user', async () => {
            const user = await authController.signup(signupDto);
            expect(user).toBeDefined();
            expect(user).toEqual({ id: 1, ...signupDto });
        })
    })
    describe('login', () => {
        it('should return accessToken', async () => {
            const accessToken = await authController.login(signupDto);
            expect(accessToken).toBeDefined();
            expect(accessToken).toEqual({ accessToken: 'access token' });
        })
    })
})