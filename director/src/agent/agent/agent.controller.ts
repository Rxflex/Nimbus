import { Controller, Post, Body, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiOkResponse } from '@nestjs/swagger';
import { AgentService } from './agent.service';
import { AgentRegisterDto } from '../dto/agent-register.dto';
import { Agent } from '../../admin/schemas/agent.schema';

@ApiTags('agent')
@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post(':apiKey/register')
  @ApiOperation({ summary: 'Register a new agent' })
  @ApiParam({ name: 'apiKey', description: 'User API key' })
  @ApiBody({ type: AgentRegisterDto })
  @ApiOkResponse({ type: Agent, description: 'Agent registered successfully' })
  @UsePipes(new ValidationPipe())
  async registerAgent(
    @Param('apiKey') apiKey: string,
    @Body() registerDto: AgentRegisterDto,
  ) {
    return this.agentService.registerAgent(apiKey, registerDto);
  }

  @Get(':apiKey/config')
  @ApiOperation({ summary: 'Get configuration for user agents' })
  @ApiParam({ name: 'apiKey', description: 'User API key' })
  @ApiOkResponse({ description: 'Configuration retrieved successfully' })
  async getConfig(@Param('apiKey') apiKey: string) {
    return this.agentService.getConfig(apiKey);
  }

  @Post('upload-rules')
  @ApiOperation({ summary: 'Upload rules for an agent' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        agentId: { type: 'string', description: 'Agent ID' },
        rules: { type: 'array', items: { type: 'object', description: 'Rule object' } },
    },
    },
  })
  @ApiOkResponse({ description: 'Rules uploaded successfully' })
  async uploadRules(@Body() body: { agentId: string; rules: any[] }) {
    return this.agentService.uploadRules(body.agentId, body.rules);
  }

  @Post('upload-routes')
  @ApiOperation({ summary: 'Upload routes for an agent' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        agentId: { type: 'string', description: 'Agent ID' },
        routes: { type: 'array', items: { type: 'object', description: 'Route object' } },
      },
    },
  })
  @ApiOkResponse({ description: 'Routes uploaded successfully' })
  async uploadRoutes(@Body() body: { agentId: string; routes: any[] }) {
    return this.agentService.uploadRoutes(body.agentId, body.routes);
  }

  @Post('heartbeat')
  @ApiOperation({ summary: 'Send heartbeat from agent with capabilities' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        agentId: { type: 'string', description: 'Agent ID' },
        capabilities: { type: 'object', description: 'Capabilities object' },
      },
    },
  })
  @ApiOkResponse({ description: 'Heartbeat updated' })
  async heartbeat(@Body() body: { agentId: string; capabilities: any }) {
    return this.agentService.heartbeat(body.agentId, body.capabilities);
  }
}
