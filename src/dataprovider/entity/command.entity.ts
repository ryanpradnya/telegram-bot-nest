import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema()
export class Command extends Document {
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
  command: string;

  @Prop({
    required: true,
    type: Boolean,
    default: false,
  })
  isActive: boolean;

  @Prop({
    required: false,
    type: String,
    default: '',
  })
  description: string;
}

export const CommandSchema = SchemaFactory.createForClass(Command);
