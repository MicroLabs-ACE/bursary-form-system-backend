import { Injectable } from '@nestjs/common';
import { Role, UserDto } from './dto/user.dto';
import userRecords from './users.json';

@Injectable()
export class UsersService {
  private readonly users: UserDto[];
  constructor() {
    this.users = userRecords.map((record) => {
      return {
        ...record,
        roles: record.roles.map((role) => role as Role),
      };
    });
  }

  async findOne(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
