/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '../user/dto/create-user.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UserService (Integration)', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // -------- Positive Tests --------
  it('should create a user successfully', async () => {
    const dto: CreateUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const savedUser = { id: 1, ...dto, password: 'hashedPassword', todos: [] };
    jest.spyOn(userRepository, 'create').mockReturnValue(savedUser as any);
    jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser as any);

    const result = await service.createUser(dto);

    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    expect(userRepository.create).toHaveBeenCalledWith({
      username: dto.username,
      email: dto.email,
      password: 'hashedPassword',
    });
    expect(userRepository.save).toHaveBeenCalledWith(savedUser);
    expect(result).toEqual(savedUser);
  });

  // -------- Negative Tests --------
  it('should fail creating user with empty username', async () => {
    const dto: CreateUserDto = {
      username: '',
      email: 'nouser@example.com',
      password: 'password123',
    };

    const errors = await validate(plainToInstance(CreateUserDto, dto));
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail creating user with invalid email', async () => {
    const dto: CreateUserDto = {
      username: 'invalidEmailUser',
      email: 'invalidemail',
      password: 'password123',
    };

    const errors = await validate(plainToInstance(CreateUserDto, dto));
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail creating user with too short password', async () => {
    const dto: CreateUserDto = {
      username: 'shortPassUser',
      email: 'shortpass@example.com',
      password: '123',
    };

    const errors = await validate(plainToInstance(CreateUserDto, dto));
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail creating user with missing fields', async () => {
    const dto: Partial<CreateUserDto> = {
      username: '',
      email: '',
      password: '',
    } as any;

    const errors = await validate(plainToInstance(CreateUserDto, dto));
    expect(errors.length).toBeGreaterThan(0);
  });
});
