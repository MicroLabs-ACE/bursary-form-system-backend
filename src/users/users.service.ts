import { Injectable } from '@nestjs/common';
import userData from 'src/data/user-data.json';
import { userDto, UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  private readonly users: UserDto[];
  constructor() {
    this.users = userData.map((user) => {
      return userDto.parse(user);
    });
  }

  async findOne(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
