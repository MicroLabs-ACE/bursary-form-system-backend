import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.decorator';
import { Role, UserDto } from 'src/users/dto/user.dto';
import { FormsService } from './forms.service';

@ApiTags('Forms')
@ApiCookieAuth()
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @ApiOperation({ summary: 'Get form templates' })
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
  async getFormTemplates(@Param('templateName') templateName: string | null) {
    return await this.formsService.getFormTemplates(templateName);
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
