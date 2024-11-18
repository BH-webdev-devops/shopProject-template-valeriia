import { Router} from "express";
import { getAllOrders, getOrderById, addOrder, updateOrderProducts, updateOrderStatus, deleteOrder } from "../controllers/orderController"
import { validateOrderRequest } from '../middleware/validatedOrder'
import { authenticateJWT } from '../middleware/jwtMiddleware'
import { checkAdmin } from '../middleware/checkAdmin'

const authRouter: Router = Router()

authRouter.get("/orders", authenticateJWT, checkAdmin, getAllOrders)
authRouter.get("/orders/:id", authenticateJWT, getOrderById)
authRouter.post("/orders",  authenticateJWT, validateOrderRequest, addOrder)
authRouter.put("/orders/:id",  authenticateJWT, validateOrderRequest, updateOrderProducts)
authRouter.put("/orders/:id/status",  authenticateJWT, updateOrderStatus)
authRouter.delete("/orders/:id",  authenticateJWT, deleteOrder)

export default authRouter