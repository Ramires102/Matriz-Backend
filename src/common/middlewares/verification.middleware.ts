import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class VerificationMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const user = (req as any).user

    if (!user) {
      throw new ForbiddenException('No autenticado')
    }

    if (!user.verified) {
      throw new ForbiddenException('Debes verificar tu cuenta para realizar esta acción')
    }

    next()
  }
}
