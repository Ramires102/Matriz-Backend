import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const allowedOrigins = [
    'https://matriz.social',
    'https://www.matriz.social',
    'http://localhost:3000',
    'http://localhost:5173',
  ]

  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL)
  }

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      try {
        const hostname = new URL(origin).hostname
        if (allowedOrigins.includes(origin) || hostname === 'matriz.social' || hostname.endsWith('.matriz.social')) {
          return callback(null, true)
        }
      } catch (e) {}
      return callback(null, true)
    },
    credentials: true,
  })

  app.use(cookieParser())

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
