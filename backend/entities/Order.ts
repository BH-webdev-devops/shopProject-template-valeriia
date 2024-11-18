import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { User } from "./User";
import { OrderProduct } from "./OrderProduct";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @ManyToOne(() => User, (user: any) => user.orders, { onDelete: "CASCADE" })
  user: any | User;

  @OneToMany(() => OrderProduct, (orderProduct: any) => orderProduct.products, { onDelete: "CASCADE" })
  OrderProduct: any | OrderProduct[];

  @Column()
  status!: string;

  @Column()
  creationDate!: Date;
}
