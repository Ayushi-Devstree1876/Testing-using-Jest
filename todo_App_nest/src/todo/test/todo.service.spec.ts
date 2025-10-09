/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/unbound-method */                                                                                                                                                                                                                                                                                                                                                                       
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { Test, TestingModule } from '@nestjs/testing';
// import { TodoService } from '../todo.service';
// import { Repository } from 'typeorm';
// import { Todo } from '../entities/todo.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { CreateTodoDto } from '../dto/create-todo.dto';
// import { UpdateTodoDto } from '../dto/update-todo.dto';
// import { NotFoundException,BadRequestException } from '@nestjs/common';

// describe('TodoService', () => {
//   let service: TodoService;
//   let repo: Repository<Todo>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         TodoService,
//         {
//           provide: getRepositoryToken(Todo),
//           useValue: {
//             findOneBy: jest.fn(),
//             find: jest.fn(),
//             create: jest.fn(),
//             save: jest.fn(),
//             remove: jest.fn(),
//             preload: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<TodoService>(TodoService);
//     repo = module.get<Repository<Todo>>(getRepositoryToken(Todo));
//   });

//   it('should create a todo', async () => {
//     const dto: CreateTodoDto = {
//       title: 'Learn Jest',
//       description: 'Write tests',
//     };
//     const todo = { id: 1, ...dto, completed: false };

//     jest.spyOn(repo, 'create').mockReturnValue(todo as Todo);
//     jest.spyOn(repo, 'save').mockResolvedValue(todo as Todo);

//     expect(await service.create(dto)).toEqual(todo);
//     expect(repo.create).toHaveBeenCalledWith(dto);
//     expect(repo.save).toHaveBeenCalledWith(todo);
//   });

//   it('should return all todos', async () => {
//     const todos = [
//       { id: 1, title: 'A', description: 'a', completed: false },
//       { id: 2, title: 'B', description: 'b', completed: true },
//     ];

//     jest.spyOn(repo, 'find').mockResolvedValue(todos as Todo[]);

//     expect(await service.findAll()).toEqual(todos);
//     expect(repo.find).toHaveBeenCalled();
//   });

//   it('should return a todo by id', async () => {
//     const todo = { id: 1, title: 'A', description: 'a', completed: false };

//     (repo.findOneBy as jest.Mock).mockResolvedValue(todo);

//     expect(await service.findOne(1)).toEqual(todo);
//     expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
//   });

//   it('should throw error if todo not found in findOne', async () => {
//     (repo.findOneBy as jest.Mock).mockResolvedValue(null);

//     await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
//   });

//   it('should update a todo', async () => {
//     const dto: UpdateTodoDto = { completed: true };
//     const todo = { id: 1, title: 'A', description: 'a', completed: false };
//     const updated = { ...todo, ...dto };

//     jest.spyOn(repo, 'findOneBy').mockResolvedValue(todo as Todo);

//     jest.spyOn(repo, 'save').mockResolvedValue(updated as Todo);

//     expect(await service.update(1, dto)).toEqual(updated);
//     expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
//     expect(repo.save).toHaveBeenCalledWith(updated);
//   });

//   it('should throw error if updating non-existing todo', async () => {
//     (repo.preload as jest.Mock).mockResolvedValue(null);

//     await expect(service.update(1, { title: 'New' })).rejects.toThrow(
//       NotFoundException,
//     );
//   });

//   it('should delete a todo', async () => {
//     const todo = { id: 1, title: 'A', description: 'a', completed: false };
//     (repo.findOneBy as jest.Mock).mockResolvedValue(todo);
//     (repo.remove as jest.Mock).mockResolvedValue(todo);

//     await service.remove(1);
//     expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
//     expect(repo.remove).toHaveBeenCalledWith(todo);
//   });

//   // NEGATIVE SCENARIOS 
//   it('should throw error if deleting non-existing todo', async () => {
//     (repo.findOneBy as jest.Mock).mockResolvedValue(null);

//     await expect(service.remove(99)).rejects.toThrow(NotFoundException);
//   });

//   it('should throw NotFoundException if todo not found in findOne', async () => {
//   jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);

//   await expect(service.findOne(123)).rejects.toThrow('Todo with ID 123 not found');
// });

//   it('should throw NotFoundException if updating non-existing todo', async () => {
//   jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);

