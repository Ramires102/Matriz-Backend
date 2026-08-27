import { Injectable, NotFoundException } from '@nestjs/common'
import { User } from '@prisma/client'
import { UpdateUserDto } from '../Rutas/dto/update-user.dto'
import { PrismaService } from './prisma.service'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private readonly publicSelect = {
    role: true,
    user: true,
    name: true,
    email: true,
    verified: true,
    image: true,
    dni: true,
    address: true,
    cuit: true,
  }

  async findAll(page: number = 1, limit: number = 20): Promise<any[]> {
    const skip = (page - 1) * limit
    const users = await this.prisma.user.findMany({
      take: limit,
      skip,
      select: this.publicSelect,
    })
    return users.map((user) => {
      if (user.role !== 'OFFERER') {
        const { address, cuit, ...rest } = user
        return rest
      }
      return user
    })
  }

  async findOne(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
      select: this.publicSelect,
    })
    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }
    if (user.role !== 'OFFERER') {
      const { address, cuit, ...result } = user as any
      return result
    }
    return user
  }

  async update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const data: any = {}
    if (dto.user !== undefined) data.user = dto.user
    if (dto.name !== undefined) data.name = dto.name
    if (dto.email !== undefined) data.email = dto.email
    if (dto.image !== undefined) data.image = dto.image
    if (dto.dni !== undefined) data.dni = dto.dni
    if (dto.cuit !== undefined) data.cuit = dto.cuit
    if (dto.address !== undefined) data.address = dto.address

    const user = await this.prisma.user.update({
      where: { id: Number(id) },
      data,
    })
    const { password, ...result } = user
    return result
  }

  async remove(id: string): Promise<{ success: boolean }> {
    await this.prisma.user.delete({ where: { id: Number(id) } })
    return { success: true }
  }
}
