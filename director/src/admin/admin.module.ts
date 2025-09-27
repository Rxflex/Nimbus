import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Agent, AgentSchema } from './schemas/agent.schema';
import { Rule, RuleSchema } from './schemas/rule.schema';
import { Route, RouteSchema } from './schemas/route.schema';
import { GeoDns, GeoDnsSchema } from './schemas/geodns.schema';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Agent.name, schema: AgentSchema },
      { name: Rule.name, schema: RuleSchema },
      { name: Route.name, schema: RouteSchema },
      { name: GeoDns.name, schema: GeoDnsSchema },
    ]),
    AuthModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [MongooseModule],
})
export class AdminModule {}
