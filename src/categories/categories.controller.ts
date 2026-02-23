import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createCategoryDto: Prisma.CategoryCreateInput) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateCategoryDto: Prisma.CategoryUpdateInput) {
        return this.categoriesService.update(+id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(+id);
    }
}
