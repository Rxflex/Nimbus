import { Module } from '@nestjs/common';
import { AgentService } from './agent/agent.service';
import { AgentController } from './agent/agent.controller';
import { AgentWebsocketGateway } from './agent-websocket/agent-websocket.gateway';
import { AdminModule } from '../admin/admin.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AdminModule, AuthModule],
  providers: [AgentService, AgentWebsocketGateway],
  controllers: [AgentController],
})
export class AgentModule {}
