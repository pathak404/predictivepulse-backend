import mongoose, { model, Schema } from "mongoose"
import bcrypt from "bcrypt"

const UserSchema: Schema = new Schema({
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

UserSchema.methods.createUserId = function(){
    this.userId = 'USR'+(new Date()).getTime()
}

UserSchema.methods.setPassword = function(password: string){
    this.password = bcrypt.hashSync(password, 10);
}

UserSchema.methods.verifyPassword = function(password: string){
    return bcrypt.compareSync(password, this.password);
}


const User = model('User', UserSchema)
export default User;