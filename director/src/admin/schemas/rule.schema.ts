import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Agent } from './agent.schema';

@Schema({ timestamps: true })
export class Rule extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['http', 'https', 'tcp', 'udp', 'dns'],
  })
  type: string;

  @Prop({ required: true })
  match: string; // Pattern or host

  @Prop({ required: true })
  action: string; // e.g., 'proxy', 'redirect', 'block'

  @Prop({ required: true })
  target: string; // Backend IP:port or domain

  @Prop({ type: Types.ObjectId, ref: 'Agent', required: true })
  agent: Agent | Types.ObjectId;
}

export const RuleSchema = SchemaFactory.createForClass(Rule);
