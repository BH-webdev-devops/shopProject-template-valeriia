import { Router} from "express";
import { registerUser, loginUser } from "../controllers/authController"
import { validateUserInput } from '../middleware/middleware'

const authRouter: Router = Router()

authRouter.post("/register", validateUserInput, registerUser)
authRouter.post("/login", loginUser)

export default authRouter