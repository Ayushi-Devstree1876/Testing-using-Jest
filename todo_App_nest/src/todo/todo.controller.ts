import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // ✅ Create a new Todo
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @Request() req,
  ): Promise<Todo> {
    return this.todoService.create(createTodoDto, req.user.sub);
  }

  // ✅ Get all Todos for the logged-in user
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req): Promise<Todo[]> {
    return this.todoService.findAll(req.user.sub);
  }

  // ✅ Get a single Todo by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req): Promise<Todo> {
    return this.todoService.findOne(id, req.user.sub);
  }

  // ✅ Update a Todo
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req,
  ): Promise<Todo> {
    return this.todoService.update(id, updateTodoDto, req.user.sub);
  }

  // ✅ Delete a Todo
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req): Promise<void> {
    await this.todoService.remove(id, req.user.sub);
  }
}
