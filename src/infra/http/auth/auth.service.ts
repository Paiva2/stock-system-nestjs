import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(subId: string) {
    const payload = { sub: subId };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
