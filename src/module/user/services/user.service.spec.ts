import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { User } from 'src/entities';
import * as argon from 'argon2';
import { CreateUserDto } from '../dtos';
import { User } from 'src/entity';
import AppError from 'src/shared/utils/AppError';
// import AppError from 'src/shared/utils/app-error.utils';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'testpass',
      };
      const user = {
        id: '1',
        email: createUserDto.email,
        password: 'hashedPassword',
        toPayload: jest.fn().mockReturnValue({
          id: '1',
          email: createUserDto.email,
        }),
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(argon, 'hash').mockResolvedValue('hashedPassword');
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.insert.mockResolvedValue(undefined);

      const result = await userService.create(createUserDto);

      expect(userService.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(argon.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: 'hashedPassword',
      });
      expect(mockUserRepository.insert).toHaveBeenCalledWith(user);
      expect(result).toEqual({ id: '1', email: createUserDto.email });
    });

    it('should throw an error if the user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'testpass',
      };
      const existingUser: any = {
        id: '1',
        email: 'test@example.com',
        password: 'invalidPassword',
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(existingUser);

      await expect(userService.create(createUserDto)).rejects.toThrow(
        new AppError('0002', 'User with this email exists'),
      );

      expect(userService.findByEmail).toHaveBeenCalledWith(createUserDto.email);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const user = { id: '1', email, password: 'hashedPassword' };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userService.findByEmail(email);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(user);
    });

    it('should return null if user is not found by email', async () => {
      const email = 'test@example.com';

      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userService.findByEmail(email);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const id = '1';
      const user = {
        id,
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userService.findById(id);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(user);
    });

    it('should return null if user is not found by id', async () => {
      const id = '1';

      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userService.findById(id);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateData = { email: 'newemail@example.com' };
      const updateResult = { affected: 1 };

      mockUserRepository.update.mockResolvedValue(updateResult);

      const result = await userService.update(userId, updateData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        userId,
        updateData,
      );
      expect(result).toEqual(updateResult);
    });
  });
});
