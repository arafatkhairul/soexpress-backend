import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ProductWhereUniqueInput;
        where?: Prisma.ProductWhereInput;
        orderBy?: Prisma.ProductOrderByWithRelationInput;
    }) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.product.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async findOne(id: number) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { reviews: true },
        });
    }

    async create(data: Prisma.ProductUncheckedCreateInput) {
        return this.prisma.product.create({ data });
    }

    async update(id: number, data: Prisma.ProductUncheckedUpdateInput) {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async remove(id: number) {
        return this.prisma.product.delete({
            where: { id },
        });
    }
}
