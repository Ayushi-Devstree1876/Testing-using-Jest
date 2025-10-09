/* eslint-disable prettier/prettier */
import { IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  status?: string;
}
