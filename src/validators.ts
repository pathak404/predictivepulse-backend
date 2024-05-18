import Joi from "joi"

const loginValidator = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required(),
    nonce: Joi.string().required(),
})



const orderValidator = Joi.object({
    email: Joi.string().email().lowercase().required(),
    phone: Joi.number().min(10).max(10).required(),
    name: Joi.string().pattern(new RegExp('^[a-zA-z]{3, 30}$')).required(),
    nonce: Joi.string().required(),
})


const createPasswordValidator = Joi.object({
    password: Joi.string().min(8).required(),
    key: Joi.string().required(),
    nonce: Joi.string().required(),
})


