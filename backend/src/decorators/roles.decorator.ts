import { SetMetadata } from "@nestjs/common";
import { Role } from "src/modules/users/dto/roles.enum";

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles)