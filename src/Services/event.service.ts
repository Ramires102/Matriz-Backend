import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { CreateEventDto } from '../Rutas/dto/create-event.dto'
import { UpdateEventDto } from '../Rutas/dto/update-event.dto'

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  private parseDate(value?: string) {
    return value ? new Date(value) : undefined
  }

  private async ensureEventCategoryExists(categoryFK: number) {
    const category = await this.prisma.eventCategories.findFirst({
      where: { id: categoryFK },
    })
    if (!category) {
      throw new BadRequestException('La categoría de evento especificada no existe')
    }
  }

  private readonly ownerPublicSelect = {
    id: true,
    user: true,
    name: true,
    image: true,
    verified: true,
  }

  private readonly eventPublicInclude = {
    category: {
      select: {
        id: true,
        name: true,
      },
    },
    owner: {
      select: {
        id: true,
        user: true,
        name: true,
        image: true,
        verified: true,
      },
    },
    _count: { select: { guestsRel: true } },
  }

  async create(dto: CreateEventDto, userId: string, imageUrl?: string) {
    const data: any = {
      userFK: Number(userId),
      name: dto.name,
      description: dto.description ?? null,
      initDate: this.parseDate(dto.initDate),
      location: dto.location,
      categoryFK: dto.categoryFK,
      ticketPrice: dto.ticketPrice,
      open: dto.open ?? false,
    }

    await this.ensureEventCategoryExists(dto.categoryFK)

    if (imageUrl) {
      data.image = imageUrl
    }
    if (dto.endingDate) {
      data.endingDate = this.parseDate(dto.endingDate)
    }

    return this.prisma.events.create({ data })
  }

  async findAll(query: Record<string, any>) {
    const where: any = {} as any

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { location: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    if (query.categoryFK !== undefined) {
      where.categoryFK = Number(query.categoryFK)
    }
    if (query.location) {
      where.location = { contains: query.location, mode: 'insensitive' }
    }

    if (query.open === 'true') {
      where.open = true
    } else if (query.open === 'false') {
      where.open = false
    }

    const initDateFilter: any = {}
    if (query.from) {
      initDateFilter.gte = this.parseDate(query.from)
    }
    if (query.to) {
      initDateFilter.lte = this.parseDate(query.to)
    }
    if (Object.keys(initDateFilter).length) {
      where.initDate = initDateFilter
    }

    const limit = Math.min(Number(query.limit) || 20, 100)
    const cursorId = query.cursor ? Number(query.cursor) : undefined
    const orderDirection = query.order === 'desc' ? 'desc' : 'asc'
    const orderField = query.orderBy ?? 'initDate'

    const findArgs: any = {
      where,
      take: limit,
      orderBy: { [orderField]: orderDirection },
      include: this.eventPublicInclude,
    }
    if (cursorId !== undefined) {
      findArgs.cursor = { id: cursorId }
      findArgs.skip = 1
    }

    const events = await this.prisma.events.findMany(findArgs)

    const hasMore = events.length === limit
    const lastEvent = events[events.length - 1]

    return {
      data: events,
      pagination: {
        limit,
        hasMore,
        nextCursor: hasMore && lastEvent ? lastEvent.id : null,
      },
    }
  }

  async findOne(id: string, userId?: string) {
    const event = await this.prisma.events.findFirst({
      where: { id: Number(id) },
      include: {
        ...this.eventPublicInclude,
        guestsRel: { select: { userFK: true } },
      },
    })

    if (!event) {
      throw new NotFoundException('Evento no encontrado')
    }

    if (!event.open) {
      if (!userId) {
        throw new ForbiddenException('Evento privado')
      }
      const currentUserId = Number(userId)
      const isGuest = event.guestsRel.some((guest) => guest.userFK === currentUserId)
      if (event.userFK !== currentUserId && !isGuest) {
        throw new ForbiddenException('No tienes permiso para ver este evento')
      }
    }

    const { guestsRel, ...eventData } = event
    return eventData
  }

  async update(id: string, dto: UpdateEventDto, userId: string, imageUrl?: string) {
    const event = await this.prisma.events.findFirst({
      where: { id: Number(id) },
    })
    if (!event) {
      throw new NotFoundException('Evento no encontrado')
    }

    if (event.userFK !== Number(userId)) {
      throw new ForbiddenException('Solo el dueño puede actualizar el evento')
    }

    const data: any = {}
    if (dto.name !== undefined) data.name = dto.name
    if (dto.description !== undefined) data.description = dto.description
    if (imageUrl !== undefined) data.image = imageUrl
    if (dto.initDate !== undefined) data.initDate = this.parseDate(dto.initDate)
    if (dto.endingDate !== undefined) data.endingDate = this.parseDate(dto.endingDate)
    if (dto.location !== undefined) data.location = dto.location
    if (dto.open !== undefined) data.open = dto.open
    if (dto.categoryFK !== undefined) {
      await this.ensureEventCategoryExists(dto.categoryFK)
      data.categoryFK = dto.categoryFK
    }
    if (dto.ticketPrice !== undefined) data.ticketPrice = dto.ticketPrice

    return this.prisma.events.update({ where: { id: Number(id) }, data })
  }

  async remove(id: string, userId: string) {
    const event = await this.prisma.events.findFirst({
      where: { id: Number(id) },
    })
    if (!event) {
      throw new NotFoundException('Evento no encontrado')
    }

    if (event.userFK !== Number(userId)) {
      throw new ForbiddenException('Solo el dueño puede eliminar el evento')
    }

    const contractsCount = await this.prisma.contrats.count({
      where: { eventFK: Number(id) },
    })

    if (contractsCount > 0) {
      await this.prisma.contrats.updateMany({
        where: { eventFK: Number(id) },
        data: {
          eventFK: null as any,
        },
      })
    }

    await this.prisma.posts.deleteMany({ where: { eventFK: Number(id) } })
    await this.prisma.guests.deleteMany({ where: { eventFK: Number(id) } })
    await this.prisma.eventRating.deleteMany({ where: { eventFK: Number(id) } })
    await this.prisma.chats.deleteMany({ where: { eventId: Number(id) } })

    await this.prisma.events.delete({
      where: { id: Number(id) },
    })

    return { success: true }
  }
}
