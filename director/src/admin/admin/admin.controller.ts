import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../auth/current-user.decorator';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Agent } from '../schemas/agent.schema';
import { Rule } from '../schemas/rule.schema';
import { Route } from '../schemas/route.schema';
import { GeoDns } from '../schemas/geodns.schema';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Agent endpoints
  @Post('agents')
  @ApiOperation({ summary: 'Create a new agent' })
  @ApiBody({ type: Agent })
  @ApiCreatedResponse({ type: Agent, description: 'Agent created successfully' })
  createAgent(@Body() createAgentDto: any, @CurrentUser() user: any) {
    return this.adminService.createAgent(user._id, createAgentDto);
  }

  @Get('agents')
  @ApiOperation({ summary: 'Get all agents' })
  @ApiOkResponse({ type: [Agent], description: 'List of agents' })
  findAllAgents(@CurrentUser() user: any) {
    return this.adminService.findAllAgents(user._id);
  }

  @Get('agents/:id')
  @ApiOperation({ summary: 'Get agent by ID' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  @ApiOkResponse({ type: Agent, description: 'Agent details' })
  findAgent(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.findAgent(id, user._id);
  }

  @Put('agents/:id')
  @ApiOperation({ summary: 'Update agent' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  @ApiBody({ type: Agent })
  @ApiOkResponse({ type: Agent, description: 'Agent updated' })
  updateAgent(@Param('id') id: string, @Body() updateAgentDto: any, @CurrentUser() user: any) {
    return this.adminService.updateAgent(id, updateAgentDto, user._id);
  }

  @Delete('agents/:id')
  @ApiOperation({ summary: 'Delete agent' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  @ApiOkResponse({ description: 'Agent deleted successfully' })
  removeAgent(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.removeAgent(id, user._id);
  }

  // Rule endpoints
  @Post('rules')
  @ApiOperation({ summary: 'Create a new rule' })
  @ApiBody({ type: Rule })
  @ApiCreatedResponse({ type: Rule, description: 'Rule created successfully' })
  createRule(@Body() createRuleDto: any, @CurrentUser() user: any) {
    return this.adminService.createRule(user._id, createRuleDto);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get all rules' })
  @ApiOkResponse({ type: [Rule], description: 'List of rules' })
  findAllRules(@CurrentUser() user: any) {
    return this.adminService.findAllRules(user._id);
  }

  @Get('rules/:id')
  @ApiOperation({ summary: 'Get rule by ID' })
  @ApiParam({ name: 'id', description: 'Rule ID' })
  @ApiOkResponse({ type: Rule, description: 'Rule details' })
  findRule(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.findRule(id, user._id);
  }

  @Put('rules/:id')
  @ApiOperation({ summary: 'Update rule' })
  @ApiParam({ name: 'id', description: 'Rule ID' })
  @ApiBody({ type: Rule })
  @ApiOkResponse({ type: Rule, description: 'Rule updated' })
  updateRule(@Param('id') id: string, @Body() updateRuleDto: any, @CurrentUser() user: any) {
    return this.adminService.updateRule(id, updateRuleDto, user._id);
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: 'Delete rule' })
  @ApiParam({ name: 'id', description: 'Rule ID' })
  @ApiOkResponse({ description: 'Rule deleted successfully' })
  removeRule(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.removeRule(id, user._id);
  }

  // Route endpoints
  @Post('routes')
  @ApiOperation({ summary: 'Create a new route' })
  @ApiBody({ type: Route })
  @ApiCreatedResponse({ type: Route, description: 'Route created successfully' })
  createRoute(@Body() createRouteDto: any, @CurrentUser() user: any) {
    return this.adminService.createRoute(user._id, createRouteDto);
  }

  @Get('routes')
  @ApiOperation({ summary: 'Get all routes' })
  @ApiOkResponse({ type: [Route], description: 'List of routes' })
  findAllRoutes(@CurrentUser() user: any) {
    return this.adminService.findAllRoutes(user._id);
  }

  @Get('routes/:id')
  @ApiOperation({ summary: 'Get route by ID' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @ApiOkResponse({ type: Route, description: 'Route details' })
  findRoute(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.findRoute(id, user._id);
  }

  @Put('routes/:id')
  @ApiOperation({ summary: 'Update route' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @ApiBody({ type: Route })
  @ApiOkResponse({ type: Route, description: 'Route updated' })
  updateRoute(@Param('id') id: string, @Body() updateRouteDto: any, @CurrentUser() user: any) {
    return this.adminService.updateRoute(id, updateRouteDto, user._id);
  }

  @Delete('routes/:id')
  @ApiOperation({ summary: 'Delete route' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @ApiOkResponse({ description: 'Route deleted successfully' })
  removeRoute(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.removeRoute(id, user._id);
  }

  // GeoDNS endpoints
  @Post('geodns')
  @ApiOperation({ summary: 'Create a new GeoDNS configuration' })
  @ApiBody({ type: GeoDns })
  @ApiCreatedResponse({ type: GeoDns, description: 'GeoDNS created successfully' })
  createGeoDns(@Body() createGeoDnsDto: any, @CurrentUser() user: any) {
    return this.adminService.createGeoDns(user._id, createGeoDnsDto);
  }

  @Get('geodns')
  @ApiOperation({ summary: 'Get all GeoDNS configurations' })
  @ApiOkResponse({ type: [GeoDns], description: 'List of GeoDNS' })
  findAllGeoDns(@CurrentUser() user: any) {
    return this.adminService.findAllGeoDns(user._id);
  }

  @Get('geodns/:id')
  @ApiOperation({ summary: 'Get GeoDNS by ID' })
  @ApiParam({ name: 'id', description: 'GeoDNS ID' })
  @ApiOkResponse({ type: GeoDns, description: 'GeoDNS details' })
  findGeoDns(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.findGeoDns(id, user._id);
  }

  @Put('geodns/:id')
  @ApiOperation({ summary: 'Update GeoDNS' })
  @ApiParam({ name: 'id', description: 'GeoDNS ID' })
  @ApiBody({ type: GeoDns })
  @ApiOkResponse({ type: GeoDns, description: 'GeoDNS updated' })
  updateGeoDns(@Param('id') id: string, @Body() updateGeoDnsDto: any, @CurrentUser() user: any) {
    return this.adminService.updateGeoDns(id, updateGeoDnsDto, user._id);
  }

  @Delete('geodns/:id')
  @ApiOperation({ summary: 'Delete GeoDNS' })
  @ApiParam({ name: 'id', description: 'GeoDNS ID' })
  @ApiOkResponse({ description: 'GeoDNS deleted successfully' })
  removeGeoDns(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.removeGeoDns(id, user._id);
  }
}
