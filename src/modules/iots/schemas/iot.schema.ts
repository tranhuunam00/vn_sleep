import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type IotDocument = HydratedDocument<Iot>;

@Schema()
export class Iot {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
  })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ required: true })
  value: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const IotSchema = SchemaFactory.createForClass(Iot);
