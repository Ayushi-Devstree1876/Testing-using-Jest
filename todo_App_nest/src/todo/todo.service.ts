import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ Create a new Todo
  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
    const { title, description } = createTodoDto;

    // 🔹 Validation
    if (!title || title.trim() === '') {
      throw new BadRequestException('Title cannot be empty');
    }
    if (title.length > 100) {
      throw new BadRequestException('Title cannot exceed 100 characters');
    }
    if (description && description.length > 255) {
      throw new BadRequestException('Description cannot exceed 255 characters');
    }

    // 🔹 Check user existence
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // 🔹 Create and save todo
    const todo = this.todoRepository.create({
      ...createTodoDto,
      user,
    });

    return await this.todoRepository.save(todo);
  }

  // ✅ Get all Todos (for a specific user)
  async findAll(userId: number): Promise<Todo[]> {
    return this.todoRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { id: 'DESC' },
    });
  }

  // ✅ Get one Todo by ID
  async findOne(id: number, userId: number): Promise<Todo> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid ID: must be greater than 0');
    }

    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    if (todo.user.id !== userId) {
      throw new ForbiddenException('You do not have permission to access this todo');
    }

    return todo;
  }

  // ✅ Update a Todo
  async update(id: number, updateTodoDto: UpdateTodoDto, userId: number): Promise<Todo> {
    const todo = await this.findOne(id, userId);

    // Apply updates
    Object.assign(todo, updateTodoDto);

    return await this.todoRepository.save(todo);
  }

  // ✅ Delete a Todo
  async remove(id: number, userId: number): Promise<void> {
    const todo = await this.findOne(id, userId);
    await this.todoRepository.remove(todo);
  }
}
