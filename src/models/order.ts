import mongoose, { model, Schema } from "mongoose"


const UserSchema: Schema = new Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    phone: {
        type: mongoose.Schema.Types.Number,
        required: true,
    },
})


const OrderSchema: Schema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    orderId: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    user: {
        type: UserSchema,
        required: true,
    },
    amount: {
        type: mongoose.Schema.Types.Number,
        required: true,
    },
    paymentId: {
        type: mongoose.Schema.Types.String,
        required: false, 
    },
    paymentRequestId: {
        type: mongoose.Schema.Types.String,
        required: false,
    },
    paymentStatus: {
        type: mongoose.Schema.Types.String,
        required: false,
    },    
    createdAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
    }
})

OrderSchema.methods.createOrderId = function(){
    this.orderId = 'ODR'+(new Date()).getTime()
}

const Order = model('Order', OrderSchema)
export default Order;