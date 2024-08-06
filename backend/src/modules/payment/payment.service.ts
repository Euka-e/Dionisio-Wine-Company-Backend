import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get<string>('sk_test_51PkM2hRqIY0nHTTTBkDJoQR0qNws8I1j2sJos1LsUUYJnWLUKOXMw9bsYApyINmOLiLWvygr16tLFAHm5txX2iTa00rvaKX2Jv'), {
      apiVersion: '2024-06-20',
    });
  }

  async createPaymentIntent(amount: number) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'ars',
      });
      return paymentIntent;
    } catch (error) {
      throw new Error(`Error creating payment intent: ${error.message}`);
    }
  }
}