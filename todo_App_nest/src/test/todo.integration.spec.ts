/* eslint-disable @typescript-eslint/no-unsafe-call */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

jest.setTimeout(30000);

describe('Todo Module (Integration)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Reset DB
    await dataSource.synchronize(true);

    // Create and login a test user
    const uniqueEmail = `todo_${Date.now()}@test.com`;
    const userPayload = { username: 'TodoUser', email: uniqueEmail, password: 'password123' };

    await request(app.getHttpServer())
      .post('/authentication/register')
      .send(userPayload)
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({ email: uniqueEmail, password: 'password123' })
      .expect(200);

    jwtToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.dropDatabase();
      await dataSource.destroy();
    }
    await app.close();
  });

  it('should create a todo', async () => {
    const todoDto = { title: 'Test Todo', description: 'Integration test todo' };
    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(todoDto)
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe(todoDto.title);
  });

  it('should return all todos', async () => {
    const res = await request(app.getHttpServer())
      .get('/todos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  // Negative tests
  it('should fail to create a todo with empty title', async () => {
    const todoDto = { title: '', description: 'No title' };
    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(todoDto)
      .expect(400);

    expect(res.body.message).toEqual(expect.arrayContaining(['Title is required']));
  });

  it('should fail to create a todo with title > 100 chars', async () => {
    const todoDto = { title: 'a'.repeat(101), description: 'Too long title' };
    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(todoDto)
      .expect(400);

    expect(res.body.message).toEqual(expect.arrayContaining(['Title must not exceed 100 characters']));
  });

  it('should fail to create a todo with non-string description', async () => {
    const todoDto = { title: 'Valid', description: 12345 };
    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(todoDto)
      .expect(400);

    expect(res.body.message).toEqual(expect.arrayContaining(['Description must be a string']));
  });

  it('should fail to create a todo with completed not boolean', async () => {
    const todoDto = { title: 'Valid', completed: 'yes' };
    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(todoDto)
      .expect(400);

    expect(res.body.message).toEqual(expect.arrayContaining(['Completed must be a boolean']));
  });
});
