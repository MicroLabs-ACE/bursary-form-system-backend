import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { FormObject, FormObjectSchema } from 'src/schemas/form-object.schema';
import {
  FormTemplate,
  FormTemplateSchema,
} from 'src/schemas/form-template.schema';
import { UserMeta, UserMetaSchema } from 'src/schemas/user-meta.schema';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: FormTemplate.name, schema: FormTemplateSchema },
      { name: FormObject.name, schema: FormObjectSchema },
      { name: UserMeta.name, schema: UserMetaSchema },
    ]),
  ],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
