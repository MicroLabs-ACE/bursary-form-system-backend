import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/users/dto/user.dto';
import { FormsService } from './forms.service';

@ApiTags('Forms')
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @ApiOperation({ summary: 'Get form templates' })
  @ApiQuery({
    name: 'template',
    description: 'Name of form template',
    type: 'string',
  })
  @ApiResponse({ status: 200, description: 'Form template retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiCookieAuth()
  @Get('/templates')
  @Roles([Role.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getFormTemplates(@Query('templateName') templateName: string | null) {
    return await this.formsService.getFormTemplates(templateName);
  }
}
