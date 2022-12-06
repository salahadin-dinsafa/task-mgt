import { Role } from "../types/role.enum";

export interface JwtPayload {
    username: string,
    role: Role
}