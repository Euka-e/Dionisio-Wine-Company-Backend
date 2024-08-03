import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderDetail } from 'src/modules/orders/entities/orderDetail.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { config as dotenvConfig } from 'dotenv';
import { Offer } from 'src/modules/offers/entities/offer.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { CartDetail } from 'src/modules/cart/entities/cartDetail.entity';

dotenvConfig({ path: '.env.development' });

const config = {
    type: 'postgres',
    port: process.env.DB_PORT,
    url: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    entities: [User, Product, Order, OrderDetail, Category, Offer, Cart, CartDetail],
    migrations: ['dist/migrations/*{.ts,.js}'],
    autoLoadEntities: true,
    logging: ['error'],
    synchronize: true,
    dropSchema: false,
    dropDatabase: false

};
export const typeOrmConfig = registerAs('typeorm', () => config);
export const conectionSource = new DataSource(config as DataSourceOptions);
