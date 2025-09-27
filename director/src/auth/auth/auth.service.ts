import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async onModuleInit() {
    const defaultUser = { username: 'admin', password: 'admin', role: 'admin' };
    const existing = await this.userModel.findOne({
      username: defaultUser.username,
    });
    if (!existing) {
      defaultUser.password = await bcrypt.hash(defaultUser.password, 10);
      const newUser = new this.userModel(defaultUser);
      await newUser.save();
    }
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }
}
