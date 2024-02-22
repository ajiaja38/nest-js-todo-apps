import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';
import { getAllUser } from './interface/service.interface';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from 'src/utils/guard/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUserHandler(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUserHandler(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('search') search: string,
  ): Promise<getAllUser> {
    return await this.userService.getAll(page, limit, search);
  }

  @Get(':id')
  async getUserByIdHandler(@Param('id') id: string): Promise<User> {
    return await this.userService.getById(id);
  }

  @Put(':id')
  async updateUserByIdHandler(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateById(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUserByIdHandler(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
