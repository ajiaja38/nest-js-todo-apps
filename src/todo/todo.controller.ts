import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from 'src/utils/guard/auth.guard';
import { CreateTodoDto } from './dto/createTodo.dto';
import { Todo } from '@prisma/client';
import { JwtPayloadInterface } from 'src/auth/interface';
import { User } from 'src/utils/decorator/User.decorator';
import { UpdateTodoDto } from './dto/updateTodoDto';

@Controller('todo')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async createTodoHandler(
    @Body() createTodoDto: CreateTodoDto,
    @User() user: JwtPayloadInterface,
  ): Promise<Todo> {
    return await this.todoService.createTodo(user.id, createTodoDto);
  }

  @Get()
  async getAllTodoHandler(): Promise<Todo[]> {
    return await this.todoService.getAllTodo();
  }

  @Get('all-by-author')
  async getAllTodoByAuthorHandler(
    @User() user: JwtPayloadInterface,
  ): Promise<Todo[]> {
    return await this.todoService.getAllTodoByAuthor(user.id);
  }

  @Get(':id')
  async getDetailTodoHandler(@Param('id') id: string): Promise<Todo> {
    return await this.todoService.getTodoById(id);
  }

  @Put(':id')
  async updateTodoHandler(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return await this.todoService.updateTodoDto(id, updateTodoDto);
  }

  @Delete(':id')
  async deleteTodoHandler(
    @User() user: JwtPayloadInterface,
    @Param('id') id: string,
  ): Promise<void> {
    await this.todoService.deleteToto(user.id, id);
  }
}
