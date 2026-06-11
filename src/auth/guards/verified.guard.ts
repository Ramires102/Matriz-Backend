import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'

@Injectable()
export class VerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest()

    if (!user) {
      throw new ForbiddenException('No autenticado')
    }

    if (!user.verified) {
      throw new ForbiddenException('Debes verificar tu cuenta para realizar esta acción')
    }

    return true
  }
}
