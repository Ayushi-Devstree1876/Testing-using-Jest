/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should create a book', () => {
    const createDto : CreateBookDto = {title: 'Test Book', author:'Test Author', price:500}
    const book = service.create(createDto);
    expect(book).toHaveProperty('id');
    expect(book.title).toBe(createDto.title);
    expect(book.author).toBe(createDto.author)
    expect(book.price).toBe(createDto.price);
  });

  it('should find all books',()=>{
   service.create({title:'Test Book', author:'Test Author', price:500});
   service.create({title:'Another Book', author:'Another Author', price:600});
   const books = service.findAll()

   expect(books.length).toBe(2);
   expect(books[0]).toHaveProperty('id');
   expect(books[0].title).toBe('Test Book');
  })

  it('should find a book by id',()=>{
    const book = service.create({title:'Test Book', author:'Test Author', price:500});
    const found = service.findOne(book.id);
    expect(found).toBe(book)
});

it('should update a book ',()=>{
  const book = service.create({title:'Test Book', author:'Test Author', price:500});
  const updateDto : UpdateBookDto = {price:600};
  const updated = service.update(book.id, updateDto);

  expect(updated?.price).toBe(600);
  expect(updated?.title).toBe('Test Book');
})

it('should remove a book',()=>{
  const book = service.create({title:'Test Book', author:'Test Author', price:500});
  const result = service.remove(book.id);

  expect(result).toBe(true);
  expect(service.findAll().length).toBe(0);
})

});
