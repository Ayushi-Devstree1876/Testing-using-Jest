/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'Completed must be a boolean' })
  completed?: boolean;
}

