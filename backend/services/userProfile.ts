
import { User } from "../entities/User";
import { AppDataSource } from '../data/dataSource'

export const getProfile = async (idUser: number): Promise<User> => {
    const predefined = new User();
    try {
        
        const userById = await AppDataSource.getRepository(User).findOneBy({id : idUser})
        if(!userById){
            return predefined
        }
        return userById
    }   
    catch (err) {
        console.log(err)
        return predefined
    }
}