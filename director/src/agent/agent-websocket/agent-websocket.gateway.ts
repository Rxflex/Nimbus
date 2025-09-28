import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AgentService } from '../agent/agent.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../../auth/guards/ws-jwt-auth.guard'; // Assume similar guard for WS

@UseGuards(WsJwtAuthGuard)
@WebSocketGateway({ cors: true })
export class AgentWebsocketGateway {
  constructor(private agentService: AgentService) {}

  @SubscribeMessage('agent-connect')
  async handleAgentConnect(@MessageBody() data: { agentId: string }, @ConnectedSocket() client: any) {
    // Validate agentId, assign client to agent room
    client.join(`agent-${data.agentId}`);
    return { status: 'connected' };
  }

  @SubscribeMessage('config-update')
  async handleConfigUpdate(@MessageBody() data: { userId: string }, @ConnectedSocket() client: any) {
    // Send config updates to user's agents
    const agents = await this.agentService.findAllAgents(data.userId);
    for (const agent of agents) {
      const agentId = String(agent._id);
      const config = await this.agentService.getConfigForAgent(agentId);
      client.to(`agent-${agentId}`).emit('config-update', config);
    }
  }
}
