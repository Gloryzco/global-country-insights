import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { CreateUserDto } from '../dtos';
import { User } from 'src/entity';
import AppError from 'src/shared/utils/app-error.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const { email, password } = createUserDto;
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new AppError('0002', 'User with this email exists');
    }

    const hashPassword = await argon.hash(password);
    const user = await this.userRepository.create({
      email: email,
      password: hashPassword,
    });
    await this.userRepository.insert(user);

    return user.toPayload();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    return user;
  }

  async update(userId: string, updateData: Partial<User>): Promise<any> {
    return this.userRepository.update(userId, updateData);
  }
}
