import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema()
export class Admin extends Document {
  @Prop({
    required: true,
    type: String,
    default: uuid,
    index: true,
  })
  _id: string;

  @Prop({
    required: true,
    type: String,
    index: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
    type: Boolean,
    default: false,
  })
  isActive: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
