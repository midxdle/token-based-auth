import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    return this.userRepository.save(user);
  }

  findByUsername(username: string): Promise<User> {
    const user = this.userRepository.findOneByOrFail({ username });
    return user;
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const username = createUserDto.username;
    const checkUser = await this.userRepository.findOneByOrFail({ username });

    if (checkUser) {
      throw new ConflictException('User Already Exists');
    }

    const user = new User();
    user.username = username;
    user.password = createUserDto.password;

    return this.userRepository.save(user);
  }

  async validateUser(createUserDto: CreateUserDto): Promise<User> {
    const username = createUserDto.username;
    const checkUser = await this.userRepository.findOneByOrFail({ username });

    if (!checkUser || createUserDto.password === checkUser.password) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return checkUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
