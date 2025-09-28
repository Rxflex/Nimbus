import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  username: string;
  role: string;
}

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey', // TODO: Move to environment variables
    });
  }

  async validate(payload: JwtPayload): Promise<{ userId: string; username: string; role: string }> {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
