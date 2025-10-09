/* eslint-disable prettier/prettier */
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTodoDto } from '../dto/create-todo.dto';

describe('CreateTodoDto Validation', () => {
  it('should fail if title is empty', async () => {
    const dto = plainToInstance(CreateTodoDto, { title: '' });
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail if title is not a string', async () => {
    const dto = plainToInstance(CreateTodoDto, { title: 123 }); 
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should fail if completed is not a boolean', async () => {
    const dto = plainToInstance(CreateTodoDto, { title: 'Test', completed: 'yes' }); 
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isBoolean');
  });

  it('should pass with valid data', async () => {
    const dto = plainToInstance(CreateTodoDto, { title: 'Valid', description: 'desc', completed: true });
    const errors = await validate(dto);

    expect(errors.length).toBe(0); 
  });
});
