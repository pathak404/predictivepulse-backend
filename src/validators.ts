import Joi from "joi"

export const loginValidator = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required(),
})


export const orderValidator = Joi.object({
    email: Joi.string().email().lowercase().required(),
    phone: Joi.string().pattern(/^\d{10}$/).required(),
    name: Joi.string().pattern(new RegExp('^[a-zA-Z]{3,30}$')).required(),
})


export const createPasswordValidator = Joi.object({
    password: Joi.string().min(8).required(),
})


