import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type Capabilities = {
  http: boolean;
  https: boolean;
  tcp: boolean;
  udp: boolean;
  dns: boolean;
};

@Schema({ timestamps: true })
export class Agent extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  port: number;

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

  @Prop({ default: 'disconnected' })
  status: string;

  @Prop({ default: Date.now })
  lastHeartbeat: Date;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
