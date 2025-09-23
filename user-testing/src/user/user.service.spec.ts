/* eslint-disable prettier/prettier */
import { UserService } from './user.service';

describe('UserService CRUD Test....', () => {
  let service: UserService;

  beforeEach( () => {
    service = new UserService();
  });

  it('should create a User ', () => {
    const user = service.createUser('John Doe', 'john@example.com', 'password123');
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.password).toBe('password123');
  });

  it ('should get all Users', () => {
    service.createUser('John Doe', 'john@example.com', 'password123');
    expect(service.getUsers().length).toBe(1)
  });

  it('should get User by ID', ()=>{
    const user = service.createUser('John Doe', 'john@example.com', 'password123');
    expect(service.getUserById(user.id)).toEqual(user);
  });

  it('should update a user',()=>{
    const user = service.createUser('John Doe', 'john@example.com', 'password123');
    const updated = service.updateUser(user.id,'Jane Doe','jane@example.com','newpassword123');
    expect(updated?.name).toBe('Jane Doe');
  })

  it('should delete a user',()=>{
    const user = service.createUser('John Doe', 'john@example.com', 'password123');
    const deleted = service.deleteUser(user.id);
    expect(deleted).toBe(true);
    expect(service.getUsers().length).toBe(0);
  });

});