import { Controller, Get, Post, Patch, Delete, Param, UseGuards, Query, Body, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role, Prisma } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(@Query('role') role?: Role) {
        return this.usersService.findAll(role);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Post()
    async create(@Body() createUserDto: Prisma.UserCreateInput) {
        if (createUserDto.password) {
            const bcrypt = require('bcrypt');
            createUserDto.password = await bcrypt.hash(createUserDto.password as string, 10);
        }
        try {
            return await this.usersService.createUser(createUserDto);
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictException('Email already exists');
            }
            throw error;
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
        if (updateUserDto.password) {
            const bcrypt = require('bcrypt');
            updateUserDto.password = await bcrypt.hash(updateUserDto.password as string, 10);
        }
        return this.usersService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}
