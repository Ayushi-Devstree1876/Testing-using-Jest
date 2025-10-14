import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should call authService.login and return token', async () => {
    const dto = { email: 'test@test.com', password: '12345' };
    const result = { access_token: 'fake-token' };

    (authService.login as jest.Mock).mockResolvedValue(result);

    const response = await authController.login(dto);

    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(response).toEqual(result);
  });

  it('should throw UnauthorizedException when login fails', async () => {
    const dto = { email: 'wrong@test.com', password: 'wrong' };
    (authService.login as jest.Mock).mockRejectedValue(
      new UnauthorizedException(),
    );

    await expect(authController.login(dto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
