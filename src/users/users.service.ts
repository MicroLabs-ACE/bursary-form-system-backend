import { Injectable } from '@nestjs/common';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  private readonly users: GetUserDto[] = [
    {
      firstName: 'Olubukola',
      lastName: 'Balogun',
      email: 'olubukolabalogun@oauife.edu.ng',
    },
    {
      firstName: 'Mr',
      lastName: 'Adelakun',
      email: 'adelakun@oauife.edu.ng',
    },
    {
      firstName: 'Olubunmi',
      lastName: 'Kuye',
      email: 'olubunmikuye@oauife.edu.ng',
    },
    {
      firstName: 'Olufunso',
      lastName: 'Omoseani',
      email: 'omoseani@oauife.edu.ng',
    },
    {
      firstName: 'Victor',
      lastName: 'Momodu',
      middleName: 'Adebowale',
      email: 'victoramomodu@gmail.com',
    },
    {
      firstName: 'Daniel',
      lastName: 'Ogunsola',
      email: 'thannie016@gmail.com',
    },
    {
      firstName: 'Oluwasanmi',
      lastName: 'Ogunyemi',
      middleName: 'Hezekiah',
      email: 'helxie3@gmail.com',
    },
  ];

  async findOne(email: string) {
    return this.users.find((user) => user.email === email);
  }
}
