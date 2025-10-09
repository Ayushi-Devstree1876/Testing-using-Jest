/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable , NotFoundException} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class TodoService {
  constructor(@InjectRepository(Todo) private readonly todorepository:Repository<Todo>,){}

  async create(createTodoDto: CreateTodoDto):Promise<Todo> {
    const { title, description } = createTodoDto;
    if (!title || title.trim() === '') {
      throw new BadRequestException('Title cannot be empty');
    }

    if (title.length > 100) {
      throw new BadRequestException('Title cannot exceed 100 characters');
    }

    if (description && description.length > 255) {
      throw new BadRequestException('Description cannot exceed 255 characters');
    }

    const todo = this.todorepository.create(createTodoDto);
    return this.todorepository.save(todo);
  }

  async findAll():Promise<Todo[]> {
   return this.todorepository.find();
  }

  async findOne(id: number): Promise<Todo> {
  if (id <= 0) {
    throw new BadRequestException('Invalid ID: must be greater than 0');
  }
  const todo = await this.todorepository.findOneBy({ id });
  if (!todo) {
    throw new NotFoundException(`Todo with ID ${id} not found`);
  }
  return todo;
}


 async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id); 
    Object.assign(todo, updateTodoDto); 
    return this.todorepository.save(todo);
  }

  async remove(id: number): Promise<void> {
    const todo = await this.findOne(id); 
    await this.todorepository.remove(todo);
  }
}
