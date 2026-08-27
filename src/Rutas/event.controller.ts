import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, Req, UseGuards, UseInterceptors,
  UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator,
  ForbiddenException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import { EventService } from '../Services/event.service'
import { GuestsService } from '../Services/guests.service'
import { EventRatingService } from '../Services/event-rating.service'
import { EmailService } from '../Services/email.service'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { VerifiedGuard } from '../auth/guards/verified.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly guestsService: GuestsService,
    private readonly eventRatingService: EventRatingService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    ) file: Express.Multer.File | undefined,
    @Body() dto: CreateEventDto,
    @CurrentUser() user: any,
  ) {
    let imageUrl: string | undefined
    if (file) {
      imageUrl = await this.uploadImageToCloud(file)
    }
    return this.eventService.create(dto, String(user.id), imageUrl)
  }

  @Get()
  async findAll(@Query() query: Record<string, any>) {
    return this.eventService.findAll(query)
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const userId = (req as any).user?.id ?? (req as any).user?.sub
    return this.eventService.findOne(id, userId ? String(userId) : undefined)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    ) file: Express.Multer.File | undefined,
    @Body() dto: UpdateEventDto,
    @CurrentUser() user: any,
  ) {
    let imageUrl: string | undefined
    if (file) {
      imageUrl = await this.uploadImageToCloud(file)
    }
    return this.eventService.update(id, dto, String(user.id), imageUrl)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.eventService.remove(id, String(user.id))
  }

  @Post(':id/guests')
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  async addGuest(
    @Param('id') id: string,
    @Body('userId') guestUserId: number,
    @CurrentUser() user: any,
  ) {
    const event = await this.eventService.findOne(id, String(user.id))
    if ((event as any).userFK !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Solo el dueño del evento puede añadir invitados')
    }
    return this.guestsService.addGuest(Number(id), guestUserId)
  }

  @Delete(':id/guests/:guestId')
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  async removeGuest(
    @Param('id') id: string,
    @Param('guestId') guestId: string,
    @CurrentUser() user: any,
  ) {
    const event = await this.eventService.findOne(id, String(user.id))
    if ((event as any).userFK !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Solo el dueño del evento puede quitar invitados')
    }
    return this.guestsService.removeGuest(Number(id), Number(guestId))
  }

  @Get(':id/guests')
  @UseGuards(JwtAuthGuard)
  async getGuests(@Param('id') id: string) {
    return this.guestsService.getGuests(Number(id))
  }

  @Post(':id/invite')
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  async sendInvitation(
    @Param('id') id: string,
    @Body('email') email: string,
    @CurrentUser() user: any,
  ) {
    const event = await this.eventService.findOne(id, String(user.id))
    const eventData = event as any
    if (eventData.userFK !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Solo el dueño del evento puede enviar invitaciones')
    }
    await this.emailService.sendInvitation(email, eventData.name, user.name || user.user)
    return { message: 'Invitación enviada exitosamente' }
  }

  @Post(':id/rating')
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  async addRating(
    @Param('id') id: string,
    @Body('rate') rate: number,
    @CurrentUser() user: any,
  ) {
    return this.eventRatingService.addReview(Number(id), user.id, rate)
  }

  @Delete(':id/rating')
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  async removeRating(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.eventRatingService.removeReview(Number(id), user.id)
  }

  private async uploadImageToCloud(file: Express.Multer.File): Promise<string> {
    const cloudinary = require('cloudinary').v2

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'events',
        },
        (error: any, result: any) => {
          if (error) reject(error)
          else resolve(result.secure_url)
        },
      )

      uploadStream.end(file.buffer)
    })
  }
}
