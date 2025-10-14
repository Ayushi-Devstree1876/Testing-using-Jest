import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from '../todo.controller';
import { TodoService } from '../todo.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { Todo } from '../entities/todo.entity';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guards';

describe('TodoController', () => {
  let controller: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      // ✅ Mock JwtAuthGuard globally
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should create a todo', async () => {
    const createTodoDto: CreateTodoDto = { title: 'Test', description: 'desc' };
    const mockUser = { sub: 1 }; // simulate JWT payload
    const expectedTodo: Todo = { id: 1, ...createTodoDto, user: { id: 1 } } as any;

    jest.spyOn(todoService, 'create').mockResolvedValue(expectedTodo);

    const result = await controller.create(createTodoDto, { user: mockUser });
    expect(todoService.create).toHaveBeenCalledWith(createTodoDto, 1);
    expect(result).toEqual(expectedTodo);
  });
});
