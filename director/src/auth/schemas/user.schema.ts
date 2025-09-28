import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @ApiProperty({ description: 'Username', example: 'user1' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ description: 'Password (not shown in responses)', example: 'hashedpassword' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ description: 'User role', enum: ['user', 'admin'], example: 'user' })
  @Prop({ default: 'user' })
  role: string;

  @ApiProperty({ description: 'User API key', example: 'api123456' })
  @Prop({ required: true, unique: true })
  apiKey: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
