/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UpdateTodoDto } from "../dto/update-todo.dto";


/* eslint-disable prettier/prettier */

describe('UpdateTodoDto Validation', () => {
  it('should fail if title is a number', async () => {
    const dto = plainToInstance(UpdateTodoDto, { title: 123 });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should fail if completed is a string', async () => {
    const dto = plainToInstance(UpdateTodoDto, { completed: 'yes' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isBoolean');
  });

  it('should pass with valid partial data', async () => {
    const dto = plainToInstance(UpdateTodoDto, { description: 'Updated desc' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});                                                                                  