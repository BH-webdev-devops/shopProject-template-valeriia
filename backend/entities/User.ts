// entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './Order';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({ type: "boolean", default: false })
  isAdmin!: boolean;

  @OneToMany(() => Order, (order: any) => order.user, { onDelete: "CASCADE" })
  orders: any | Order[];
}
