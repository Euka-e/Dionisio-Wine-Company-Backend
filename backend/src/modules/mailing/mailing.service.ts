import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

@Injectable()
export class MailingService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_EMAIL_USER, //process.env.NODEMAILER_EMAIL_USER
        pass: process.env.NODEMAILER_EMAIL_APP_PASS, //process.env.NODEMAILER_EMAIL_APP_PASS
      },
    });
  }

  async sendWelcomeEmail(to: string): Promise<void> {
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL_USER,
      to,
      subject: 'Bienvenido a nuestro servicio',
      text: 'Gracias por registrarte en nuestro servicio.',
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Correo de bienvenida enviado a: ' + to);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('Error al enviar el correo');
    }
  }
}
