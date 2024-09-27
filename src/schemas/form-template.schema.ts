import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type FormTemplateDocument = HydratedDocument<FormTemplate>;

@Schema()
export class FormTemplate {
  @Prop({ required: true, unique: true, index: true })
  name!: string;

  @Prop({ required: true })
  displayName!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, type: [String] })
  rules!: string[];

  @Prop({ required: true, type: SchemaTypes.Map, of: SchemaTypes.Mixed })
  format!: object;
}

export const FormTemplateSchema = SchemaFactory.createForClass(FormTemplate);
