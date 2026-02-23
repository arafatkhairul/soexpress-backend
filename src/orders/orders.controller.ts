import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    create(@Body() createOrderDto: Prisma.OrderUncheckedCreateInput) {
        return this.ordersService.create(createOrderDto);
    }

    @Get()
    findAll(@Query('userId') userId?: string) {
        return this.ordersService.findAll(userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateOrderDto: Prisma.OrderUncheckedUpdateInput) {
        return this.ordersService.update(id, updateOrderDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.ordersService.remove(id);
    }
}
