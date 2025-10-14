import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule), // ✅ Use forwardRef to fix circular dependency
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule], // ✅ Export TypeOrmModule if other modules need repository
})
export class UserModule {}
//                                                          