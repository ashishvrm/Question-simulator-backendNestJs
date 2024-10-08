// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(user: Partial<User>): Promise<UserDocument> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async createUser(userData: {
    email: string;
    username: string;
    googleId: string;
    profileImageUrl: string;
  }): Promise<UserDocument> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findOrCreateGoogleUser(userData: {
    googleId: string;
    username: string;
    email: string;
    profileImageUrl: string;
  }): Promise<UserDocument> {
    let user = await this.findByEmail(userData.email);
    if (!user) {
      // Create a new user with the provided profile image URL
      user = await this.createUser({
        email: userData.email,
        username: userData.username,
        googleId: userData.googleId,
        profileImageUrl: userData.profileImageUrl,
      });
    } else {
      // Update the existing user's profile image URL if necessary
      if (user.profileImageUrl !== userData.profileImageUrl) {
        user.profileImageUrl = userData.profileImageUrl;
        await user.save();
      }
    }
    return user;
  }
}
