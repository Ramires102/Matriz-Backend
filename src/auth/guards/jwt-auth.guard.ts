import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const token = this.extractToken(request)

    if (!token) {
      throw new UnauthorizedException('Token de autenticación no proporcionado')
    }

    try {
      const secret = process.env.JWT_SECRET || 'default-secret'
      const decoded = jwt.verify(token, secret)
      request.user = decoded
      return true
    } catch {
      throw new UnauthorizedException('Token inválido o expirado')
    }
  }

  private extractToken(request: any): string | undefined {
    const authHeader = request.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7)
    }
    if (request.cookies?.token) {
      return request.cookies.token
    }
    return undefined
  }
}
