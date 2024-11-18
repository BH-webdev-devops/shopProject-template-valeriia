import { AppDataSource } from "../data/dataSource";
import { getProfile } from '../services/userProfile'
import { Repository } from "typeorm";
import { User } from "../entities/User";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

const userRepository: Repository<User> = AppDataSource.getRepository(User);

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await userRepository.find({ relations: ["orders"] });
    if (users.length < 1) {
      return res.json({ message: "No users found" });
    }
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: `Internal server error 🔴` });
  }
};

export const getUserByID = async ( req: Request, res: Response): Promise<any> => {
  const userId = (req as Request & { user: any }).user.id
  const { id } = req.params;
  try {
    const profile: User  = await getProfile(userId)
    if (profile.isAdmin == false && id != userId){
      return res.status(403).json({message : `Function not available for your profile`})
    }
    const userByID = await userRepository.findOneBy({ id: parseInt(id) });
    if (!userByID) {
      return res.json({ message: `No user found` });
    }
    return res.status(200).json(userByID);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: `Internal server error 🔴` });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const userId = (req as Request & { user: any }).user.id
  const { name, email, newPassword } = req.body;
  try {
    const userByID = await userRepository.findOneBy({ id: parseInt(userId) });
    if (!userByID) {
      return res.json({ message: `No user found` });
    }

    userByID.name = name ?? userByID.name;
    userByID.email = email ?? userByID.email;

    if(newPassword){
        const salt = await bcrypt.genSalt(10)
        let updatedPassword = await bcrypt.hash(newPassword, salt)
        if(updatedPassword != userByID.password){
          userByID.password = updatedPassword
        }
    }
    
    const savedUser = await userRepository.save(userByID);

    return res.status(200).json("User updated successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: `Internal server error 🔴` });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const deleteUserByID = await userRepository.delete({ id: parseInt(id) });
    if (deleteUserByID.affected === 0) {
      return res.json({ message: `No user found` });
    }

    return res.status(200).json(`User deleted`);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: `Internal server error 🔴` });
  }
};
