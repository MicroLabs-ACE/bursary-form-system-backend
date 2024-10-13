import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { EventsModule } from 'src/events/events.module';
import { FinManagementProviderModule } from 'src/fin-management-provider/fin-management-provider.module';
import { FormObject, FormObjectSchema } from 'src/schemas/form-object.schema';
import {
  FormTemplate,
  FormTemplateSchema,
} from 'src/schemas/form-template.schema';
import { UserMeta, UserMetaSchema } from 'src/schemas/user-meta.schema';
import { UsersModule } from 'src/users/users.module';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';

@Module({
  imports: [
    AuthModule,
    EventsModule,
    UsersModule,
    FinManagementProviderModule,
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
