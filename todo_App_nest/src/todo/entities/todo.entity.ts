/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() 
export class Todo {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column({ length: 255 })
  title: string; 

  @Column({ default: false })
  completed: boolean; 

  @Column({ nullable: true })
  description?: string; 
}
