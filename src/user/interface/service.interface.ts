import { RoleEnum, User } from '@prisma/client';
import { UpdateUserDto } from '../dto/updateUser.dto';

export interface getAllUser {
  totalData: number;
  totalPage: number;
  page: number;
  data: {
    id: string;
    email: string;
    name: string;
    avatar: string;
    role: RoleEnum;
  }[];
}

export interface UserServiceInterface {
  getAll(page: number, limit: number, search: string): Promise<getAllUser>;
  getById(id: string): Promise<User>;
  updateById(id: string, updateUserDto: UpdateUserDto): Promise<User>;
}
