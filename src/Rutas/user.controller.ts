import { Controller, Get, Param, Patch, Delete, Body, UseGuards, ForbiddenException } from '@nestjs/common'
import { UserService } from '../Services/user.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { VerifiedGuard } from '../auth/guards/verified.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    if (user.role !== 'ADMIN' && String(user.id) !== id) {
      throw new ForbiddenException('No puedes modificar otro usuario')
    }
    return this.userService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    if (user.role !== 'ADMIN' && String(user.id) !== id) {
      throw new ForbiddenException('No puedes eliminar otro usuario')
    }
    return this.userService.remove(id)
  }
}
