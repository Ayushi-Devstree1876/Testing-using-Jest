import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';


jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UserService', () => {
  let service: UserService;
  let userRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should call save when creating a user', async () => {
    const dto = { username: 'test', email: 'test@example.com', password: '12345' };
    const userEntity = { id: 1, username: dto.username, email: dto.email, password: 'hashedPassword' };
    userRepository.create.mockReturnValue(userEntity);
    userRepository.save.mockResolvedValue(userEntity);

    const result = await service.createUser(dto);

    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    expect(userRepository.create).toHaveBeenCalledWith({
      username: dto.username,
      email: dto.email,
      password: 'hashedPassword',
    });
    expect(userRepository.save).toHaveBeenCalledWith(userEntity);
    expect(result).toEqual(userEntity);
  });
});
