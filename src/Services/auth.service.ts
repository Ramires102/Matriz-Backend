import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from './jwt.service'
import { PrismaService } from './prisma.service'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: { user: string; name: string; email: string; password: string; dni?: string; address?: string }) {
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ user: dto.user }, { email: dto.email }] },
    })
    if (existingUser) {
      throw new ConflictException('El usuario o email ya existe')
    }

    const hashed = await bcrypt.hash(dto.password, 10)
    const user = await this.prisma.user.create({
      data: {
        user: dto.user,
        name: dto.name,
        email: dto.email,
        password: hashed,
        dni: dto.dni || null,
        address: dto.address || null,
      },
    })

    const token = this.jwtService.sign({ id: user.id, role: user.role })
    const { password, ...userData } = user
    return { token, user: userData }
  }

  async login(dto: { user: string; password: string }) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ user: dto.user }, { email: dto.user }] },
    })
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const token = this.jwtService.sign({ id: user.id, role: user.role })
    const { password, ...userData } = user
    return { token, user: userData }
  }
}
