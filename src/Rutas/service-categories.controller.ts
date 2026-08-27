import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { ServiceCategoriesService } from '../Services/service-categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { VerifiedGuard } from '../auth/guards/verified.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@Controller('services/categories')
export class ServiceCategoriesController {
  constructor(private readonly serviceCategoriesService: ServiceCategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, VerifiedGuard)
  @Roles('ADMIN')
  async create(@Body() dto: CreateCategoryDto) {
    return this.serviceCategoriesService.create(dto)
  }

  @Get()
  async findAll() {
    return this.serviceCategoriesService.findAll()
  }
}
