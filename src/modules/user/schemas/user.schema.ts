import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ROLE } from 'src/constants/app.constant';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: false,
    type: mongoose.Types.ObjectId,
  })
  _id: string;

  @Prop({ required: false })
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop({ required: true, enum: ROLE, default: ROLE.user })
  role: string;

  @Prop()
  googleId: string;

  @Prop()
  facebookId: string;

  @Prop({ default: false })
  isMember: boolean;

  @Prop({ default: false })
  isVerify: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
