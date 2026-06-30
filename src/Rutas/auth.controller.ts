import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from '../Services/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: { user: string; name: string; email: string; password: string; dni?: string; address?: string }) {
    return this.authService.register(dto)
  }

  @Post('login')
  login(@Body() dto: { user: string; password: string }) {
    return this.authService.login(dto)
  }
}
