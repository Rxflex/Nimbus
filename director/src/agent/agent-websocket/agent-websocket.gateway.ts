import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AgentService } from '../agent/agent.service';

@WebSocketGateway({ namespace: 'agent', cors: true })
export class AgentWebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('AgentGateway');

  @WebSocketServer() server: Server;

  constructor(private agentService: AgentService) {}

  afterInit(server: Server) {
    this.logger.log('Agent WebSocket initialized');
  }

  handleConnection(client: Socket) {
    const agentId = client.handshake.auth.agentId; // Assume agent sends ID in auth
    this.logger.log(`Agent connected: ${agentId}`);
    // Validate and update status
    client.join(agentId); // Room for targeting specific agent
  }

  handleDisconnect(client: Socket) {
    const agentId = client.handshake.auth.agentId;
    this.logger.log(`Agent disconnected: ${agentId}`);
    // Update status to disconnected using service
  }

  @SubscribeMessage('heartbeat')
  async handleHeartbeat(
    @MessageBody() data: { capabilities: any },
    @ConnectedSocket() client: Socket,
  ) {
    const agentId = client.handshake.auth.agentId;
    await this.agentService.heartbeat(agentId, data.capabilities);
    client.emit('ack', { status: 'ok' });
  }

  @SubscribeMessage('upload-rules')
  async handleUploadRules(
    @MessageBody() data: { rules: any[] },
    @ConnectedSocket() client: Socket,
  ) {
    const agentId = client.handshake.auth.agentId;
    await this.agentService.uploadRules(agentId, data.rules);
    client.emit('ack', { status: 'rules uploaded' });
  }

  @SubscribeMessage('upload-routes')
  async handleUploadRoutes(
    @MessageBody() data: { routes: any[] },
    @ConnectedSocket() client: Socket,
  ) {
    const agentId = client.handshake.auth.agentId;
    await this.agentService.uploadRoutes(agentId, data.routes);
    client.emit('ack', { status: 'routes uploaded' });
  }

  // Method to push config to specific agent
  async pushConfig(agentId: string, config: any) {
    this.server.to(agentId).emit('config-update', config);
  }
}
