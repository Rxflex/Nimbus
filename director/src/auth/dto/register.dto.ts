import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Username', example: 'newuser' })
  @IsString()
  @MinLength(3)
  username!: string;

  @ApiProperty({ description: 'Password', example: 'strong_password_123' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ description: 'User role', enum: ['user', 'admin'], required: false })
  @IsOptional()
  @IsEnum(['user', 'admin'])
  role?: string;
}
