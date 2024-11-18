import { Router} from "express";
import { getAllProducts, getProductByName, getProductByID } from "../controllers/productController"

const authRouter: Router = Router()

authRouter.get("/products", getAllProducts)
authRouter.post("/products/search/", getProductByName)
authRouter.get("/products/:id",  getProductByID)

export default authRouter