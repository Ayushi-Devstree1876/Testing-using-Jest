import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // --- Create new user (optional, Auth.register preferred) ---
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // --- Get all users ---
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  // --- Get user by ID ---
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userService.findById(Number(id));
  }

  // --- Update user ---
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: Partial<CreateUserDto>) {
    return this.userService.updateUser(Number(id), updateUserDto);
  }

  // --- Delete user ---
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.userService.deleteUser(Number(id));
    return { message: `User with id ${id} deleted successfully` };
  }
}
