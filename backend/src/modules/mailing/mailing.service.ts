import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as mailTemplates from './templates';
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
        user: process.env.NODEMAILER_EMAIL_USER,
        pass: process.env.NODEMAILER_EMAIL_APP_PASS,
      },
    });
  }

  async sendWelcomeEmail(to: string): Promise<void> {
    const mailOptions = {
      from: '"Dionisio" <' + process.env.NODEMAILER_EMAIL_USER + '>',
      to,
      subject: 'Bienvenido a nuestro servicio',
      html: mailTemplates.welcomeEmail,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Correo de bienvenida enviado a: ' + to);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('Error al enviar el correo');
    }
  }

  async sendPurchaseConfirmationEmail(to: string): Promise<void> {
    const mailOptions = {
      from: '"Dionisio" <' + process.env.NODEMAILER_EMAIL_USER + '>',
      to,
      subject: 'Bienvenido a nuestro servicio',
      html: mailTemplates.purchaseEmail,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Correo de bienvenida enviado a: ' + to);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('Error al enviar el correo');
    }
  }

  async sendWeMissYouEmail(to: string): Promise<void> {
    const mailOptions = {
      from: '"Dionisio" <' + process.env.NODEMAILER_EMAIL_USER + '>',
      to,
      subject: 'Te extrañamos :(',
      html: mailTemplates.missYouEmail,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Correo semanal enviado a:', to);
    } catch (error) {
      console.error('Error al enviar el correo a:', to, error);
      throw new Error('Error al enviar el correo');
    }
  }
}
