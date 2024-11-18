// authController.ts
import { Request, Response } from 'express';
import { User } from '../entities/User';
import { Repository } from "typeorm";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data/dataSource';

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const userRepository = AppDataSource.getRepository(User);
  const existingUser = await userRepository.findOne({ where: { email } });

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User();
  newUser.name = name;
  newUser.email = email;
  newUser.password = hashedPassword;

  await userRepository.save(newUser);

  res.status(201).json({ message: 'User registered successfully.' });
};


export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });

  res.status(200).json({user : {
      name : user.name,
      isAdmin: user.isAdmin,
      id: user.id
  }, token})
};
