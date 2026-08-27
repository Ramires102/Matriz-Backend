import { Injectable, ConflictException } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { CreateCategoryDto } from '../Rutas/dto/create-category.dto'

@Injectable()
export class ServiceCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.serviceCategories.findUnique({
      where: { name: dto.name },
    })
    if (existing) {
      throw new ConflictException('La categoría de servicio ya existe')
    }
    return this.prisma.serviceCategories.create({
      data: { name: dto.name },
    })
  }

  async findAll() {
    return this.prisma.serviceCategories.findMany({
      orderBy: { name: 'asc' },
    })
  }
}
