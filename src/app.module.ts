import { Module, ValidationPipe } from '@nestjs/common'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { UserController } from './Rutas/user.controller'
import { AuthController } from './Rutas/auth.controller'
import { UserService } from './Services/user.service'
import { AuthService } from './Services/auth.service'
import { JwtService } from './Services/jwt.service'
import { EventController } from './Rutas/event.controller'
import { EventService } from './Services/event.service'
import { EventCategoriesController } from './Rutas/event-categories.controller'
import { EventCategoriesService } from './Services/event-categories.service'
import { ServiceCategoriesController } from './Rutas/service-categories.controller'
import { ServiceCategoriesService } from './Services/service-categories.service'
import { PrismaService } from './Services/prisma.service'
import { GuestsService } from './Services/guests.service'
import { EventRatingService } from './Services/event-rating.service'
import { EmailService } from './Services/email.service'
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter'
import { RolesGuard } from './auth/guards/roles.guard'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    EventController,
    EventCategoriesController,
    ServiceCategoriesController,
  ],
  providers: [
    AuthService,
    JwtService,
    UserService,
    EventService,
    EventCategoriesService,
    ServiceCategoriesService,
    PrismaService,
    GuestsService,
    EventRatingService,
    EmailService,
    RolesGuard,
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
  ],
})
export class AppModule {}
