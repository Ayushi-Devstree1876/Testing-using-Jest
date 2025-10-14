import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      console.log(`Attempted to register existing user: ${dto.email}`);
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({ ...dto, password: hashedPassword });
    console.log(`Registering new user: ${dto.email}`);
    return this.userRepository.save(user);
  }

  async validateUser(email: string, plainPassword: string): Promise<User | null> {
    console.log(`Validating user: ${email}`);
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      console.log(`User not found: ${email}`);
      return null;
    }

    console.log(`Stored password: ${user.password}`);
    console.log(`Entered password: ${plainPassword}`);
    console.log(`Comparing password...`);

    const isPasswordValid = await bcrypt.compare(plainPassword, user.password);
    console.log(`Password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log(`Invalid credentials for user: ${email}`);
      return null;
    }

    return user;
  }

  async login(dto: LoginUserDto) {
    console.log(`Login attempt: ${dto.email}`);

    const user = await this.validateUser(dto.email, dto.password);

    if (!user) {
      console.log(`Login failed: Invalid credentials for ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    console.log(`Login successful: ${dto.email}`);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
