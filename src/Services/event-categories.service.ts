import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { CreateCategoryDto } from '../Rutas/dto/create-category.dto'

@Injectable()
export class EventCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.eventCategories.findFirst({
      where: { name: dto.name },
    })
    if (existing) {
      throw new ConflictException('La categoría de evento ya existe')
    }
    return this.prisma.eventCategories.create({
      data: { name: dto.name },
    })
  }

  async findAll(sinceTimestamp?: string) {
    const where: any = {}

    return this.prisma.eventCategories.findMany({
      where,
      orderBy: { name: 'asc' },
    })
  }

  async softDelete(id: number) {
    const category = await this.prisma.eventCategories.findFirst({
      where: { id },
    })
    if (!category) {
      throw new NotFoundException('Categoría no encontrada')
    }

    const eventsCount = await this.prisma.events.count({
      where: { categoryFK: id },
    })
    if (eventsCount > 0) {
      throw new ConflictException('No se puede eliminar una categoría con eventos asociados')
    }

    return this.prisma.eventCategories.delete({
      where: { id },
    })
  }
}
