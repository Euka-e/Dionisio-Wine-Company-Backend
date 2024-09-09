import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderDetail } from 'src/modules/orders/entities/orderdetail.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { config as dotenvConfig } from 'dotenv';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { CartDetail } from 'src/modules/cart/entities/cartdetail.entity';
import { CartItem } from 'src/modules/cart/entities/cart.item.entity';
import { DiscountCode } from 'src/modules/offers/entities/discountCode.entity';

dotenvConfig({ path: '.env.development' });

const config = {
    type: 'postgres',
    name: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    entities: [User, Product, Order, OrderDetail, Category, Cart, CartDetail,CartItem, DiscountCode],
    migrations: ['dist/migrations/*{.ts,.js}'],
    autoLoadEntities: true,
    logging: ['error'],
    synchronize: true,
    dropSchema: true,
    dropDatabase: true
};
export const typeOrmConfig = registerAs('typeorm', () => config);
export const conectionSource = new DataSource(config as DataSourceOptions);
