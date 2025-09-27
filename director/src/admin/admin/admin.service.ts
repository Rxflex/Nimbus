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
  async createAgent(createAgentDto: any): Promise<Agent> {
    const createdAgent = new this.agentModel(createAgentDto);
    return await this.agentModel.create(createdAgent);
  }

  async findAllAgents(): Promise<Agent[]> {
    return this.agentModel.find().exec();
  }

  async findAgent(id: string): Promise<Agent | null> {
    return this.agentModel.findById(id).exec();
  }

  async updateAgent(id: string, updateAgentDto: any): Promise<Agent | null> {
    return this.agentModel
      .findByIdAndUpdate(id, updateAgentDto, { new: true })
      .exec();
  }

  async removeAgent(id: string): Promise<Agent | null> {
    return this.agentModel.findByIdAndDelete(id).exec();
  }

  // Rule CRUD
  async createRule(createRuleDto: any): Promise<Rule> {
    const createdRule = new this.ruleModel(createRuleDto);
    return await this.ruleModel.create(createdRule);
  }

  async findAllRules(): Promise<Rule[]> {
    return this.ruleModel.find().exec();
  }

  async findRule(id: string): Promise<Rule | null> {
    return this.ruleModel.findById(id).exec();
  }

  async updateRule(id: string, updateRuleDto: any): Promise<Rule | null> {
    return this.ruleModel
      .findByIdAndUpdate(id, updateRuleDto, { new: true })
      .exec();
  }

  async removeRule(id: string): Promise<Rule | null> {
    return this.ruleModel.findByIdAndDelete(id).exec();
  }

  // Route CRUD
  async createRoute(createRouteDto: any): Promise<Route> {
    const createdRoute = new this.routeModel(createRouteDto);
    return await this.routeModel.create(createdRoute);
  }

  async findAllRoutes(): Promise<Route[]> {
    return this.routeModel.find().exec();
  }

  async findRoute(id: string): Promise<Route | null> {
    return this.routeModel.findById(id).exec();
  }

  async updateRoute(id: string, updateRouteDto: any): Promise<Route | null> {
    return this.routeModel
      .findByIdAndUpdate(id, updateRouteDto, { new: true })
      .exec();
  }

  async removeRoute(id: string): Promise<Route | null> {
    return this.routeModel.findByIdAndDelete(id).exec();
  }

  // GeoDNS CRUD
  async createGeoDns(createGeoDnsDto: any): Promise<GeoDns> {
    const createdGeoDns = new this.geoDnsModel(createGeoDnsDto);
    return await this.geoDnsModel.create(createdGeoDns);
  }

  async findAllGeoDns(): Promise<GeoDns[]> {
    return this.geoDnsModel.find().exec();
  }

  async findGeoDns(id: string): Promise<GeoDns | null> {
    return this.geoDnsModel.findById(id).exec();
  }

  async updateGeoDns(id: string, updateGeoDnsDto: any): Promise<GeoDns | null> {
    return this.geoDnsModel
      .findByIdAndUpdate(id, updateGeoDnsDto, { new: true })
      .exec();
  }

  async removeGeoDns(id: string): Promise<GeoDns | null> {
    return this.geoDnsModel.findByIdAndDelete(id).exec();
  }
}
