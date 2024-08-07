import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailOptions } from './dto/mail-options.interface';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMail(options: MailOptions): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
  //! Metodos a crear
  //* Enviar Mail de Bienvenida a usuarios unicos nuevos
  //* Enviar Mail de agradecimiento + detalle con cada compra exitosa
  //* Enviar Mail de aviso cada nuevo producto creado? (low priority)
  //* Enviar Mail de publicidad de la pagina cada semana de inactividad? (low priority)
  //* Enviar Mail de Oferta Aplicada (low priority)

  async sendNewUserMail(userMail: string): Promise<void> {
    const mailOptions: MailOptions = {
      to: userMail,
      subject: 'Bienvenido a la Dionisio Wine Company',
      text: 'lorem ipsum dolor sit amet, consectet',
    };

    await this.sendMail(mailOptions);
  }

  async sendSuccessfulPurchaseMail(userMail: string): Promise<void> {
    const mailOptions: MailOptions = {
      to: userMail,
      subject: 'Gracias por su compra!',
      text: 'lorem ipsum dolor sit amet, consectet',
    };

    await this.sendMail(mailOptions);
  }
}
