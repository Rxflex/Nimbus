import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AgentService } from './agent.service';

@ApiTags('agent')
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('upload-rules')
  @ApiOperation({ summary: 'Upload rules for an agent' })
  @ApiResponse({ status: 200, description: 'Rules uploaded successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        agentId: { type: 'string' },
        rules: { type: 'array', items: { type: 'object' } },
      },
    },
  })
  async uploadRules(@Body() body: { agentId: string; rules: any[] }) {
    return this.agentService.uploadRules(body.agentId, body.rules);
  }

  @Post('upload-routes')
  @ApiOperation({ summary: 'Upload routes for an agent' })
  @ApiResponse({ status: 200, description: 'Routes uploaded successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        agentId: { type: 'string' },
        routes: { type: 'array', items: { type: 'object' } },
      },
    },
  })
  async uploadRoutes(@Body() body: { agentId: string; routes: any[] }) {
    return this.agentService.uploadRoutes(body.agentId, body.routes);
  }

  @Post('heartbeat')
  @ApiOperation({ summary: 'Send heartbeat from agent with capabilities' })
  @ApiResponse({ status: 200, description: 'Heartbeat updated' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        agentId: { type: 'string' },
        capabilities: { type: 'object' },
      },
    },
  })
  async heartbeat(@Body() body: { agentId: string; capabilities: any }) {
    return this.agentService.heartbeat(body.agentId, body.capabilities);
  }
}
