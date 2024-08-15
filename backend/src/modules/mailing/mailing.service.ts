import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as mailTemplates from './templates';
import * as dotenv from 'dotenv';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MailingService {
  private transporter;

  constructor(private readonly usersService: UsersService) {
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
      //from: `"Gracias por Registrarse!" <${process.env.NODEMAILER_EMAIL_USER}>`,
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

  @Cron('*/1 * * * *')
  async sendWeeklyEmailToAllUsers() {
    try {
      const page = 1;
      const limit = 1000;
      const result: any[][] = await this.usersService.getUsers(page, limit);
      const allUsers: User[] = result.flat(); //! Aplana la matriz bidimensional, debido a que el getUsers retorna Users[][]

      for (const user of allUsers) {
        await this.sendWeMissYouEmail(user.email);
      }
    } catch (error) {
      console.error('Error al enviar correos semanales:', error);
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
