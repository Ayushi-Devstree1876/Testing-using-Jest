/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';


describe('UserController Test...', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    jest.spyOn(service, 'getUsers').mockReturnValue([{id: 1, name: 'John Doe', email: 'john@example.com',password: 'password123'}]);
   expect(controller.getUsers()).toEqual([{id:1, name: 'John Doe', email: 'john@example.com',password: 'password123'}]);   
  });
  
});
