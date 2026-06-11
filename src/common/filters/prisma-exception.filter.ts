import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Error interno de base de datos'

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT
        const target = (exception.meta?.target as string[])?.join(', ') || 'campo'
        message = `El valor ya existe en: ${target}`
        break
      case 'P2025':
        status = HttpStatus.NOT_FOUND
        message = 'Registro no encontrado'
        break
      case 'P2003':
        status = HttpStatus.BAD_REQUEST
        message = 'Violación de clave foránea'
        break
      case 'P2014':
        status = HttpStatus.BAD_REQUEST
        message = 'Violación de relación requerida'
        break
      case 'P2001':
        status = HttpStatus.NOT_FOUND
        message = 'Registro no encontrado'
        break
      case 'P2018':
        status = HttpStatus.BAD_REQUEST
        message = 'Registro relacionado no encontrado'
        break
      case 'P2021':
        status = HttpStatus.INTERNAL_SERVER_ERROR
        message = 'La tabla no existe en la base de datos'
        break
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR
        message = `Error de base de datos: ${exception.message}`
        break
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.name,
      timestamp: new Date().toISOString(),
    })
  }
}
