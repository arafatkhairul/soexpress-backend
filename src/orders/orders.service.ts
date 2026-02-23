import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async findAll(userId?: string) {
        return this.prisma.order.findMany({
            where: userId ? { userId } : undefined,
            include: {
                user: { select: { name: true, email: true, role: true } },
                items: { include: { product: true } }
            }
        });
    }

    async findOne(id: string) {
        return this.prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: true } }
            }
        });
    }

    async create(data: Prisma.OrderUncheckedCreateInput) {
        return this.prisma.order.create({ data });
    }

    async update(id: string, data: Prisma.OrderUncheckedUpdateInput) {
        return this.prisma.order.update({ where: { id }, data });
    }

    async remove(id: string) {
        return this.prisma.order.delete({ where: { id } });
    }
}
