import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../schemas/user.schema';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByApiKey(apiKey: string): Promise<User | null> {
    return this.userModel.findOne({ apiKey }).exec();
  }

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.findByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (await bcrypt.compare(loginDto.password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    throw new UnauthorizedException();
  }

  async registerUser(registerDto: { username: string; password: string; role?: string }): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = new this.userModel({
      username: registerDto.username,
      password: hashedPassword,
      role: registerDto.role || 'user',
      apiKey: uuidv4(),
    });
    return newUser.save();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findUser(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async updateUser(id: string, updateUserDto: any): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async removeUser(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
