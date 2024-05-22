import express, { Express } from "express"
import dotEnv from "dotenv"
import { sendResponseMiddleware } from "./src/utils"
import mongoose from "mongoose"
import cors from "cors"
import { route } from "./src/routes"
import { crons } from "./src/crons"
dotEnv.config()
crons()

const app: Express = express()
const port = process.env.PORT

mongoose.connect(process.env.MONGODB_URL)
mongoose.connection.on("error", (error)=>{
    console.log(error)
    process.abort()
})

app.use(cors({
    origin: process.env.FRONTEND_URL,
    allowedHeaders: ["X-Nonce", "Authorization", "Content-Type"]
}))
app.use(express.json())
app.use(sendResponseMiddleware)
app.use(route)

app.listen(port, ()=>{
    console.log("running at port "+port)
    console.log(process.env.TZ)
})

