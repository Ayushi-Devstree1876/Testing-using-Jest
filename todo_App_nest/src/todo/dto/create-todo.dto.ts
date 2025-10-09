/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsBoolean, IsString ,MaxLength} from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  title: string;


  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(200, { message: 'Description must not exceed 200 characters' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'Completed must be a boolean' })
  completed?: boolean;
}

