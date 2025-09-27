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
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Agent endpoints
  @Post('agents')
  @ApiOperation({ summary: 'Create a new agent' })
  @ApiResponse({ status: 201, description: 'Agent created successfully' })
  createAgent(@Body() createAgentDto: any) {
    return this.adminService.createAgent(createAgentDto);
  }

  @Get('agents')
  @ApiOperation({ summary: 'Get all agents' })
  @ApiResponse({ status: 200, description: 'List of agents' })
  findAllAgents() {
    return this.adminService.findAllAgents();
  }

  @Get('agents/:id')
  @ApiOperation({ summary: 'Get agent by ID' })
  @ApiResponse({ status: 200, description: 'Agent details' })
  findAgent(@Param('id') id: string) {
    return this.adminService.findAgent(id);
  }

  @Put('agents/:id')
  @ApiOperation({ summary: 'Update agent' })
  @ApiResponse({ status: 200, description: 'Agent updated' })
  updateAgent(@Param('id') id: string, @Body() updateAgentDto: any) {
    return this.adminService.updateAgent(id, updateAgentDto);
  }

  @Delete('agents/:id')
  @ApiOperation({ summary: 'Delete agent' })
  @ApiResponse({ status: 200, description: 'Agent deleted' })
  removeAgent(@Param('id') id: string) {
    return this.adminService.removeAgent(id);
  }

  // Rule endpoints
  @Post('rules')
  @ApiOperation({ summary: 'Create a new rule' })
  createRule(@Body() createRuleDto: any) {
    return this.adminService.createRule(createRuleDto);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get all rules' })
  findAllRules() {
    return this.adminService.findAllRules();
  }

  @Get('rules/:id')
  @ApiOperation({ summary: 'Get rule by ID' })
  findRule(@Param('id') id: string) {
    return this.adminService.findRule(id);
  }

  @Put('rules/:id')
  @ApiOperation({ summary: 'Update rule' })
  updateRule(@Param('id') id: string, @Body() updateRuleDto: any) {
    return this.adminService.updateRule(id, updateRuleDto);
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: 'Delete rule' })
  removeRule(@Param('id') id: string) {
    return this.adminService.removeRule(id);
  }

  // Route endpoints
  @Post('routes')
  @ApiOperation({ summary: 'Create a new route' })
  createRoute(@Body() createRouteDto: any) {
    return this.adminService.createRoute(createRouteDto);
  }

  @Get('routes')
  @ApiOperation({ summary: 'Get all routes' })
  findAllRoutes() {
    return this.adminService.findAllRoutes();
  }

  @Get('routes/:id')
  @ApiOperation({ summary: 'Get route by ID' })
  findRoute(@Param('id') id: string) {
    return this.adminService.findRoute(id);
  }

  @Put('routes/:id')
  @ApiOperation({ summary: 'Update route' })
  updateRoute(@Param('id') id: string, @Body() updateRouteDto: any) {
    return this.adminService.updateRoute(id, updateRouteDto);
  }

  @Delete('routes/:id')
  @ApiOperation({ summary: 'Delete route' })
  removeRoute(@Param('id') id: string) {
    return this.adminService.removeRoute(id);
  }

  // GeoDNS endpoints
  @Post('geodns')
  @ApiOperation({ summary: 'Create a new GeoDNS configuration' })
  createGeoDns(@Body() createGeoDnsDto: any) {
    return this.adminService.createGeoDns(createGeoDnsDto);
  }

  @Get('geodns')
  @ApiOperation({ summary: 'Get all GeoDNS configurations' })
  findAllGeoDns() {
    return this.adminService.findAllGeoDns();
  }

  @Get('geodns/:id')
  @ApiOperation({ summary: 'Get GeoDNS by ID' })
  findGeoDns(@Param('id') id: string) {
    return this.adminService.findGeoDns(id);
  }

  @Put('geodns/:id')
  @ApiOperation({ summary: 'Update GeoDNS' })
  updateGeoDns(@Param('id') id: string, @Body() updateGeoDnsDto: any) {
    return this.adminService.updateGeoDns(id, updateGeoDnsDto);
  }

  @Delete('geodns/:id')
  @ApiOperation({ summary: 'Delete GeoDNS' })
  removeGeoDns(@Param('id') id: string) {
    return this.adminService.removeGeoDns(id);
  }
}
