import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Role } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(role?: Role): Promise<Omit<User, 'password'>[]> {
        const users = await this.prisma.user.findMany({
            where: role ? { role } : undefined,
        });
        return users.map(u => {
            const { password, ...result } = u;
            return result;
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async findById(id: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        const { password, ...result } = user;
        return result;
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({ data });
    }

    async updateLastLogin(id: string): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: { lastLogin: new Date() },
        });
    }

    async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({ where: { id }, data });
    }

    async deleteUser(id: string): Promise<User> {
        return this.prisma.user.delete({ where: { id } });
    }
}
