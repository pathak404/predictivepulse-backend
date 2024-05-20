import { NextFunction, Request, Response } from "express"
import Joi from "joi"
import JWT from "jsonwebtoken"
import nodeMailer from "nodemailer"

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
    const isAuth = req.headers.authorization
    if(!isAuth) return res.sendResponse({ message: "Missing Authentication Token"}, 401)
    try{
        const token = isAuth.split(" ")[1];
        const authData = verifyJWT(token);
        req.userId = (authData as JWT.JwtPayload).userId
        next();
    }catch(error: any){
        res.sendResponse({message: "Invalid/Expired Authentication Token"}, 401)
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

const sendMail = async (name:string, email:string, subject:string, html: string) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            user: process.env.MAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD
        }
    })
    await transporter.sendMail({
        from: `PredictivePulse <${process.env.MAIL_ADDRESS}>`,
        to: `${name} <${email}>`,
        subject,
        html,
    })
}

const verifyNonce = (req: Request, res: Response, next: NextFunction) => {
    // if(req.headers['X-Nonce'] !== req.body.nonce){
    //     return res.sendResponse({message: "Nonce validation failed"}, 401);
    // }
    next();
}

const mojoAccessToken = async () => {
    const res = await fetch(process.env.MOJO_API_URL + '/oauth2/token/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            grant_type: 'client_credentials',
            client_id: process.env.MOJO_CLIENT_ID,
            client_secret: process.env.MOJO_CLIENT_SECRET
        })
    })
    const data = await res.json()
    if(!res.ok || data.error){
        throw new Error(data?.error || res.statusText || "mojoAccessToken: something went wrong")
    }
    return data.access_token
}


const mojoPaymentRequestId = async (payment_data: Record<string, any>) => {
    const access_token = await mojoAccessToken()
    const res = await fetch(process.env.MOJO_API_URL + '/v2/payment_requests/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+access_token,
            "Accept": "application/json",
        },
        body: JSON.stringify(payment_data)
    })
    const data = await res.json()
    if(!res.ok || data.message){
        throw new Error(data.message || res.statusText || "mojoPaymentRequestId: something went wrong")
    }
    return data.id
}


const mojoPaymentData = async (payment_id: string) => {
    const access_token = await mojoAccessToken()
    const res = await fetch(process.env.MOJO_API_URL + '/v2/payments/'+ payment_id, {
        method: "GET",
        headers: {
            "Authorization": "Bearer "+access_token,
            "Accept": "application/json",
        },
    })
    const data = await res.json()
    if(!res.ok || data.message){
        throw new Error(data.message || res.statusText || "mojoPaymentData: something went wrong")
    }
    return data
}


export { 
    sendResponseMiddleware, 
    requestValidator, 
    generateJWT, 
    verifyAuth, 
    mojoPaymentRequestId, 
    mojoPaymentData, 
    verifyNonce,
    sendMail,
}
