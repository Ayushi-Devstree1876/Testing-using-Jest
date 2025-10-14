import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user/user.controller';
import { UserService } from '../user/user.service';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guards';

describe('UserController', () => {
  let controller: UserController;
  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    })
      // ✅ Mock JwtAuthGuard globally
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (context: ExecutionContext) => true })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
