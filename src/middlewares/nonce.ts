import { NextFunction, Request, Response } from "express";
import crypto from "node:crypto"
import Nonce from "../models/nonce";
import mongoose from "mongoose";

export const generateNonce = (_req: Request, res: Response) => {
    const nonce = crypto.randomBytes(16).toString("hex")
    const validTill = Date.now()+600000
    const obj = new Nonce({
        _id: new mongoose.Types.ObjectId(),
        nonce,
        validTill,
    })
    obj.save()
    res.sendResponse({
        message: "Nonce generated successfully",
        nonce,
    })
}


export const validateNonce = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const nonce = req.headers['x-nonce']
        const isValid = await Nonce.findOne({nonce})
        if(!nonce){
            throw new Error("Missing X-Nonce header")
        }else if(!isValid || nonce!==isValid.nonce){
            throw new Error("Invalid nonce")
        }else if(isValid.validTill < Date.now()){
            Nonce.deleteOne({_id:isValid._id})
            throw new Error("The nonce has been expired")
        }
        next()
    }catch(error: any){
        res.sendResponse({
            message: error.message,
        }, 400)
    }
}


export const destroyNonce = async (req: Request) => {
    const nonce = req.headers['x-nonce'];
    await Nonce.findOneAndDelete({nonce})
}



export const removeExpiredNonces = async () => {
    try{
        await Nonce.deleteMany({
            validTill: {
                $lte: Date.now()
            }
        });
        console.log("CRON: Removed expired nonces")
    }catch(error: any){
        console.log("removeExpiredNonces: "+ error.message)
    }
}