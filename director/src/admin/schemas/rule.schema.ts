import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { Agent } from './agent.schema';

@Schema({ timestamps: true })
export class Rule extends Document {
  @ApiProperty({ description: 'Rule name', example: 'BlockAds' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Rule type', enum: ['http', 'https', 'tcp', 'udp', 'dns'], example: 'http' })
  @Prop({
    required: true,
    enum: ['http', 'https', 'tcp', 'udp', 'dns'],
  })
  type: string;

  @ApiProperty({ description: 'Match pattern or host', example: '*.ads.com' })
  @Prop({ required: true })
  match: string;

  @ApiProperty({ description: 'Action to take', enum: ['proxy', 'redirect', 'block'], example: 'block' })
  @Prop({ required: true })
  action: string;

  @ApiProperty({ description: 'Target backend', example: '192.168.1.100:80' })
  @Prop({ required: true })
  target: string;

  @ApiProperty({ description: 'Associated agent', type: String })
  @Prop({ type: Types.ObjectId, ref: 'Agent', required: true })
  agent: Agent | Types.ObjectId;

  @ApiProperty({ description: 'Owner user ID', type: String })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner?: Types.ObjectId;
}

export const RuleSchema = SchemaFactory.createForClass(Rule);
