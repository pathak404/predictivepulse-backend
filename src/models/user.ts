import mongoose, { model, Schema } from "mongoose"
import bcrypt from "bcrypt"
import { UserDocument } from "../types"

const UserSchema: Schema<UserDocument> = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: false, 
    },
    passwordKey: {
        type: mongoose.Schema.Types.String,
        required: false,
    },
    validTill: {
        type: mongoose.Schema.Types.Number,
        required: false,
    },    
    createdAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
    }
})

UserSchema.pre<UserDocument>("validate", function(next){
    this.createUserId()
    next()
})

UserSchema.methods.createUserId = function(this:UserDocument){
    this.userId = 'USR'+(new Date()).getTime()
}

UserSchema.methods.setPassword = function(this:UserDocument, password: string){
    this.password = bcrypt.hashSync(password, 10);
}

UserSchema.methods.verifyPassword = function(this:UserDocument, password: string){
    return bcrypt.compareSync(password, this.password);
}

const User = model<UserDocument>('User', UserSchema)
export default User;