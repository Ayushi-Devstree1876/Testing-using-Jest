/* eslint-disable @typescript-eslint/no-unsafe-call */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

jest.setTimeout(30000);

describe('User Module (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Clear DB before tests
    await dataSource.synchronize(true);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.dropDatabase();
      await dataSource.destroy();
    }
    await app.close();
  });

  it('should register a user successfully', async () => {
    const user = { username: 'testuser', email: 'testuser@example.com', password: 'password123' };

    const res = await request(app.getHttpServer())
      .post('/authentication/register')
      .send(user)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(user.email);
  });

  it('should login a user successfully', async () => {
    const user = { username: 'loginuser', email: 'loginuser@example.com', password: 'password123' };

    // Register first
    await request(app.getHttpServer())
      .post('/authentication/register')
      .send(user)
      .expect(201);

    // Login
    const res = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({ email: user.email, password: user.password })
      .expect(200);

    expect(res.body).toHaveProperty('access_token');
  });

  // Negative tests
  it('should fail registration when username is missing', async () => {
    const user = { email: 'nouser@example.com', password: 'password123' };

    const res = await request(app.getHttpServer())
      .post('/authentication/register')
      .send(user)
      .expect(400);

    expect(res.body.message).toContain('Username should not be empty');
  });

  it('should fail registration with invalid email', async () => {
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
    const user = { username: 'user4', email: 'user4@example.com', password: 'password123' };

    // Register first
    await request(app.getHttpServer())
      .post('/authentication/register')
      .send(user)
      .expect(201);

    // Login with wrong password
    const res = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({ email: user.email, password: 'wrongpass' })
      .expect(401);

    expect(res.body.message).toBe('Invalid credentials');
  });
});
