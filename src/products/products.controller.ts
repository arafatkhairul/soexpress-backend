import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createProductDto: Prisma.ProductUncheckedCreateInput) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    findAll(
        @Query('skip') skip?: string,
        @Query('take') take?: string,
        @Query('search') search?: string,
    ) {
        const where = search ? {
            OR: [
                { title: { contains: search } },
                { description: { contains: search } }
            ]
        } : {};

        return this.productsService.findAll({
            skip: skip ? parseInt(skip) : undefined,
            take: take ? parseInt(take) : undefined,
            where,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateProductDto: Prisma.ProductUncheckedUpdateInput) {
        return this.productsService.update(+id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.productsService.remove(+id);
    }
}
