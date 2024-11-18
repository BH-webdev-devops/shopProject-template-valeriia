import { Order } from '../entities/Order'
import { Product } from '../entities/Product'
import { OrderProduct} from '../entities/OrderProduct'
import { getProfile } from '../services/userProfile'
import { User } from "../entities/User";
import { Repository } from 'typeorm'
import { Request, Response } from 'express';
import { AppDataSource } from '../data/dataSource';


interface Item {
    product: Product
    count : number;
}


const orderRepository: Repository<Order> = AppDataSource.getRepository(Order);
const orderProductRepository: Repository<OrderProduct> = AppDataSource.getRepository(OrderProduct);

export const getAllOrders = async (req: Request, res: Response): Promise<any> => {
    try {
        const orders = await orderRepository.find()
        if (orders.length < 1) {
            return res.json({ message: `No orders found` })
        }
        var ordersInfo: any[] = []

        for (const record of orders) {
            const item = await getOrderInfo(record.id);  
            ordersInfo.push(item); 
        }

        return res.status(200).json(ordersInfo)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: `Internal server error 🔴` })
    }
}

export const getUserOrders = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as Request & { user: any }).user.id
        const orders = await orderRepository.findBy({user: { id: userId }})
        if (orders.length < 1) {
            return res.json({ message: `No orders found` })
        }
        var ordersInfo: any[] = []

        for (const record of orders) {
            const item = await getOrderInfo(record.id);  
            ordersInfo.push(item); 
        }

        return res.status(200).json(ordersInfo)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: `Internal server error 🔴` })
    }
}

export const getOrderById = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as Request & { user: any }).user.id
        const {id}  = req.params

        if (!id || isNaN(Number(id)) || typeof(id) == undefined) {
            return res.status(400).json({ error: "Missing or invalid 'id' parameter" });
        }

        const orderByID = await orderRepository.find({where : {id: parseInt(id)}})
        if (orderByID.length < 1) {
            return res.json({ message: `No order found` })
        }

        return res.status(200).json(await getOrderInfo(orderByID[0].id))
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: `Internal server error 🔴` })
    }
}


export const addOrder = async (req: Request, res: Response): Promise<any> => {
    const { userId, items} = req.body
    try {
        const currentDate = new Date();
        const newOrder = await orderRepository.create({ user: userId, status: "CREATED", creationDate: currentDate })
        const savedOrder = await orderRepository.save(newOrder)

        const insertedProducts = items.map(async (item: Item) => {
            const orderItem = await orderProductRepository.create({order: savedOrder.id, product: item.product.id, count : item.count})
            await orderProductRepository.save(orderItem)
        });
        return res.status(201).json("Order created")
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ error: `Internal server error 🔴` })
    }
}

export const updateOrderProducts = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params
    const { items} = req.body
    try {
        const orderByID = await orderRepository.findOneBy({ id: parseInt(id) })
        if (!orderByID) {
            return res.json({ message: `No Order found` })
        }
        await orderProductRepository.delete({order : orderByID.id})
        const insertedProducts = items.map(async (item: Item) => {
            const orderItem = await orderProductRepository.create({order: orderByID.id, product: item.product.id, count : item.count})
            await orderProductRepository.save(orderItem)
        });
        return res.status(200).json('Order Updated')
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: `Internal server error 🔴` })
    }
}

export const updateOrderStatus = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params
    const { status} = req.body

    try {
        const orderByID = await orderRepository.findOneBy({ id: parseInt(id) })
        if (!orderByID) {
            return res.json({ message: `No Order found` })
        }
        orderByID.status = status ?? orderByID.status
        const savedOrder = await orderRepository.save(orderByID)
        return res.status(200).json("Status updated")
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: `Internal server error 🔴` })
    }
}


export const deleteOrder = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params
    try {
        const deleteOrderByID = await orderRepository.delete({id : parseInt(id)})
        if (deleteOrderByID.affected != 1) {
            return res.json({ message: `No Order found` })
        }
        return res.status(200).json(`Order deleted`)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: `Internal server error 🔴` })
    }
}

const getOrderInfo = async (idOrder: number): Promise<{ id: number; status: string; total: number, items: any[] }> => {

    const orderByID = await orderRepository.find({where : {id: idOrder}})
    const items : Item[] = []
    const getItems = await orderProductRepository.find({
        where: { order: { id: orderByID[0].id }},
        relations: ['product']
    });
    var total : number = 0 
    getItems?.map((item: OrderProduct) => {
        total = total + (item.count * item.product.price)
        items.push({product: item.product, count: item.count})
        return true;
    });

    return {id: orderByID[0].id, status: orderByID[0].status,total: total , items: items}
}