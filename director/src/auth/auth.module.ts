import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { WsJwtAuthGuard } from './guards/ws-jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { AuthController } from './auth/auth.controller';
import { WsJwtStrategy } from './strategies/ws-jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: 'secretKey', // TODO: Move to environment variables
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard, WsJwtStrategy, WsJwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtStrategy, JwtAuthGuard, RolesGuard, WsJwtStrategy, WsJwtAuthGuard, AuthService],
})
export class AuthModule {}
