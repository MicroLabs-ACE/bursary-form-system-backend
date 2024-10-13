import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role, UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/user.decorator';
import { FormsService } from './forms.service';

@ApiTags('Forms')
@ApiBearerAuth()
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @ApiOperation({ summary: 'Get form templates' })
  @ApiResponse({ status: 200, description: 'Form templates retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  @Roles([Role.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getFormTemplates() {
    return await this.formsService.getFormTemplates();
  }

  @ApiOperation({ summary: 'Get form template' })
  @ApiParam({
    name: 'templateName',
    description: 'Name of form template',
    type: 'string',
  })
  @ApiResponse({ status: 200, description: 'Form template retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/:templateName')
  @Roles([Role.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getFormTemplate(@Param('templateName') templateName: string | null) {
    return await this.formsService.getFormTemplate(templateName);
  }

  @ApiOperation({ summary: 'Process a form' })
  @ApiParam({
    name: 'templateName',
    description: 'Name of form template',
    type: 'string',
  })
  @ApiResponse({ status: 200, description: 'Form template processed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('/:templateName')
  @Roles([Role.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async processForm(
    @User() user: UserDto,
    @Param('templateName') templateName: string,
    @Body() formObject: Record<string, string>,
  ) {
    await this.formsService.processForm(user.email, templateName, formObject);
  }
}
