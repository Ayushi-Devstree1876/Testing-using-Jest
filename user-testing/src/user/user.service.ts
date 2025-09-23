/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';


export interface User{
  id: number;
  name: string;
  email: string;
  password: string;
}


@Injectable()
export class UserService {
 private users:User[] =[];
 private idCounter = 1;

 createUser(name:string , email:string, password:string):User{
  const user = {id: this.idCounter++, name, email, password};
  this.users.push(user);
  return user;
 }

 getUsers():User[]{
  return this.users;
 }

 getUserById(id:number):User | undefined{
  return this.users.find(user => user.id === id);
 }

 updateUser(id:number, name?:string, email?:string, password?:string):User | undefined{
  const user = this.getUserById(id);
  if(user){
    user.name= name || user.name;
    user.email= email || user.email;
    user.password= password || user.password; 
  }
   return user;
 }

 deleteUser(id:number):boolean{
  const index = this.users.findIndex(u => u.id === id);
  if(index === -1) return false;
  this.users.splice(index,1);
  return true;
 }
}