//   await expect(service.update(123, { title: 'X' }))
//     .rejects.toThrow('Todo with ID 123 not found');
// });

// it('should throw NotFoundException if deleting non-existing todo', async () => {
//   jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);

//   await expect(service.remove(6344442))
//     .rejects.toThrow('Todo with ID 6344442 not found');
// });

// // Update Specific Fields
// it('should update only title',async()=>{
//   const existing = {id:1, title: ' Old Title' , description:'desc', completed:false}
//   const dto : UpdateTodoDto = {title:'New Title'}
//   const updated = {...existing, ...dto}

//   jest.spyOn(repo,'findOneBy').mockResolvedValue(existing as Todo)
//   jest.spyOn(repo, 'save').mockResolvedValue(updated as Todo)

//   const result = await service.update(1,dto)

//   expect(result.title).toBe('New Title');
//   expect(result.description).toBe('desc');
//   expect(result.completed).toBe(false)
// })

// it('should update only description', async()=>{
//   const existing = {id:1, title:'Old Title', description:'old Desc', completed:true}
//   const dto:UpdateTodoDto= {description: 'New Desc'}
//   const updated = {...existing,...dto}

//   jest.spyOn(repo,'findOneBy').mockResolvedValue(existing as Todo)
//   jest.spyOn(repo,'save').mockResolvedValue(updated as Todo)

//   const result = await service.update(1,dto)

//   expect(result.description).toBe('New Desc')
//   expect(result.title).toBe('Old Title')
//   expect(result.completed).toBe(true)
// })

// //  INPUT VALIDATION -------------------

//   it('should throw BadRequestException if title is empty', async () => {
//     const dto: CreateTodoDto = { title: '', description: 'desc' };
//     await expect(service.create(dto)).rejects.toThrow(BadRequestException);
//   });

//   it('should throw BadRequestException if title exceeds max length (100 chars)', async () => {
//     const dto: CreateTodoDto = {
//       title: 'A'.repeat(101),
//       description: 'desc',
//     };
//     await expect(service.create(dto)).rejects.toThrow(BadRequestException);
//   });

//   it('should throw BadRequestException if description exceeds 255 chars', async () => {
//     const dto: CreateTodoDto = {
//       title: 'Task',
//       description: 'A'.repeat(256),
//     };
//     await expect(service.create(dto)).rejects.toThrow(BadRequestException);
//   });

//   // ******* invalid IDs ************

//   it('should throw BadRequestException if ID is negative', async () => {
//     await expect(service.findOne(-5)).rejects.toThrow(BadRequestException);
//   });

//   it('should throw BadRequestException if ID is zero', async () => {
//     await expect(service.findOne(0)).rejects.toThrow(BadRequestException);
//   });


//   //****** non-existing records ***********

//   it('should throw NotFoundException if todo not found in findOne', async () => {
//     jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);

//     await expect(service.findOne(123)).rejects.toThrow(NotFoundException);
//   });

//   it('should throw NotFoundException if updating non-existing todo', async () => {
//     jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);

//     await expect(service.update(999, { title: 'New' })).rejects.toThrow(
//       NotFoundException,
//     );
//   });

//   it('should throw NotFoundException if deleting non-existing todo', async () => {
//     jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);

//     await expect(service.remove(555)).rejects.toThrow(NotFoundException);
//   });

//   // ****************** edge update cases *************************

//   it('should not modify other fields if only one field updated', async () => {
//     const existing = {
//       id: 1,
//       title: 'Old',
//       description: 'Old desc',
//       completed: false,
//     };
//     const dto: UpdateTodoDto = { title: 'Updated' };
//     const updated = { ...existing, ...dto };

//     jest.spyOn(repo, 'findOneBy').mockResolvedValue(existing as Todo);
//     jest.spyOn(repo, 'save').mockResolvedValue(updated as Todo);

//     const result = await service.update(1, dto);

//     expect(result.title).toBe('Updated');
//     expect(result.description).toBe('Old desc');
//   });


//   //**************** DATABASE FAILURE SIMULATION *********************
                                
//   it('should throw generic error if repository.save fails', async () => {
//     const dto = { title: 'Task', description: 'Desc' };
//     jest.spyOn(repo, 'create').mockReturnValue(dto as any);
//     jest.spyOn(repo, 'save').mockRejectedValue(new Error('Database error'));

