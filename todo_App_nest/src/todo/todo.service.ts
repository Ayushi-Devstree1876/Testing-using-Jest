import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createTodoDto: CreateTodoDto, user: User): Promise<Todo> {
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

    const todo = this.todoRepository.create({
      ...createTodoDto,
      user,
    });

    return await this.todoRepository.save(todo);
  }

  async findAll(userId?: number): Promise<Todo[]> {
    if (userId) {
      return this.todoRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });
    }
    return this.todoRepository.find({ relations: ['user'] });
  }

  async findOne(id: number, userId?: number): Promise<Todo> {
    if (id <= 0) {
      throw new BadRequestException('Invalid ID: must be greater than 0');
    }

    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    if (userId && todo.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to access this todo');
    }

    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, userId: number): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    Object.assign(todo, updateTodoDto);
    return this.todoRepository.save(todo);
  }

  
  async remove(id: number, userId: number): Promise<void> {
    const todo = await this.findOne(id, userId);
    await this.todoRepository.remove(todo);
  }
}
           