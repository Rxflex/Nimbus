import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', description: 'JWT access token' },
      },
    },
    description: 'User logged in successfully',
  })
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    const payload = { sub: user._id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }


  // Admin user management endpoints
  @Get('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiOkResponse({ type: [User], description: 'List of users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAllUsers() {
    return this.authService.findAllUsers();
  }

  @Get('users/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ type: User, description: 'User details' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findUser(@Param('id') id: string) {
    return this.authService.findUser(id);
  }

  @Put('users/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: User })
  @ApiOkResponse({ type: User, description: 'User updated' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UsePipes(new ValidationPipe())
  async updateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async removeUser(@Param('id') id: string) {
    return this.authService.removeUser(id);
  }
}
