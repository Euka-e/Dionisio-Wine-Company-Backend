import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });

const StripeKey = process.env.STRIPE_SECRET_KEY
@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get<string>(StripeKey), {
      apiVersion: '2024-06-20',
    });
  }

  async createPaymentIntent(amount: number) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100, // Stripe espera el monto en centavos
        currency: 'ars', // Asegúrate de que esta moneda esté habilitada en Stripe
      });
      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      throw new Error(`Error creating payment intent: ${error.message}`);
    }
  }
}