//     await expect(service.create(dto)).rejects.toThrow('Database error');
//   });

//   it('should throw generic error if repository.find fails', async () => {
//     jest.spyOn(repo, 'find').mockRejectedValue(new Error('Query failed'));

//     await expect(service.findAll()).rejects.toThrow('Query failed');
//   });
 
// });

/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from '../todo.service';
import { Repository } from 'typeorm';
import { Todo } from '../entities/todo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('TodoService (Array-of-Object Tests)', () => {
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

  // Define all test cases as objects in an array
  const tests = [
    {
      name: 'should create a todo successfully',
      method: 'create',
      args: [{ title: 'Learn Jest', description: 'Write tests' }],
      mock: {
        create: (dto: CreateTodoDto) => ({ id: 1, ...dto, completed: false }),
        save: (todo: any) => Promise.resolve({ id: 1, ...todo }),
      },
      expected: { id: 1, title: 'Learn Jest', description: 'Write tests', completed: false },
    },
    {
      name: 'should return all todos',
      method: 'findAll',
      mock: {
        find: () =>
          Promise.resolve([
            { id: 1, title: 'A', description: 'a', completed: false },
            { id: 2, title: 'B', description: 'b', completed: true },
          ]),
      },
      expected: [
        { id: 1, title: 'A', description: 'a', completed: false },
        { id: 2, title: 'B', description: 'b', completed: true },
      ],
    },
    {
  name: 'should return a todo by id',
  method: 'findOne',
  args: [1],
  mock: { findOneBy: jest.fn().mockResolvedValue({ id: 1, title: 'A', description: 'a', completed: false }) },
  expected: { id: 1, title: 'A', description: 'a', completed: false },
},
    {
      name: 'should throw NotFoundException if todo not found',
      method: 'findOne',
      args: [99],
      mock: { findOneBy: () => Promise.resolve(null) },
      expectedError: NotFoundException,
    },
    {
      name: 'should update a todo partially',
      method: 'update',
      args: [1, { completed: true }],
      mock: {
        findOneBy: () => Promise.resolve({ id: 1, title: 'A', description: 'a', completed: false }),
        save: (updated: any) => Promise.resolve({ ...updated }),
      },
      expected: { id: 1, title: 'A', description: 'a', completed: true },
    },
    {
      name: 'should throw NotFoundException if updating non-existing todo',
      method: 'update',
      args: [123, { title: 'X' }],
      mock: { findOneBy: () => Promise.resolve(null) },
      expectedError: NotFoundException,
    },
    {
      name: 'should delete a todo successfully',
      method: 'remove',
      args: [1],
      mock: {
        findOneBy: () => Promise.resolve({ id: 1, title: 'A', description: 'a', completed: false }),
        remove: (todo: any) => Promise.resolve(todo),
      },
      expected: undefined,
    },
    {
      name: 'should throw NotFoundException if deleting non-existing todo',
      method: 'remove',
      args: [999],
      mock: { findOneBy: () => Promise.resolve(null) },
      expectedError: NotFoundException,
    },
    // Validation scenarios
    {
      name: 'should throw BadRequestException if title is empty on create',
      method: 'create',
      args: [{ title: '', description: 'desc' }],
      expectedError: BadRequestException,
    },
    {
      name: 'should throw BadRequestException if title exceeds max length',
      method: 'create',
      args: [{ title: 'A'.repeat(101), description: 'desc' }],
      expectedError: BadRequestException,
    },
    {
      name: 'should throw BadRequestException if description exceeds max length',
      method: 'create',
      args: [{ title: 'Task', description: 'A'.repeat(256) }],
      expectedError: BadRequestException,
    },
  ];


  tests.forEach((t) => {
    it(t.name, async () => {
      if (t.mock) {
        Object.entries(t.mock).forEach(([fn, impl]) => {
          jest.spyOn(repo as any, fn).mockImplementation(impl);
        });
      }

      if (t.expectedError) {
        await expect((service as any)[t.method](...(t.args || []))).rejects.toThrow(t.expectedError);
      } else {
        const result = await (service as any)[t.method](...(t.args || []));
        expect(result).toEqual(t.expected);
      }

    });
  });
});

                                                                                      