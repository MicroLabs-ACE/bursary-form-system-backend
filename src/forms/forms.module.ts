import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import {
  FormTemplate,
  FormTemplateSchema,
} from 'src/schemas/form-template.schema';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: FormTemplate.name, schema: FormTemplateSchema },
    ]),
  ],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
