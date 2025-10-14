import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

jest.setTimeout(20000);

describe('User Module (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    await dataSource.synchronize(true); 
  });

  afterAll(async () => {
    await app.close();
  });

  const user = {
    username: 'HelloWorld',
    email: 'test12@example.com',
    password: 'StrongP@ssw0rd',
  };

  it('should register a user successfully', async () => {
    const res = await request(app.getHttpServer())
      .post('/authentication/register')
      .send(user)
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.email).toBe(user.email);
  });

  it('should login a user successfully', async () => {
    await request(app.getHttpServer()).post('/authentication/register').send(user);

    const res = await request(app.getHttpServer())
      .post('/authentication/login')
      .send({ email: user.email, password: user.password })
      .expect(200);
 
    expect(res.body.access_token).toBeDefined();
   // expect(res.body.refresh_token).toBeDefined();
  });
});

