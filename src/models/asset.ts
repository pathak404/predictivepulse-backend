import mongoose, { Schema } from "mongoose";
import { model } from "mongoose";
import { assetDocument } from "../types";

const assetSchema: Schema<assetDocument> = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    symbol: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
    },
    date: {
        type: mongoose.Schema.Types.Number,
        required: true,
    },
    type: {
        type: mongoose.Schema.Types.String,
        required: true,
    }
})

const Asset = model<assetDocument>("Asset", assetSchema)
export default Asset