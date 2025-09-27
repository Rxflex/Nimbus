import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Agent } from './agent.schema';

@Schema({ timestamps: true })
export class Route extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  source: string; // Source IP:port or domain

  @Prop({ required: true })
  destination: string; // Destination target

  @Prop({
    required: true,
    enum: ['http', 'https', 'tcp', 'udp'],
  })
  protocol: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Agent' }], required: true })
  agents: Agent[] | Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Rule' }] })
  rules?: Types.ObjectId[];
}

export const RouteSchema = SchemaFactory.createForClass(Route);
