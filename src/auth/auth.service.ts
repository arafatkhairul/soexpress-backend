import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const validUser = await this.validateUser(user.email, user.password);
        if (!validUser) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Update lastLogin
        await this.usersService.updateLastLogin(validUser.id);

        const payload = { email: validUser.email, sub: validUser.id, role: validUser.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: validUser,
        };
    }

    async register(userData: any) {
        const existingUser = await this.usersService.findByEmail(userData.email);
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await this.usersService.createUser({
            ...userData,
            password: hashedPassword,
        });

        const { password, ...result } = newUser;
        return result;
    }
}
