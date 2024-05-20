import { Request, Response } from "express"
import User from "../models/user"
import { generateJWT } from "../utils"

export const createPassword = async (req: Request, res: Response) => {
    try{
        const password = req.body.password
        const key = req.params.key
        const user = await User.findOne({passwordKey:key});
        if(!user || user.validTill > Date.now()){
            throw new Error("Invalid/Expired link")
        }
        user.setPassword(password)
        user.passwordKey = ""
        user.validTill = 0
        await User.replaceOne({email:user.email}, user)
        res.sendResponse({
            message: "Password created successfully."
        })
    }catch(error: any){
        res.sendResponse({
            message: error.message
        }, 500)
    }
}

export const verifyPasswordKey = async (req: Request, res: Response) => {
    try{
        const key = req.params.key
        const user = await User.findOne({passwordKey:key});
        if(!user || user.validTill > Date.now()){
            throw new Error("Invalid/Expired link")
        }
        res.sendResponse({
            message: "Key verified successfully"
        })
    }catch(error: any){
        res.sendResponse({
            message: error.message
        }, 500)
    }
}


export const login = async (req: Request, res: Response) => {
    try{
        const {email, passowrd} = req.body
        const user = await User.findOne({email})
        if(!user || !user.verifyPassword(passowrd)){
            throw new Error("Invalid Email/Password")
        }
        const token = generateJWT({
            userId: user.userId
        })

        res.sendResponse({
            message: "Login Successfull",
            token,
        })
    }catch(error: any){
        res.sendResponse({message: error.message}, 500)
    }
}

