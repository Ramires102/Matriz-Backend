import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Injectable()
export class GuestsService {
  constructor(private readonly prisma: PrismaService) {}

  async addGuest(eventId: number, userId: number) {
    const event = await this.prisma.events.findUnique({ where: { id: eventId } })
    if (!event) {
      throw new NotFoundException('Evento no encontrado')
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }

    if (!event.open) {
      throw new BadRequestException('El evento no acepta invitados')
    }

    const existing = await this.prisma.guests.findUnique({
      where: { eventFK_userFK: { eventFK: eventId, userFK: userId } },
    })
    if (existing) {
      throw new ConflictException('El usuario ya es invitado de este evento')
    }

    return this.prisma.guests.create({
      data: {
        eventFK: eventId,
        userFK: userId,
        paymentState: 'NOT_REQUIRED',
      },
    })
  }

  async removeGuest(eventId: number, userId: number) {
    const guest = await this.prisma.guests.findUnique({
      where: { eventFK_userFK: { eventFK: eventId, userFK: userId } },
    })
    if (!guest) {
      throw new NotFoundException('El usuario no es invitado de este evento')
    }

    return this.prisma.guests.delete({
      where: { id: guest.id },
    })
  }

  async getGuests(eventId: number) {
    return this.prisma.guests.findMany({
      where: { eventFK: eventId },
      include: {
        user: {
          select: {
            id: true,
            user: true,
            name: true,
            image: true,
          },
        },
      },
    })
  }
}
