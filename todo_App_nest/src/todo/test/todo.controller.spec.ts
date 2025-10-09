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
import { BadRequestException, ParseIntPipe, ValidationPipe } from '@nestjs/common';

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

  // NEGATIVE SCENARIOS

 it('should throw BadRequestException if id is not a number', async () => {
  const pipe = new ParseIntPipe();

  await expect(pipe.transform('abc', { type: 'param', metatype: Number }))
    .rejects.toThrow(BadRequestException);
});

  it('should throw NotFoundException if service.findOne rejects', async () => {
  (service.findOne as jest.Mock).mockRejectedValue(new Error('Todo with ID 99 not found'));

  await expect(controller.findOne("abc")).rejects.toThrow('Todo with ID 99 not found');
});

  // validation tests

 it('should throw BadRequestException if title is empty', async () => {
  const pipe = new ValidationPipe({ whitelist: true });
  const dto = { title: '' };

  await expect(
    pipe.transform(dto, { type: 'body', metatype: CreateTodoDto })
  ).rejects.toThrow(BadRequestException);
});

   it('should throw BadRequestException if title is not a string', async () => {
    const pipe = new ValidationPipe({transform:true})
    const dto = { title: 123, description: 'desc' };

    await expect(pipe.transform(dto, { 
      type: 'body', 
      metatype: CreateTodoDto 
    }))
      .rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if completed is not a boolean', async () => {
    const pipe = new ValidationPipe({transform:true})
    const dto = { title: 'Task', completed: "false"};

    await expect(pipe.transform(dto, { 
      type: 'body', 
      metatype: CreateTodoDto 
    }))
      .rejects.toThrow(BadRequestException);
  });

  // ------------------ PARTIAL UPDATE CONTROLLER TESTS ------------------

it('should update only title via controller', async () => {
  const dto: UpdateTodoDto = { title: 'New Title' };
  const result = { id: 1, title: 'New Title', description: 'Old Desc', completed: false };

  
  (service.update as jest.Mock).mockResolvedValue(result);

  const response = await controller.update(1, dto);

  expect(service.update).toHaveBeenCalledWith(1, dto);
  expect(response.title).toBe('New Title');
  expect(response.description).toBe('Old Desc');
  expect(response.completed).toBe(false);
});

it('should update only description via controller', async () => {
  const dto: UpdateTodoDto = { description: 'New Desc' };
  const result = { id: 1, title: 'Old Title', description: 'New Desc', completed: true };

  (service.update as jest.Mock).mockResolvedValue(result);

  const response = await controller.update(1, dto);

  expect(service.update).toHaveBeenCalledWith(1, dto);
  expect(response.description).toBe('New Desc');
  expect(response.title).toBe('Old Title');
  expect(response.completed).toBe(true);
});

// ------------------ VALIDATION PIPE TESTS FOR UPDATE ------------------                                                                                                                                                                                                                                                  // Invalid completed type

// Invalid completed type
it('should throw BadRequestException if completed is not a boolean via ValidationPipe', async () => {
  const pipe = new ValidationPipe({ transform: true });
  const dto: any = { completed: 'not-boolean' };

  await expect(pipe.transform(dto, { type: 'body', metatype: UpdateTodoDto }))
    .rejects.toThrow(BadRequestException);
});

// Description max length
it('should throw BadRequestException if description exceeds max length', async () => {
  const pipe = new ValidationPipe({ whitelist: true });
  const dto: any = { description: 'A'.repeat(300) }; 

  await expect(pipe.transform(dto, { type: 'body', metatype: UpdateTodoDto }))
    .rejects.toThrow(BadRequestException);
});
});

                                                                                    
