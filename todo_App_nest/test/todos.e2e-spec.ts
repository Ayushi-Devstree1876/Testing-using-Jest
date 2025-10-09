/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TestAppModule } from '../test/test.app.module';
import  request from 'supertest';

describe('Todo Integration Tests', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [TestAppModule], // full Nest app load
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

        await app.init();
    });
    
    afterAll(async () => {
        await app.close();                                                                                
    });
    
    it('POST /todo -> shouold create a new Todo', async () => {
        const res = await request(app.getHttpServer())
            .post('/todo')
            .send({
                title: 'this is our new todo',
                description: 'Todo description',
                completed: false
            });

        expect(res.status).toBe(201);
        expect(res.body).toEqual({
            id: expect.any(Number),
            title: 'this is our new todo',
            description: 'Todo description',
            completed: false,
        });
    });

    // validation error check
    it('post /todo -> should return 400 for invalid title', async () => {
        const res = await request(app.getHttpServer())
            .post('/todo')
            .send({ title: '', description: 'invalid case', completed: false }).expect(400);

        expect(res.body.message).toContain('Title is required');
    });

    // Get All
    it('GET / TODO -> should return all todos', async () => {
        const res = await request(app.getHttpServer())
            .get('/todo').expect(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toEqual({
            id: expect.any(Number),
            title: expect.any(String),
            description: expect.any(String),
            completed: expect.any(Boolean),
        });
    });
    
    //Get One By ID
  it('GET /todo/:id → should return one todo', async () => {
    const create = await request(app.getHttpServer())
      .post('/todo')
      .send({ title: 'GetOneTest', completed: false })
      .expect(201);

    const id = create.body.id;

    const res = await request(app.getHttpServer()).get(`/todo/${id}`).expect(200);
    expect(res.body.id).toBe(id);
    expect(res.body.title).toBe('GetOneTest');
  });

    // update
     it('PATCH /todo/:id → should update todo', async () => {
    const create = await request(app.getHttpServer())
      .post('/todo')
      .send({ title: 'Update Me', completed: false })
      .expect(201);

    const id = create.body.id;

    const update = await request(app.getHttpServer())
      .patch(`/todo/${id}`)
      .send({ completed: true })
      .expect(200);

    expect(update.body.completed).toBe(true);
     });
    
    // Delete
  it('DELETE /todo/:id → should delete todo', async () => {
    const create = await request(app.getHttpServer())
      .post('/todo')
      .send({ title: 'Delete Me', completed: false })
      .expect(201);

    const id = create.body.id;

    await request(app.getHttpServer()).delete(`/todo/${id}`).expect(200);

    await request(app.getHttpServer()).get(`/todo/${id}`).expect(404);
  });

});
//                                