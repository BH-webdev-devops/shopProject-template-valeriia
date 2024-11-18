import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, (order: any) => order.OrderProduct, { onDelete: "CASCADE" })
  order: any | Order;

  @ManyToOne(() => Product, (product: any) => product.OrderProduct, { onDelete: "CASCADE" })
  product: any | Product;

  @Column()
  count!: number;
}
