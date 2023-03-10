import { ForbiddenException, Injectable } from "@nestjs/common";

import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { AuthService } from "../auth.service";
import { UserEntity } from "../entities/user.entity";
import { JwtPayload } from "../types/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(payload: JwtPayload): Promise<UserEntity> {
        const user: UserEntity =
            await this.authService.findByName(payload.username);
        if (!user) throw new ForbiddenException();
        return user;
    }
}