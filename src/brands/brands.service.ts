import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BrandsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.brand.findMany();
    }

    async findOne(id: number) {
        return this.prisma.brand.findUnique({ where: { id } });
    }

    async create(data: Prisma.BrandCreateInput) {
        return this.prisma.brand.create({ data });
    }

    async update(id: number, data: Prisma.BrandUpdateInput) {
        return this.prisma.brand.update({ where: { id }, data });
    }

    async remove(id: number) {
        return this.prisma.brand.delete({ where: { id } });
    }
}
