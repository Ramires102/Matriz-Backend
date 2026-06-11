import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { CreateCategoryDto } from '../Rutas/dto/create-category.dto'

@Injectable()
export class EventCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.eventCategories.findFirst({
      where: { name: dto.name, deletedAt: null },
    })
    if (existing) {
      throw new ConflictException('La categoría de evento ya existe')
    }
    return this.prisma.eventCategories.create({
      data: { name: dto.name },
    })
  }

  async findAll(sinceTimestamp?: string) {
    const where: any = { deletedAt: null }

    if (sinceTimestamp) {
      const since = new Date(sinceTimestamp)
      where.createdAt = { gt: since }
    }

    return this.prisma.eventCategories.findMany({
      where,
      orderBy: { name: 'asc' },
    })
  }

  async softDelete(id: number) {
    const category = await this.prisma.eventCategories.findFirst({
      where: { id, deletedAt: null },
    })
    if (!category) {
      throw new NotFoundException('Categoría no encontrada')
    }

    const eventsCount = await this.prisma.events.count({
      where: { categoryFK: id, deletedAt: null },
    })
    if (eventsCount > 0) {
      throw new ConflictException('No se puede eliminar una categoría con eventos asociados')
    }

    return this.prisma.eventCategories.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
