import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserCreateDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.users.findMany({
      where: { is_active: true },
    });
  }

  async findById(id: number) {
    return await this.prisma.users.findUnique({
      where: { id },
    });
  }

  async createUser(data: UserCreateDto) {
    return await this.prisma.users.upsert({
      create: {
        email: data.email,
        username: data.name,
        phone: data.phone,
        language: data.language,
      },
      where: { email: data.email },
      update: {
        language: data.language,
        username: data.name,
        phone: data.phone,
        is_paid: data.is_paid,
        is_active: data.is_active,
      },
    });
  }
}
