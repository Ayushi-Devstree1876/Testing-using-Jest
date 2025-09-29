/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../todo.service';
import { Repository } from 'typeorm';
import { Todo } from '../entities/todo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { NotFoundException } from '@nestjs/common';

describe('TodoService', () => {
  let service: TodoService;
  let repo: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            findOneBy: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            preload: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repo = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('should create a todo', async () => {
    const dto: CreateTodoDto = {
      title: 'Learn Jest',
      description: 'Write tests',
    };
    const todo = { id: 1, ...dto, completed: false };

    jest.spyOn(repo, 'create').mockReturnValue(todo as Todo);
    jest.spyOn(repo, 'save').mockResolvedValue(todo as Todo);

    expect(await service.create(dto)).toEqual(todo);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(todo);
  });

  it('should return all todos', async () => {
    const todos = [
      { id: 1, title: 'A', description: 'a', completed: false },
      { id: 2, title: 'B', description: 'b', completed: true },
    ];

    jest.spyOn(repo, 'find').mockResolvedValue(todos as Todo[]);

    expect(await service.findAll()).toEqual(todos);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should return a todo by id', async () => {
    const todo = { id: 1, title: 'A', description: 'a', completed: false };

    (repo.findOneBy as jest.Mock).mockResolvedValue(todo);

    expect(await service.findOne(1)).toEqual(todo);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw error if todo not found in findOne', async () => {
    (repo.findOneBy as jest.Mock).mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should update a todo', async () => {
    const dto: UpdateTodoDto = { completed: true };
    const todo = { id: 1, title: 'A', description: 'a', completed: false };
    const updated = { ...todo, ...dto };

    jest.spyOn(repo, 'findOneBy').mockResolvedValue(todo as Todo);

    jest.spyOn(repo, 'save').mockResolvedValue(updated as Todo);

    expect(await service.update(1, dto)).toEqual(updated);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.save).toHaveBeenCalledWith(updated);
  });

  it('should throw error if updating non-existing todo', async () => {
    (repo.preload as jest.Mock).mockResolvedValue(null);

    await expect(service.update(1, { title: 'New' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete a todo', async () => {
    const todo = { id: 1, title: 'A', description: 'a', completed: false };
    (repo.findOneBy as jest.Mock).mockResolvedValue(todo);
    (repo.remove as jest.Mock).mockResolvedValue(todo);

    await service.remove(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.remove).toHaveBeenCalledWith(todo);
  });

  it('should throw error if deleting non-existing todo', async () => {
    (repo.findOneBy as jest.Mock).mockResolvedValue(null);

    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });
});
