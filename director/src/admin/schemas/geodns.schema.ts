import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Agent } from './agent.schema';
import { Route } from './route.schema';

@Schema()
export class Location {
  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  city: string;
}

@Schema({ timestamps: true })
export class GeoDns extends Document {
  @Prop({ required: true })
  domain: string; // DNS domain

  @Prop({ required: true })
  recordType: string; // e.g., 'A', 'CNAME', 'MX'

  @Prop({ required: true })
  target: string; // IP or hostname

  @Prop({ type: Location })
  location: Location; // Geo-specific

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Route' }] })
  routes?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Agent' }] })
  agents?: Types.ObjectId[];

  @Prop({ default: false })
  anycast: boolean;
}

export const GeoDnsSchema = SchemaFactory.createForClass(GeoDns);
