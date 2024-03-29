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
import { UpdateAvatarDto } from './dto/updateAvatar.dto';
import { UserDecorator } from 'src/utils/decorator/User.decorator';
import { JwtPayloadInterface } from 'src/auth/interface';

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

  @Get('logged/in')
  @UseGuards(JwtAuthGuard)
  async getUserLogged(
    @UserDecorator() user: JwtPayloadInterface,
  ): Promise<User> {
    return await this.userService.getById(user.id);
  }

  @Put(':id')
  async updateUserByIdHandler(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateById(id, updateUserDto);
  }

  @Put('/avatar/:id')
  async updateAvatarHandler(
    @Param('id') id: string,
    @Body() updateAvatarDto: UpdateAvatarDto,
  ): Promise<User> {
    return await this.userService.updateAvatar(id, updateAvatarDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUserByIdHandler(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
