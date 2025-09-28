import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../../auth/auth/auth.service';
import { Rule } from '../../admin/schemas/rule.schema';
import { Route } from '../../admin/schemas/route.schema';
import { Agent, Capabilities } from '../../admin/schemas/agent.schema';
import { GeoDns } from '../../admin/schemas/geodns.schema';

@Injectable()
export class AgentService {
  constructor(
    @InjectModel(Rule.name) private ruleModel: Model<Rule>,
    @InjectModel(Route.name) private routeModel: Model<Route>,
    @InjectModel(Agent.name) private agentModel: Model<Agent>,
    @InjectModel(GeoDns.name) private geoDnsModel: Model<GeoDns>,
    private authService: AuthService,
  ) {}

async registerAgent(apiKey: string, registerDto: {
    name?: string;
    ip?: string;
    port?: number;
    capabilities?: Capabilities;
  }): Promise<{ agentId: string; agentKey: string }> {
    const user = await this.authService.findByApiKey(apiKey);
    if (!user) {
      throw new Error('Invalid API key');
    }

    const name = registerDto.name || `agent-${uuidv4().substring(0, 8)}`;
    const ip = registerDto.ip || '0.0.0.0';
    const port = registerDto.port || 8080;
    
    // Default capabilities - all enabled
    const defaultCapabilities: Capabilities = {
      http: true,
      https: true,
      tcp: true,
      udp: true,
      dns: true,
    };
    
    const capabilities = registerDto.capabilities || defaultCapabilities;
    
    const agent = new this.agentModel({
      name,
      ip,
      port,
      capabilities,
      status: 'disconnected',
      lastHeartbeat: new Date(),
      owner: user._id,
    });
    const savedAgent = await agent.save();
    const agentId = String(savedAgent._id);
    return { agentId, agentKey: agentId };
}

  async getConfig(apiKey: string): Promise<{
    geodns: GeoDns[];
    routes: Route[];
    rules: Rule[];
  }> {
    const user = await this.authService.findByApiKey(apiKey);
    if (!user) {
      throw new Error('Invalid API key');
    }

    const ownerId = user._id;
    const geodns = await this.geoDnsModel.find({ owner: ownerId }).exec();
    const routes = await this.routeModel.find({ owner: ownerId }).exec();
    const rules = await this.ruleModel.find({ owner: ownerId }).exec();

    return { geodns, routes, rules };
  }

  async uploadRules(agentId: string, rules: any[]) {
    for (const ruleData of rules) {
      ruleData.agent = agentId;
      await this.ruleModel.findOneAndUpdate(
        { agent: agentId, name: ruleData.name },
        ruleData,
        { upsert: true, new: true },
      );
    }
    return { message: 'Rules uploaded successfully' };
  }

  async uploadRoutes(agentId: string, routes: any[]) {
    for (const routeData of routes) {
      routeData.agents = [agentId];
      await this.routeModel.findOneAndUpdate(
        { agents: agentId, name: routeData.name },
        routeData,
        { upsert: true, new: true },
      );
    }
    return { message: 'Routes uploaded successfully' };
  }

  async heartbeat(agentId: string, capabilities: any) {
    return this.agentModel.findByIdAndUpdate(
      agentId,
      { status: 'connected', capabilities, lastHeartbeat: new Date() },
      { new: true },
    );
  }

  async findAllAgents(userId: string): Promise<Agent[]> {
    return this.agentModel.find({ owner: userId }).exec();
  }

  async findAgent(id: string, userId: string): Promise<Agent | null> {
    return this.agentModel.findOne({ _id: id, owner: userId }).exec();
  }

  async getConfigForAgent(agentId: string): Promise<{
    geodns: GeoDns[];
    routes: Route[];
    rules: Rule[];
  }> {
    const agent = await this.agentModel.findById(agentId).exec();
    if (!agent) {
      throw new Error('Agent not found');
    }

    const ownerId = agent.owner;
    const geodns = await this.geoDnsModel.find({ owner: ownerId }).exec();
    const routes = await this.routeModel.find({ agents: agentId }).exec();
    const rules = await this.ruleModel.find({ agent: agentId }).exec();

    return { geodns, routes, rules };
  }
}
