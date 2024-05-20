import { Request, Response } from "express"
import Order from "../models/order"
import { OrderDocument } from "../types"
import { mojoPaymentData, mojoPaymentRequestId, sendMail } from "../utils"
import crypto from "node:crypto"
import User from "../models/user"
import mongoose from "mongoose"

export const createOrder = async (req: Request, res: Response) => {
    const {name, email, phone} = req.body
    const amt = 499

    try{
        const isPaid = await Order.findOne({'user.email':email}) as OrderDocument
        if(isPaid && isPaid.paymentStatus=="success"){
            return res.sendResponse({message: "You have already purchased this course. Please check mail for the password creation."}, 401)
        }

        const order = new Order({
            user: {
                name,
                email,
                phone
            },
            amount: amt,
            paymentStatus: "pending",
            createdAt: Date.now()
        })
        order.createOrderId();

        const payment_data = {
            purpose: order.orderId,
            amount: amt,
            buyer_name: name,
            email: email,
            phone: phone,
            send_email: false,
            allow_repeated_payments: false,
        }
        const paymentRequestId = await mojoPaymentRequestId(payment_data)
        order.paymentRequestId = paymentRequestId

        await Order.findOneAndUpdate({'user.email': email}, order, {upsert: true})
        res.sendResponse({message: "Order created successfully", payment_request_id: paymentRequestId }, 201)
    }catch(error: any){
        res.sendResponse({message: error.message}, 500)
    }
}


export const verifyPayment = async (req: Request, res: Response) => {
    const {paymentId} = req.params
    try{
        const paymentData = await mojoPaymentData(paymentId)
        if(paymentData.status === true){
            res.sendResponse({message: "Your payment was successfull"}, 200)
            afterPayment(paymentData)
        }else{
            res.sendResponse({message: "Your payment was unsuccessfull"}, 401)
        }
    }catch(error: any){
        res.sendResponse({message: error.message}, 500)
    }
}


const afterPayment = async (paymentData: Record<string, any>) => {
    try{
        const passwordKey = crypto.randomBytes(10).toString("hex")
        const validTill = Date.now() + (172800 * 1000)
        const passwordLink = process.env.FRONTEND_URL+'/create-password/'+passwordKey

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            name: paymentData.name,
            email: paymentData.email,
            passwordKey,
            validTill,
        })
        user.save();
        await Order.updateOne({'user.email': paymentData.email}, {paymentStatus: "success", paymentId: paymentData.id})

        const sub = "Thank you for your purchase."
        const html = `Hi <b> ${paymentData.name} </b>, <br> <br> 
        Your order has been placed successfully.  <br><br> 
        Thank you for the purchase. Please create your account password and login to access the Predecive Pulse Dashboard.<br><br> 
        Create your account password by visiting this page: <a href=${passwordLink}>${passwordLink}</a> <br><br> 
        If you have any doubt, feel free to ask by replying on this mail. <br><br> 
        Regards, <br> 
        Team Predective Pulse`;
        sendMail(paymentData.name, paymentData.email, sub, html);
    }catch(error: any){
        console.log(error.message)
    }
}

