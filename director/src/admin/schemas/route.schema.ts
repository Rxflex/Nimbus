import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { Agent } from './agent.schema';

@Schema({ timestamps: true })
export class Route extends Document {
  @ApiProperty({ description: 'Route name', example: 'MyRoute' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Source IP:port or domain', example: '192.168.1.1:80' })
  @Prop({ required: true })
  source: string;

  @ApiProperty({ description: 'Destination target', example: 'example.com' })
  @Prop({ required: true })
  destination: string;

  @ApiProperty({ description: 'Protocol', enum: ['http', 'https', 'tcp', 'udp'], example: 'http' })
  @Prop({
    required: true,
    enum: ['http', 'https', 'tcp', 'udp'],
  })
  protocol: string;

  @ApiProperty({ description: 'Associated agents', type: [String] })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Agent' }], required: true })
  agents: Agent[] | Types.ObjectId[];

  @ApiProperty({ description: 'Associated rules', type: [String] })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Rule' }] })
  rules?: Types.ObjectId[];

  @ApiProperty({ description: 'Owner user ID', type: String })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner?: Types.ObjectId;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
