import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { FormTemplate } from './form-template.schema';
import { UserMeta } from './user-meta.schema';

export type FormObjectDocument = HydratedDocument<FormObject>;

@Schema()
export class FormObject {
  @Prop({
    type: String,
    ref: 'UserMeta',
    required: true,
  })
  userMeta!: UserMeta;

  @Prop({
    type: String,
    ref: 'FormTemplate',
    required: true,
  })
  formTemplate!: FormTemplate;

  @Prop({ required: true, type: SchemaTypes.Map, of: SchemaTypes.Mixed })
  formData!: object;
}

export const FormObjectSchema = SchemaFactory.createForClass(FormObject);
