import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET ?? 'default-secret'

@Injectable()
export class JwtService {
  sign(payload: Record<string, any>): string {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' })
  }

  verify(token: string): any {
    return jwt.verify(token, SECRET)
  }
}
