import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

@Schema()
export class Location {
  @ApiProperty({ description: 'Country', example: 'US' })
  @Prop({ required: true })
  country: string;

  @ApiProperty({ description: 'Region/State', example: 'California' })
  @Prop({ required: true })
  region: string;

  @ApiProperty({ description: 'City', example: 'San Francisco' })
  @Prop({ required: true })
  city: string;
}

@Schema({ timestamps: true })
export class GeoDns extends Document {
  @ApiProperty({ description: 'DNS domain', example: 'example.com' })
  @Prop({ required: true })
  domain: string;

  @ApiProperty({ description: 'DNS record type (A, CNAME, MX)', enum: ['A', 'CNAME', 'MX'], example: 'A' })
  @Prop({ required: true })
  recordType: string;

  @ApiProperty({ description: 'Target IP or hostname', example: '192.0.2.1' })
  @Prop({ required: true })
  target: string;

  @ApiProperty({ description: 'Geographic location', type: Location })
  @Prop({ type: Location })
  location: Location;

  @ApiProperty({ description: 'Associated routes', type: [String] })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Route' }] })
  routes?: Types.ObjectId[];

  @ApiProperty({ description: 'Associated agents', type: [String] })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Agent' }] })
  agents?: Types.ObjectId[];

  @ApiProperty({ description: 'Anycast enabled', example: false })
  @Prop({ default: false })
  anycast: boolean;

  @ApiProperty({ description: 'Owner user ID', type: String })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner?: Types.ObjectId;
}

export const GeoDnsSchema = SchemaFactory.createForClass(GeoDns);
