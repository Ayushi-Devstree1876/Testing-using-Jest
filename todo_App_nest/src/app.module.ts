/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (ConfigService  : ConfigService)=>({
       type:'postgres',
       host:ConfigService.get<string>('DB_HOST'),
       port:ConfigService.get<number>('DB_PORT'),
       username:ConfigService.get<string>('DB_USER'),
       password:ConfigService.get<string>('DB_PASS'),
       database:ConfigService.get<string>('DB_NAME'),
       autoLoadEntities:true,
       synchronize:true
      })
    }),
    TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
