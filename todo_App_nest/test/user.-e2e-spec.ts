import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { User } from '../src/user/entities/user.entity';

jest.setTimeout(30000); 

describe('User Module (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    dataSource = app.get(DataSource);
  },30000);

  beforeEach(async () => {
    await dataSource.getRepository(User).query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a user successfully', async () => {
    const user = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    };

    const res = await request(app.getHttpServer())
      .post('/authentication/register')
      .send(user)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(user.email);
  });

  it('should login a user successfully', async () => {
    const user = {
      username: 'testuser2',
      email: 'testuser2@example.com',
      password: 'password123',
    };

    await request(app.getHttpServer())
      .post('/authentication/register')
      .send(user)
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({ email: user.email, password: user.password })
      .expect(200);

    expect(res.body).toHaveProperty('access_token');
  });

  it('should fail registration when username is missing', async () => {
    const user = { email: 'nouser@example.com', password: 'password123' };

    const res = await request(app.getHttpServer())
      .post('/authentication/register')
      .send(user)
      .expect(400);

    expect(res.body.message).toContain('Username should not be empty');
  });

  it('should fail registration with invalid email format', async () => {
    const user = { username: 'user2', email: 'invalidemail', password: 'password123' };

    const res = await request(app.getHttpServer())
      .post('/authentication/register')
      .send(user)
      .expect(400);

    expect(res.body.message).toContain('Email must be a valid email address');
  });

  it('should fail registration when password is too short', async () => {
    const user = { username: 'user3', email: 'user3@example.com', password: '123' };

    const res = await request(app.getHttpServer())
      .post('/authentication/register')
      .send(user)
      .expect(400);

    expect(res.body.message).toContain('Password must be at least 6 characters long');
  });

  it('should fail login with incorrect password', async () => {
    const user = { username: 'testuser4', email: 'testuser4@example.com', password: 'password123' };

    await request(app.getHttpServer())
      .post('/authentication/register')
      .send(user)
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({ email: user.email, password: 'wrongpass' })
      .expect(401);

    expect(res.body.message).toBe('Invalid credentials');
  });
});
