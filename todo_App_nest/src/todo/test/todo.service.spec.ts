import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from '../entities/todo.entity';
import { User } from '../../user/entities/user.entity';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

describe('TodoService', () => {
  let service: TodoService;
  let todoRepo: jest.Mocked<Repository<Todo>>;
  let userRepo: jest.Mocked<Repository<User>>;

  const mockUser: User = { id: 1, email: 'test@example.com', password: '12345' } as User;
  const mockTodo: Todo = { id: 1, title: 'Test Todo', description: 'Test desc', user: mockUser } as Todo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    todoRepo = module.get(getRepositoryToken(Todo));
    userRepo = module.get(getRepositoryToken(User));
  });


  describe('create', () => {
    it('should create and save a todo successfully', async () => {
      const dto = { title: 'New Todo', description: 'Desc' };
      todoRepo.create.mockReturnValue(mockTodo);
      todoRepo.save.mockResolvedValue(mockTodo);

      const result = await service.create(dto, mockUser);
      expect(result).toEqual(mockTodo);
      expect(todoRepo.create).toHaveBeenCalledWith({ ...dto, user: mockUser });
      expect(todoRepo.save).toHaveBeenCalledWith(mockTodo);
    });

    it('should throw error if title is empty', async () => {
      await expect(service.create({ title: ' ', description: '' }, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error if title too long', async () => {
      const longTitle = 'a'.repeat(101);
      await expect(service.create({ title: longTitle, description: '' }, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

 
  describe('findAll', () => {
    it('should return all todos for a user', async () => {
      todoRepo.find.mockResolvedValue([mockTodo]);
      const result = await service.findAll(1);
      expect(result).toEqual([mockTodo]);
      expect(todoRepo.find).toHaveBeenCalled();
    });

    it('should return all todos if no userId provided', async () => {
      todoRepo.find.mockResolvedValue([mockTodo]);
      const result = await service.findAll();
      expect(result).toEqual([mockTodo]);
    });
  });

  
  describe('findOne', () => {
    it('should return a todo if found and user authorized', async () => {
      todoRepo.findOne.mockResolvedValue(mockTodo);
      const result = await service.findOne(1, 1);
      expect(result).toEqual(mockTodo);
    });

    it('should throw BadRequest if ID <= 0', async () => {
      await expect(service.findOne(0, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFound if todo not exists', async () => {
      todoRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(2, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw Forbidden if user unauthorized', async () => {
      todoRepo.findOne.mockResolvedValue({ ...mockTodo, user: { id: 2 } } as Todo);
      await expect(service.findOne(1, 1)).rejects.toThrow(ForbiddenException);
    });
  });

  
  describe('update', () => {
    it('should update and return the updated todo', async () => {
      todoRepo.findOne.mockResolvedValue(mockTodo);
      todoRepo.save.mockResolvedValue({ ...mockTodo, title: 'Updated' });

      const result = await service.update(1, { title: 'Updated' }, 1);
      expect(result.title).toBe('Updated');
      expect(todoRepo.save).toHaveBeenCalled();
    });
  });

  
  describe('remove', () => {
    it('should remove a todo successfully', async () => {
      todoRepo.findOne.mockResolvedValue(mockTodo);
      todoRepo.remove.mockResolvedValue(undefined);

      await service.remove(1, 1);
      expect(todoRepo.remove).toHaveBeenCalledWith(mockTodo);
    });

    it('should throw NotFound if todo not found', async () => {
      todoRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(99, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
