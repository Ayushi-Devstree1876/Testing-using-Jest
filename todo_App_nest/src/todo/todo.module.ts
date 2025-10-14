import { Module, forwardRef } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { User } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo, User]),
    forwardRef(() => AuthModule),
  ],
  controllers: [TodoController],
  providers: [TodoService, JwtAuthGuard],
})
export class TodoModule {}
