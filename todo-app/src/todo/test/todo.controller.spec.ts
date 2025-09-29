/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from '../todo.controller';
import { TodoService } from '../todo.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

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
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  // CREATE
  it('should create a todo with correct schema', async () => {
    const dto: CreateTodoDto = { title: 'Learn Jest', description: 'Write tests' };
    const result = { id: 1, ...dto, completed: false };

    (service.create as jest.Mock).mockResolvedValue(result);

    const response = await controller.create(dto);

    // Parameter check
    expect(service.create).toHaveBeenCalledWith(dto);

    // Keys check
    expect(Object.keys(response)).toEqual(['id', 'title', 'description', 'completed']);

    // Datatype check
    expect(typeof response.id).toBe('number');
    expect(typeof response.title).toBe('string');
    expect(typeof response.description).toBe('string');
    expect(typeof response.completed).toBe('boolean');

    // Schema check
    expect(response).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
      completed: expect.any(Boolean),
    });
  });

  // FIND ALL
  it('should return all todos', async () => {
    const result = [
      { id: 1, title: 'A', description: 'a', completed: false },
      { id: 2, title: 'B', description: 'b', completed: true },
    ];

    (service.findAll as jest.Mock).mockResolvedValue(result);

    const response = await controller.findAll();

    // Parameter check
    expect(service.findAll).toHaveBeenCalled();

    // Keys + datatype + schema check
    response.forEach((todo) => {
      expect(Object.keys(todo)).toEqual(['id', 'title', 'description', 'completed']);
      expect(typeof todo.id).toBe('number');
      expect(typeof todo.title).toBe('string');
      expect(typeof todo.description).toBe('string');
      expect(typeof todo.completed).toBe('boolean');
    });
  });

  // FIND ONE
  it('should return a todo by id', async () => {
    const result = { id: 2, title: 'B', description: 'b', completed: true };

    (service.findOne as jest.Mock).mockResolvedValue(result);

    const response = await controller.findOne(2);

    // Parameter check
    expect(service.findOne).toHaveBeenCalledWith(2);

    // Keys check
    expect(Object.keys(response)).toEqual(['id', 'title', 'description', 'completed']);

    // Datatype + schema check
    expect(response).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
      completed: expect.any(Boolean),
    });
  });

  // UPDATE
  it('should update a todo with correct schema', async () => {
    const dto: UpdateTodoDto = { completed: true };
    const result = { id: 1, title: 'A', description: 'a', completed: true };

    (service.update as jest.Mock).mockResolvedValue(result);

    const response = await controller.update('1', dto);

    // Parameter check
    expect(service.update).toHaveBeenCalledWith(1, dto);

    // Keys check
    expect(Object.keys(response)).toEqual(['id', 'title', 'description', 'completed']);

    // Datatype + Schema check
    expect(response).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      description: expect.any(String),
      completed: expect.any(Boolean),
    });
  });

  // DELETE
  it('should delete a todo', async () => {
    (service.remove as jest.Mock).mockResolvedValue(undefined);

    const response = await controller.remove('1');

    // Parameter check
    expect(service.remove).toHaveBeenCalledWith(1);

    expect(response).toBeUndefined();
  });

  // negative find one error
  it('should throw error if service throws in findOne', async () => {
    (service.findOne as jest.Mock).mockRejectedValue(new Error('Todo Not Found'));

    await expect(controller.findOne('99')).rejects.toThrow('Todo Not Found');
  });

  // negative : update error
  it('should throw error if service throws in update', async () => {
    (service.update as jest.Mock).mockRejectedValue(new Error('Todo Not Found'));

    await expect(controller.update('99', { title: 'X' })).rejects.toThrow('Todo Not Found');
  });
});
