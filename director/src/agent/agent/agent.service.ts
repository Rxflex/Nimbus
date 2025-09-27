import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rule } from '@admin/schemas/rule.schema';
import { Route } from '@admin/schemas/route.schema';
import { Agent } from '@admin/schemas/agent.schema';

@Injectable()
export class AgentService {
  constructor(
    @InjectModel(Rule.name) private ruleModel: Model<Rule>,
    @InjectModel(Route.name) private routeModel: Model<Route>,
    @InjectModel(Agent.name) private agentModel: Model<Agent>,
  ) {}

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
      routeData.agents = [agentId]; // Assuming agents is array
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
}
