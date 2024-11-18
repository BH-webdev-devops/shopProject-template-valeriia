import {Request, Response, NextFunction} from 'express'
import { User } from "../entities/User";
import { AppDataSource } from '../data/dataSource'

export const checkAdmin = async (req: Request, res: Response, next : NextFunction) : Promise<any> => {
    
    try {
        const id = (req as Request & { user: any }).user.id
        const userById = await AppDataSource.getRepository(User).findOneBy({id : parseInt(id)})
        if(!userById){
            return res.status(404).json({message : `No user found`})
        }
        else if (userById.isAdmin == false){
            return res.status(403).json({message : `Function not available for your profile`})
        }
        next()
    }   
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}