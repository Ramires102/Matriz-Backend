import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  async sendInvitation(email: string, eventName: string, inviterName: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

    await this.transporter.sendMail({
      from: `"Meeter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Invitación a ${eventName}`,
      html: `
        <h2>¡Has sido invitado!</h2>
        <p><strong>${inviterName}</strong> te ha invitado al evento <strong>${eventName}</strong>.</p>
        <p>Haz clic en el siguiente enlace para ver los detalles:</p>
        <a href="${frontendUrl}/events" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
          Ver evento
        </a>
      `,
    })
  }

  async sendVerificationEmail(email: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

    await this.transporter.sendMail({
      from: `"Meeter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verifica tu cuenta en Meeter',
      html: `
        <h2>Bienvenido a Meeter</h2>
        <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
        <a href="${frontendUrl}/verify?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
          Verificar cuenta
        </a>
      `,
    })
  }
}
