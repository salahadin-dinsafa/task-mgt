import { Role } from "@app/auth/types/role.enum";

export interface JwtPayload {
    username: string,
    role: Role
}