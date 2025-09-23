/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

          
describe('BookController', () => {
  let controller: BookController;
  let service : BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: {
            create: jest.fn().mockImplementation((dto:CreateBookDto)=> ({id:1,...dto})),
            findAll: jest.fn().mockReturnValue([{id:1,title:'Test Book',author:'Test Author',price:500}]),
            findOne: jest.fn().mockImplementation((id:number)=>({id,title:'Test Book',author:'Test Author',price:500})),
            update: jest.fn().mockImplementation((id:number,dto:UpdateBookDto)=>({id,title:'Test Book',author:'Test Author',price:500,...dto})),
            remove: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  it('should create a book', () => {
    const dto : CreateBookDto = {title:'Test Book',author:'Test Author',price:500};
    expect(controller.create(dto)).toEqual({id:1,...dto});
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all books',()=>{
    expect(controller.findAll()).toEqual([{id:1,title:'Test Book',author:'Test Author',price:500}]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a book by id',()=>{
    expect(controller.findOne("1")).toEqual({id:1,title:'Test Book',author:'Test Author',price:500});
    expect(service.findOne).toHaveBeenCalledWith(1);
  })

  it('should update a book', () => {
    const updateDto: UpdateBookDto = { price: 600 };
    expect(controller.update("1", updateDto)).toEqual({ id: 1, title: 'Test Book', author: 'Test Author', price: 600 });
    expect(service.update).toHaveBeenCalledWith(1, updateDto);
  });

  it('should delete a book',()=>{
    expect(controller.remove("1")).toBe(true);    
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});