import { Router } from "express"
import { createPassword, login, verifyPasswordKey } from "./controllers/user"
import { requestValidator } from "./utils"
import { createPasswordValidator, loginValidator, orderValidator } from "./validators"
import { createOrder, verifyPayment } from "./controllers/order"

const route = Router()


route.post("/login", requestValidator(loginValidator, "body"), login)
route.post("/create-password/:key", requestValidator(createPasswordValidator), createPassword)
route.get("/create-password/:key", verifyPasswordKey)


route.post("/order", requestValidator(orderValidator), createOrder)
route.get("/order/:paymentId", verifyPayment)


