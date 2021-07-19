import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(private userService: UserService,
                private jwtService: JwtService) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
            if (user && await this.userService.comparePasswords(pass, user.password)) {
                const { password, ...result } = user;
                return result;
            }
        return null;
    }

    async login(user: any) {
        const payload = { name: user.email, sub: user.id };
            return {
              accessToken: this.jwtService.sign(payload),
            };
    }
}
