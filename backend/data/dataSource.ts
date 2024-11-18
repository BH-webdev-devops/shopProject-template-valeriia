
import { DataSource } from 'typeorm'; 
import {User} from '../entities/User'
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";
import { OrderProduct } from "../entities/OrderProduct";
import 'dotenv/config'

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [User, Order, Product, OrderProduct],
  migrations: ['migrations/*.ts'],
});
