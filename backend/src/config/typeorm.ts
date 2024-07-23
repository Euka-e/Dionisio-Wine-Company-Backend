import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { OrderDetail } from 'src/modules/orders/entities/orderDetail.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env.development' });

const config = {
    type: 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: [User, Product, Order, OrderDetail, Category],
    migrations: ['dist/migrations/*{.ts, .js}'],
    autoLoadEntities: true,
    logging: ["error"],
    synchronize: true,
    dropSchema: true
}
export const typeOrmConfig = registerAs('typeorm', () => config);
export const conectionSource = new DataSource(config as DataSourceOptions);