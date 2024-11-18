import express, { Request, Response, Router } from "express";
import { getUserOrders } from "../controllers/orderController"
import { authenticateJWT } from '../middleware/jwtMiddleware'
import {
  deleteUser,
  getAllUsers,
  getUserByID,
  updateUser,
} from "../controllers/userController";
import { checkAdmin } from "../middleware/checkAdmin";

const userRouter: Router = Router();

userRouter.get("/users", authenticateJWT, checkAdmin, getAllUsers);
userRouter.get("/users/orders", authenticateJWT, getUserOrders);
userRouter.get("/users/:id", authenticateJWT, getUserByID);
userRouter.put("/users/:id", authenticateJWT, updateUser);
userRouter.delete("/users/:id", authenticateJWT, deleteUser);


export default userRouter;
