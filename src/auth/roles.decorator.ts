import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/dto/user.dto';

export const Roles = Reflector.createDecorator<Role[]>();
