import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema()
export class Group extends Document {
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
  groupCode: string;

  @Prop({
    required: true,
    type: String,
    index: true,
    unique: true,
  })
  groupId: string;

  @Prop({
    type: String,
  })
  groupTitle: string;

  @Prop({
    type: String,
  })
  groupType: string;

  @Prop({
    required: true,
    type: Boolean,
    default: false,
  })
  isActive: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
