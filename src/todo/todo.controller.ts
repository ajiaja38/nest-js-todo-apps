import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from 'src/utils/guard/auth.guard';
import { CreateTodoDto } from './dto/createTodo.dto';
import { Todo } from '@prisma/client';
import { JwtPayloadInterface } from 'src/auth/interface';
import { User } from 'src/utils/decorator/User.decorator';

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
}
