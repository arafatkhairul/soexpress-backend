import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createBrandDto: Prisma.BrandCreateInput) {
        return this.brandsService.create(createBrandDto);
    }

    @Get()
    findAll() {
        return this.brandsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.brandsService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateBrandDto: Prisma.BrandUpdateInput) {
        return this.brandsService.update(+id, updateBrandDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.brandsService.remove(+id);
    }
}
