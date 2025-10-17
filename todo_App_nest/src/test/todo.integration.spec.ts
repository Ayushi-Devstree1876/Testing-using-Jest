/* eslint-disable @typescript-eslint/no-unsafe-call */
import { INestApplication, ValidationPipe, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { Todo } from '../todo/entities/todo.entity';
import { TodoService } from '../todo/todo.service';
import { User } from '../user/entities/user.entity';
import { AppModule } from '../app.module';
//import { describe } from 'node:test';

jest.setTimeout(30000)

describe('Todo Module (Integration Test)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let todoService: TodoService;
  let testUser: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    todoService = moduleFixture.get<TodoService>(TodoService);

    
    await dataSource.synchronize(true);

    
    const userRepo = dataSource.getRepository(User);
    testUser = userRepo.create({ username: 'testuser', email: 'testuser@example.com', password: 'password123' });
    await userRepo.save(testUser);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.dropDatabase();
      await dataSource.destroy();
    }
    await app.close();
  });

  
  it('should create a todo successfully', async () => {
    const dto = { title: 'My Todo', description: 'Test description' };
    const result = await todoService.create(dto, testUser);

    expect(result).toHaveProperty('id');
    expect(result.title).toBe(dto.title);
    expect(result.user.id).toBe(testUser.id);
  });

  it('should return all todos', async () => {
    const todos = await todoService.findAll();
    expect(todos.length).toBeGreaterThan(0);
  });

  it('should return todos for a specific user', async () => {
    const todos = await todoService.findAll(testUser.id);
    expect(todos.every(t => t.user.id === testUser.id)).toBe(true);
  });

  it('should find a todo by id', async () => {
    const todos = await todoService.findAll(testUser.id);
    const todo = await todoService.findOne(todos[0].id, testUser.id);

    expect(todo.id).toBe(todos[0].id);
  });

  it('should update a todo', async () => {
    const todos = await todoService.findAll(testUser.id);
    const updated = await todoService.update(todos[0].id, { title: 'Updated Todo' }, testUser.id);

    expect(updated.title).toBe('Updated Todo');
  });

  it('should remove a todo', async () => {
    const todos = await todoService.findAll(testUser.id);
    await todoService.remove(todos[0].id, testUser.id);

    const allTodos = await todoService.findAll(testUser.id);
    expect(allTodos.find(t => t.id === todos[0].id)).toBeUndefined();
  });

  //  Negative Tests 
  it('should throw error if title is empty', async () => {
    await expect(todoService.create({ title: '', description: 'desc' }, testUser))
      .rejects.toThrow(BadRequestException);
  });

  it('should throw error if title exceeds 100 chars', async () => {
    await expect(todoService.create({ title: 'a'.repeat(101), description: 'desc' }, testUser))
      .rejects.toThrow(BadRequestException);
  });

  it('should throw error if description exceeds 255 chars', async () => {
    await expect(todoService.create({ title: 'Valid', description: 'a'.repeat(256) }, testUser))
      .rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if todo not found', async () => {
    await expect(todoService.findOne(999, testUser.id))
      .rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException for invalid id', async () => {
    await expect(todoService.findOne(0, testUser.id))
      .rejects.toThrow(BadRequestException);
  });

  it('should throw ForbiddenException if user tries to access another users todo', async () => {
    const userRepo = dataSource.getRepository(User);
    const otherUser = userRepo.create({ username: 'other', email: 'other@example.com', password: 'pass' });
    await userRepo.save(otherUser);
    const todo = await todoService.create({ title: 'Other Todo', description: 'desc' }, otherUser);

    await expect(todoService.findOne(todo.id, testUser.id))
      .rejects
      .toThrow(ForbiddenException);
  });
});
