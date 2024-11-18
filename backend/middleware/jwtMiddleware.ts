import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'


export const authenticateJWT = async (req :Request, res : Response, next : NextFunction) : Promise<Response | any> => {
    const token = req.headers.authorization?.split(' ')[1] 
    try{
        if(!token){
            return res.status(403).json({message: 'Forbiden access, token is missing'})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        console.log('decoded')
        if(!decoded){
            return res.status(403).json({message : `Forbiden access, token is not valid`})
        }
        (req as Request & {user : any}).user = decoded
        next()
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}
