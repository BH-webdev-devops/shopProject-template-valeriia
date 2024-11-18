import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { OrderProduct } from "./OrderProduct";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  price!: number;

  @Column()
  description!: string;

  @Column({ nullable: true })
  image!: string;

  @ManyToOne(() => User, (user: any) => user.orders, { onDelete: "CASCADE" })
  user: any | User;

  @OneToMany(() => OrderProduct, (orderProduct: any) => orderProduct.products, { onDelete: "CASCADE" })
  OrderProduct: any | OrderProduct[];
}
