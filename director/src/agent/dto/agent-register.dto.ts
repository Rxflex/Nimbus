import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Capabilities, CapabilitiesSchema } from '../../admin/schemas/agent.schema';

export class AgentRegisterDto {
  @ApiProperty({ description: 'Agent name', example: 'MyAgent' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Agent IP address (auto-detected if not provided)', example: '192.168.1.1' })
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiProperty({ description: 'Agent port (defaults to 8080 if not provided)', example: 8080 })
  @IsNumber()
  @IsOptional()
  port?: number;

  @ApiProperty({ description: 'Agent capabilities (defaults to all enabled if not provided)', type: CapabilitiesSchema })
  @IsOptional()
  capabilities?: Capabilities;
}
