// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  profileImageUrl?: string; // Add this line
  // Add any other fields you have
}

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop()
  password: string;

  @Prop()
  googleId: string;

  @Prop()
  email: string;

  @Prop()
  profileImageUrl: string; // Add this line
}

export const UserSchema = SchemaFactory.createForClass(User);
