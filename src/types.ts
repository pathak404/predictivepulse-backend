import { Document } from "mongoose";

export interface OrderDocument extends Document {
    orderId: string;
    user:{
        name: string;
        email: string;
        phone: number;
    };
    amount: number;
    paymentId: string;
    paymentRequestId: string;
    paymentStatus: string;
    createdAt: Date;
    createOrderId: () => void;
}


export interface UserDocument extends Document {
    userId: string;
    name: string;
    email: string;
    phone: number;
    password: string;
    passwordKey: string;
    validTill: number;
    createdAt: Date;
    createUserId: () => void;
    setPassword: () => void;
    verifyPassword: () =>void;
}