import mongoose, { model, Schema } from "mongoose";
import { nonceDocument } from "../types";


const nonceSchema:Schema<nonceDocument> = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nonce: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    validTill: {
        type: mongoose.Schema.Types.Number,
        required: true,
    },
})

const Nonce = model<nonceDocument>("Nonce", nonceSchema)
export default Nonce