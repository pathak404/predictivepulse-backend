import express, { Express } from "express"
import dotEnv from "dotenv"
import { sendResponseMiddleware } from "./src/utils"
import mongoose from "mongoose"
dotEnv.config()

const app: Express = express()
const port = process.env.PORT

mongoose.connect(process.env.MONGODB_URL)
mongoose.connection.on("error", (error)=>{
    console.log(error)
    process.abort()
})

app.use(express.json())
app.use(sendResponseMiddleware)


app.listen(port, ()=>{
    console.log("running at port "+port)
})

