import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import users from './users.json';

@Injectable()
export class UsersService {
  private readonly users: UserDto[] = users;

  async findOne(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
