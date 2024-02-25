import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { MessageService } from 'src/message/message.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { TimezoneService } from 'src/timezone/timezone.service';
import { UuidService } from 'src/uuid/uuid.service';
import * as bcrypt from 'bcrypt';
import {
  UserServiceInterface,
  getAllUser,
} from './interface/service.interface';
import { LoginDto } from 'src/auth/dto/Login.dto';
import { JwtPayloadInterface } from 'src/auth/interface';
import { UpdateAvatarDto } from './dto/updateAvatar.dto';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    private prisma: PrismaService,
    private readonly message: MessageService,
    private readonly time: TimezoneService,
    private readonly idService: UuidService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const createdAt: string = this.time.getTimeZone();
    const updatedAt: string = createdAt;

    const result: User = await this.prisma.user.create({
      data: {
        id: this.idService.generateId('user'),
        email: createUserDto.email,
        name: createUserDto.name,
        password: await bcrypt.hash(createUserDto.password, 12),
        role: createUserDto.role,
        createdAt,
        updatedAt,
      },
    });

    if (!result) {
      throw new BadRequestException('user gagal ditambahkan!');
    }

    this.message.setMessage(`Berhasil Registrasi User ${result.name}`);
    return result;
  }

  async getAll(
    page: number,
    limit: number,
    search: string,
  ): Promise<getAllUser> {
    let where = {};

    if (search) {
      where = {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const totalData = await this.prisma.user.count({ where });
    const totalPage = Math.ceil(totalData / limit);
    const result = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    this.message.setMessage('Berhasil Memuat Data Semua User');
    return {
      totalData,
      totalPage,
      page,
      data: result,
    };
  }

  async getById(id: string): Promise<User> {
    const result = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!result) {
      throw new NotFoundException('Maaf User tidak ditemukan');
    }

    this.message.setMessage(`Berhasil Memuat data user ${result.name}`);
    return result;
  }

  async updateById(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Maaf User Tidak Ditemukan!');
    }

    const result: User = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
        updatedAt: this.time.getTimeZone(),
      },
    });

    this.message.setMessage(`Berhasil update data ${result.name}`);
    return result;
  }

  async deleteUser(id: string): Promise<void> {
    const data: User = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    if (!data) {
      throw new NotFoundException('Maaf User Tidak Ditemukan!');
    }

    this.message.setMessage(`Berhasil menghapus data user ${data.name}`);
  }

  async updateAvatar(
    id: string,
    updateAvatarDto: UpdateAvatarDto,
  ): Promise<User> {
    const result = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        avatar: updateAvatarDto.avatar,
        updatedAt: this.time.getTimeZone(),
      },
    });

    if (!result) {
      throw new NotFoundException(
        'Gagal memperbarui avatar, user tidak ditemukan',
      );
    }

    this.message.setMessage('Berhasil Update Avatar');
    return result;
  }

  async validateCredentials(loginDto: LoginDto): Promise<JwtPayloadInterface> {
    const user: User = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('Login Gagal, Anda Tidak Terdaftar');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Maaf Password yang anda masukkan salah!');
    }

    return {
      id: user.id,
      name: user.name,
      role: user.role,
    };
  }
}
