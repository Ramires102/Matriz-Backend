import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Injectable()
export class EventRatingService {
  constructor(private readonly prisma: PrismaService) {}

  async addReview(eventId: number, userId: number, rate: number) {
    const event = await this.prisma.events.findUnique({ where: { id: eventId } })
    if (!event) {
      throw new NotFoundException('Evento no encontrado')
    }

    const existing = await this.prisma.eventRating.findUnique({
      where: { eventFK_userFK: { eventFK: eventId, userFK: userId } },
    })
    if (existing) {
      throw new ConflictException('Ya has calificado este evento')
    }

    await this.prisma.eventRating.create({
      data: {
        eventFK: eventId,
        userFK: userId,
        rate,
      },
    })

    await this.recalculateAverage(eventId)
    return { message: 'Calificación agregada exitosamente' }
  }

  async removeReview(eventId: number, userId: number) {
    const existing = await this.prisma.eventRating.findUnique({
      where: { eventFK_userFK: { eventFK: eventId, userFK: userId } },
    })
    if (!existing) {
      throw new NotFoundException('No has calificado este evento')
    }

    await this.prisma.eventRating.delete({
      where: { id: existing.id },
    })

    await this.recalculateAverage(eventId)
    return { message: 'Calificación eliminada exitosamente' }
  }

  private async recalculateAverage(eventId: number) {
    const result = await this.prisma.eventRating.aggregate({
      where: { eventFK: eventId },
      _avg: { rate: true },
    })

    const average = result._avg.rate ?? -1
    const roundedAverage = average === -1 ? -1 : Math.round(average)

    await this.prisma.events.update({
      where: { id: eventId },
      data: { rate: roundedAverage },
    })
  }
}
