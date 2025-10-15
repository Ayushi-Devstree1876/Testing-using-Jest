/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

jest.setTimeout(20000);

describe('Todo Module (Integration)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    await dataSource.dropDatabase(); 
    await dataSource.synchronize(); 

    const uniqueEmail = `todo_${Date.now()}@test.com`;

    const userPayload = {
      username: 'TodoUser',
      email: uniqueEmail,
      password: 'password123',
    };

    await request(app.getHttpServer())
      .post('/authentication/register')
      .send(userPayload)
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({ email: userPayload.email, password: userPayload.password })
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
    const todoDto = {
      title: 'My second TODO',
      description: 'Testing create todo endpoint',
    };

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
    const todoDto = {
      title: '',
      description: 'This should fail'
    };

    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(todoDto)
      .expect(400);

    expect(res.body.message).toEqual(
      expect.arrayContaining(['Title is required'])
    );
  });

  it('should fail to create a todo with too long title', async () => {
    const todoDto = {
      title: 'a'.repeat(101),
      description: 'This should fail'
    };

    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(todoDto)
      .expect(400);

    expect(res.body.message).toEqual(
      expect.arrayContaining(['Title must not exceed 100 characters'])
    );
  });

  it('should fail to create a todo with non-string title', async () => {
    const todoDto = {
      title: 123,
      description: 'This should fail'
    };

    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(todoDto)
      .expect(400);

    expect(res.body.message).toEqual(
      expect.arrayContaining(['Title must be a string'])
    );
  });

  it('should fail to create a todo with non-string description', async () => {
    const todoDto = {
      title: 'Valid Title',
      description: 12345
    };

    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(todoDto)
      .expect(400);

    expect(res.body.message).toEqual(
      expect.arrayContaining(['Description must be a string'])
    );
  });

  it('should fail to create a todo with description exceeding 200 chars', async () => {
    const todoDto = {
      title: 'Valid Title',
      description: 'a'.repeat(201)
    };

    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(todoDto)
      .expect(400);

    expect(res.body.message).toEqual(
      expect.arrayContaining(['Description must not exceed 200 characters'])
    );
  });

  it('should fail to create a todo with non-boolean completed', async () => {
    const todoDto = {
      title: 'Valid Title',
      completed: 'yes'
    };

    const res = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(todoDto)
      .expect(400);

    expect(res.body.message).toEqual(
      expect.arrayContaining(['Completed must be a boolean'])
    );
  });
});
