import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Todo } from '@prisma/client';
import { MessageService } from 'src/message/message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TimezoneService } from 'src/timezone/timezone.service';
import { UuidService } from 'src/uuid/uuid.service';
import { CreateTodoDto } from './dto/createTodo.dto';
import { UpdateTodoDto } from './dto/updateTodoDto';

@Injectable()
export class TodoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly time: TimezoneService,
    private readonly message: MessageService,
    private readonly uuid: UuidService,
  ) {}

  async createTodo(
    author_id: string,
    createTodoDto: CreateTodoDto,
  ): Promise<Todo> {
    const result = await this.prisma.todo.create({
      data: {
        id: this.uuid.generateId('todo'),
        title: createTodoDto.title,
        content: createTodoDto.content,
        image: createTodoDto.image,
        createdAt: this.time.getTimeZone(),
        updatedAt: this.time.getTimeZone(),
        author_id,
      },
    });

    if (!result) {
      throw new BadRequestException('Gagal membuat todo!');
    }

    this.message.setMessage('Berhasil membuat todo');
    return result;
  }

  async getAllTodo(): Promise<any> {
    const result: any[] = await this.prisma.todo.findMany();

    if (result.length) {
      this.message.setMessage('Berhasil memuat list todo');
    } else {
      this.message.setMessage('Belum ada todo yang di inputkan');
    }

    return result;
  }

  async getAllTodoByAuthor(author_id: string): Promise<any> {
    const result: any[] = await this.prisma.todo.findMany({
      where: {
        author_id,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (result.length) {
      this.message.setMessage('Berhasil memuat list todo');
    } else {
      this.message.setMessage('Belum ada todo yang di inputkan');
    }

    return result;
  }

  async getTodoById(id: string): Promise<Todo> {
    const result = await this.prisma.todo.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Maaf, todo tidak ditemukan!');
    }

    this.message.setMessage('Berhasil mendapatkan todo');
    return result;
  }

  async updateTodoDto(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const isExist = await this.prisma.todo.findUnique({ where: { id } });

    if (!isExist) throw new NotFoundException('Todo tidak ditemukan');

    const result = await this.prisma.todo.update({
      where: {
        id,
      },
      data: {
        ...updateTodoDto,
        updatedAt: this.time.getTimeZone(),
      },
    });

    if (!result) throw new BadRequestException('Gagal Update todo');
    this.message.setMessage('Berhasil Update Todo');

    return result;
  }

  async deleteToto(author_id: string, id: string): Promise<void> {
    const data: Todo = await this.prisma.todo.findUnique({ where: { id } });

    if (!data) {
      throw new NotFoundException('Gagal Menghapus todo, todo tidak terdaftar');
    }

    if (data.author_id !== author_id) {
      throw new UnauthorizedException(
        'Maaf anda tidak memiliki akses untuk menghapus resource ini!',
      );
    }

    const result = await this.prisma.todo.delete({ where: { id } });

    if (!result) {
      throw new BadRequestException('Gagal Menghapus todo');
    }

    this.message.setMessage('Berhasil menghapus todo');
  }
}
