/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  private books: Book[] = [];
  private idCounter = 1;

  create(createBookDto: CreateBookDto): Book {
    const newbook: Book = { id: this.idCounter++, ...createBookDto };
    this.books.push(newbook);
    return newbook;
  }

  findAll(): Book[] {
    return this.books;
  }

  findOne(id: number): Book | undefined {
    return this.books.find((b) => b.id === id);
  }

  update(id: number, updateBookDto: UpdateBookDto): Book | null {
    const book = this.findOne(id);
    if (!book) return null;
    Object.assign(book, updateBookDto);
    return book;
  }

  remove(id: number): boolean {
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) return false;
    this.books.splice(index, 1);
    return true;
  }
}
