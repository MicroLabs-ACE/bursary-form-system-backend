import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserMetaDocument = HydratedDocument<UserMeta>;

@Schema()
export class UserMeta {
  @Prop({ required: true, unique: true, index: true })
  email!: string;

  @Prop()
  secret?: string;
}

export const UserMetaSchema = SchemaFactory.createForClass(UserMeta);
