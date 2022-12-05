import {
    ConflictException, Injectable,
    InternalServerErrorException, Logger, UnauthorizedException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { compare } from 'bcryptjs';

import { SignupType } from '@app/auth/types/signup.interface';
import { UserEntity } from '@app/auth/entities/user.entity';
import { LoginType } from '@app/auth/types/login.interface';
import { JwtPayload } from '@app/auth/types/jwt-payload.interface';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) { }

    async findByName(username: string): Promise<UserEntity> {
        let user: UserEntity;
        try {
            user = await this.userRepository.findOne({ where: { username } });
        } catch (error) {
            this.logger.error(`${error.message}`)
            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
        return user;
    }
    async signup(signup: SignupType): Promise<UserEntity> {
        const { username, password } = signup;
        try {
            const user = this.userRepository.create({
                username,
                password
            })
            return await this.userRepository.save(user);
        } catch (error) {
            this.logger.error(`${error.message}`)
            if (error.code === '23505') throw new ConflictException('user already exist');
            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
    }

    async login(login: LoginType): Promise<{ accessToken: string }> {
        const { username, password } = login;
        let user: UserEntity = await this.findByName(username);

        if (!user) throw new
            UnauthorizedException('Invalid Creadential');

        const isValidPassword: boolean = await compare(password, user.password);

        if (!isValidPassword) throw new
            UnauthorizedException('Invalid Creadential');
        const payload: JwtPayload = ({ username, role: user.role });
        const accessToken: string = await this.jwtService.signAsync(payload);
        return { accessToken }
    }
}
