import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { EventCategoriesService } from '../Services/event-categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { VerifiedGuard } from '../auth/guards/verified.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@Controller('events/categories')
export class EventCategoriesController {
  constructor(private readonly eventCategoriesService: EventCategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, VerifiedGuard)
  @Roles('ADMIN')
  async create(@Body() dto: CreateCategoryDto) {
    return this.eventCategoriesService.create(dto)
  }

  @Get()
  async findAll(@Query('since') since?: string) {
    return this.eventCategoriesService.findAll(since)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, VerifiedGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.eventCategoriesService.softDelete(Number(id))
  }
}
