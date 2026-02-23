import { Controller, Post, Body, HttpCode, HttpStatus, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginDto: Record<string, any>) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    register(@Body() registerDto: Record<string, any>) {
        return this.authService.register(registerDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: any) {
        return req.user;
    }
}
