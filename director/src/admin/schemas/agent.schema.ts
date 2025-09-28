import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type Capabilities = {
  http: boolean;
  https: boolean;
  tcp: boolean;
  udp: boolean;
  dns: boolean;
};

export class CapabilitiesSchema {
  @ApiProperty({ description: 'HTTP proxy capability', example: false })
  http: boolean;

  @ApiProperty({ description: 'HTTPS proxy capability', example: false })
  https: boolean;

  @ApiProperty({ description: 'TCP proxy capability', example: false })
  tcp: boolean;

  @ApiProperty({ description: 'UDP proxy capability', example: false })
  udp: boolean;

  @ApiProperty({ description: 'DNS proxy capability', example: false })
  dns: boolean;
}

@Schema({ timestamps: true })
export class Agent extends Document {
  @ApiProperty({ description: 'Agent name', example: 'MyAgent' })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ description: 'Agent IP address', example: '192.168.1.1' })
  @Prop({ required: true })
  ip: string;

  @ApiProperty({ description: 'Agent port', example: 8080 })
  @Prop({ required: true })
  port: number;

  @ApiProperty({ description: 'Agent capabilities', type: CapabilitiesSchema })
  @Prop({
    type: {
      http: { type: Boolean },
      https: { type: Boolean },
      tcp: { type: Boolean },
      udp: { type: Boolean },
      dns: { type: Boolean },
    },
    default: { http: false, https: false, tcp: false, udp: false, dns: false },
  })
  capabilities: Capabilities;

  @ApiProperty({ description: 'Agent status', enum: ['connected', 'disconnected'], example: 'connected' })
  @Prop({ default: 'disconnected' })
  status: string;

  @ApiProperty({ description: 'Last heartbeat timestamp', example: new Date() })
  @Prop({ default: Date.now })
  lastHeartbeat: Date;

  @ApiProperty({ description: 'Owner user ID', type: String, example: '507f1f77bcf86cd799439011' })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner?: Types.ObjectId;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
