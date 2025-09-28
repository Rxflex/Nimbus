import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agent } from '../schemas/agent.schema';
import { Rule } from '../schemas/rule.schema';
import { Route } from '../schemas/route.schema';
import { GeoDns } from '../schemas/geodns.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Agent.name) private agentModel: Model<Agent>,
    @InjectModel(Rule.name) private ruleModel: Model<Rule>,
    @InjectModel(Route.name) private routeModel: Model<Route>,
    @InjectModel(GeoDns.name) private geoDnsModel: Model<GeoDns>,
  ) {}

  // Agent CRUD
  async createAgent(userId: string, createAgentDto: any): Promise<Agent> {
    const agentData = { ...createAgentDto, owner: userId };
    const agent = new this.agentModel(agentData);
    return agent.save();
  }

  async findAllAgents(userId: string): Promise<Agent[]> {
    return this.agentModel.find({ owner: userId }).exec();
  }

  async findAgent(id: string, userId: string): Promise<Agent | null> {
    return this.agentModel.findOne({ _id: id, owner: userId }).exec();
  }

  async updateAgent(id: string, updateAgentDto: any, userId: string): Promise<Agent | null> {
    return this.agentModel.findOneAndUpdate(
      { _id: id, owner: userId },
      { ...updateAgentDto },
      { new: true }
    ).exec();
  }

  async removeAgent(id: string, userId: string): Promise<Agent | null> {
    return this.agentModel.findOneAndDelete({ _id: id, owner: userId }).exec();
  }

  // Rule CRUD
  async createRule(userId: string, createRuleDto: any): Promise<Rule> {
    const ruleData = { ...createRuleDto, owner: userId };
    const rule = new this.ruleModel(ruleData);
    return rule.save();
  }

  async findAllRules(userId: string): Promise<Rule[]> {
    return this.ruleModel.find({ owner: userId }).exec();
  }

  async findRule(id: string, userId: string): Promise<Rule | null> {
    return this.ruleModel.findOne({ _id: id, owner: userId }).exec();
  }

  async updateRule(id: string, updateRuleDto: any, userId: string): Promise<Rule | null> {
    return this.ruleModel.findOneAndUpdate(
      { _id: id, owner: userId },
      { ...updateRuleDto },
      { new: true }
    ).exec();
  }

  async removeRule(id: string, userId: string): Promise<Rule | null> {
    return this.ruleModel.findOneAndDelete({ _id: id, owner: userId }).exec();
  }

  // Route CRUD
  async createRoute(userId: string, createRouteDto: any): Promise<Route> {
    const routeData = { ...createRouteDto, owner: userId };
    const route = new this.routeModel(routeData);
    return route.save();
  }

  async findAllRoutes(userId: string): Promise<Route[]> {
    return this.routeModel.find({ owner: userId }).exec();
  }

  async findRoute(id: string, userId: string): Promise<Route | null> {
    return this.routeModel.findOne({ _id: id, owner: userId }).exec();
  }

  async updateRoute(id: string, updateRouteDto: any, userId: string): Promise<Route | null> {
    return this.routeModel.findOneAndUpdate(
      { _id: id, owner: userId },
      { ...updateRouteDto },
      { new: true }
    ).exec();
  }

  async removeRoute(id: string, userId: string): Promise<Route | null> {
    return this.routeModel.findOneAndDelete({ _id: id, owner: userId }).exec();
  }

  // GeoDNS CRUD
  async createGeoDns(userId: string, createGeoDnsDto: any): Promise<GeoDns> {
    const geoDnsData = { ...createGeoDnsDto, owner: userId };
    const geoDns = new this.geoDnsModel(geoDnsData);
    return geoDns.save();
  }

  async findAllGeoDns(userId: string): Promise<GeoDns[]> {
    return this.geoDnsModel.find({ owner: userId }).exec();
  }

  async findGeoDns(id: string, userId: string): Promise<GeoDns | null> {
    return this.geoDnsModel.findOne({ _id: id, owner: userId }).exec();
  }

  async updateGeoDns(id: string, updateGeoDnsDto: any, userId: string): Promise<GeoDns | null> {
    return this.geoDnsModel.findOneAndUpdate(
      { _id: id, owner: userId },
      { ...updateGeoDnsDto },
      { new: true }
    ).exec();
  }

  async removeGeoDns(id: string, userId: string): Promise<GeoDns | null> {
    return this.geoDnsModel.findOneAndDelete({ _id: id, owner: userId }).exec();
  }
}
