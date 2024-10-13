import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role, UserDto } from './dto/user.dto';
import { User } from './user.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'User profile' })
  @ApiResponse({ status: 200, description: 'User profile displayed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('me')
  @Roles([Role.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async profile(@User() user: UserDto) {
    return user;
  }
}
