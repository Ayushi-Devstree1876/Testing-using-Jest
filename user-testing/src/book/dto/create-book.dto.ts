/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
// src/book/dto/create-book.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookDto {

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}


