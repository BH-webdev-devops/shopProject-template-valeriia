import { Product } from '../entities/Product'
import { Repository } from 'typeorm'
import { Request, Response } from 'express';
import { AppDataSource } from '../data/dataSource';
import { Like } from "typeorm";

const productRepository: Repository<Product> = AppDataSource.getRepository(Product);

export const getAllProducts = async (req: Request, res: Response): Promise<any> => {
    try {
        const products = await productRepository.find()
        if (products.length < 1) {
            return res.json({ message: `No products found` })
        }
        return res.status(200).json(products)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: `Internal server error 🔴` })
    }
}

export const getProductByID = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Missing or invalid 'id' parameter" });
    }

    try {
        const productById = await productRepository.findOneBy({ id: parseInt(id) })
        if (!productById) {
            return res.json({ message: `No knight found` })
        }
        return res.status(200).json(productById)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: `Internal server error 🔴` })
    }
}


export const getProductByName = async (req : Request, res : Response) : Promise<any> => {
    const {name} = req.body

    if (!name) {
        return res.status(400).json({ error: "Missing or invalid 'name' parameter" });
    }

    try{
        const productByName = await productRepository.find({
            where: { name: Like(`%${name}%`) }
        });
        if (productByName.length === 0) {
            return res.status(404).json({ message: "No products found with the specified name" });
        }

        return res.status(200).json(productByName);
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: `Internal server error 🔴` })
    }
}
