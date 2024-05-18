import { NextFunction, Request, Response } from "express"
import Joi from "joi"
import JWT from "jsonwebtoken"

const sendResponseMiddleware = (_req: Request, res: Response, next: NextFunction)=> {
    res.sendResponse = (data: Record<string, any>, statusCode:number = 200) => {
        res.status(statusCode).json({
            status: statusCode >= 200 && statusCode <= 299 ? true : false,
            ...data,
        })
    }
    next();
}

const requestValidator = (schema: Joi.ObjectSchema<any>, type: "params"|"query"|"body" = "body") => {
    return (req: Request, res: Response, next: NextFunction) =>{
        const {error} = schema.validate(req[type])
        if(error){
            return res.sendResponse({
                message: error.details[0].message
            }, 400)
        }
        next();
    }
}

const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
    try{
        const isAuth = req.headers.authorization
        if(isAuth){
            const token = isAuth.split(" ")[1];
            const authData = verifyJWT(token);
            if(authData){
                req.userId = (authData as JWT.JwtPayload).userId
                next();
            }else{
                res.sendResponse({message: "Authentication failed"}, 401)
            }
        }else{
            res.sendResponse({message: "Missing Authentication header"}, 401)
        }
    }catch(error: any){
        res.sendResponse({message: error.message}, 500)
    }

}

const generateJWT = (payload: any, expires: number = 86400) => {
    return JWT.sign(payload, process.env.SECRET_KEYPHRASE, {
        expiresIn: expires
    })
}

const verifyJWT = (token: string) => {
    return JWT.verify(token, process.env.SECRET_KEYPHRASE)
}

export { sendResponseMiddleware, requestValidator, generateJWT, verifyAuth }
