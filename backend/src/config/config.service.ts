import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });
@Injectable()
export class ConfigService {
  private readonly stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  get stripeConfig() {
    return {
      secretKey: this.stripeSecretKey,
    };
  }
}