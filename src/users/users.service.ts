import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async findOne(id: string): Promise<User | null> {
    if (!id) {
      return null;
    }
    return this.repo.findOne({ where: { id } });
  }

  async find(email: string): Promise<User[]> {
    return await this.repo.find({ where: { email } });
  }

  async update(id: string, attrs: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found'); // Use NestJS's built-in exception
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found'); // Use NestJS's built-in exception
    }
    return this.repo.remove(user);
  }
}
