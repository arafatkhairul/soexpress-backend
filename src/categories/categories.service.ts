import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.category.findMany();
    }

    async findOne(id: number) {
        return this.prisma.category.findUnique({ where: { id } });
    }

    async create(data: Prisma.CategoryCreateInput) {
        return this.prisma.category.create({ data });
    }

    async update(id: number, data: Prisma.CategoryUpdateInput) {
        return this.prisma.category.update({ where: { id }, data });
    }

    async remove(id: number) {
        return this.prisma.category.delete({ where: { id } });
    }
}
