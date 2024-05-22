import { Router } from "express"
import { createPassword, login, verifyPasswordKey } from "./controllers/user"
import { requestValidator, verifyAuth } from "./utils"
import { createPasswordValidator, loginValidator, orderValidator } from "./validators"
import { createOrder, verifyPayment } from "./controllers/order"
import { assetData, assetPrediction } from "./controllers/asset"
import { generateNonce, validateNonce } from "./middlewares/nonce"

export const route = Router()


route.post("/login", requestValidator(loginValidator, "body"), validateNonce, login)
route.post("/create-password/:key", requestValidator(createPasswordValidator), validateNonce, createPassword)
route.get("/create-password/:key", verifyPasswordKey)


route.post("/order", requestValidator(orderValidator), validateNonce, createOrder)
route.get("/order/:paymentId", verifyPayment)

route.get("/asset/data/:symbol", verifyAuth, assetData)
route.get("/asset/prediction/:symbol", verifyAuth, assetPrediction)

route.get("/nonce", generateNonce);