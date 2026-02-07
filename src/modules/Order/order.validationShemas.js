//modules imports
import Joi from 'joi'
// files imports 
import {generalValidationRule} from '../../utils/general.validation.rules.js';

// create order validation schema
export const createOrderSchema = {
    body:Joi.object({
        productId:generalValidationRule.dbId.required(),
        quantity:Joi.number().default(1).min(1),
        couponCode:Joi.string(),
        paymentMethod:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\- ]+$/)).required(),
        phoneNumber:Joi.string().pattern(new RegExp(/^\+(20|962|963|964|965|966|967|968|970|971|972|973|974|98)\d{6,12}$/)),
        address:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\- ]+$/)).required(),
        city:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\- ]+$/)),
        postalCode:Joi.string(),
        country:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\- ]+$/))
    })
}


// convert from cart to order schema 

export const convertFromCartToOrderSchema = {
    body:Joi.object({
        couponCode:Joi.string(),
        paymentMethod:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\- ]+$/)).required(),
        phoneNumber:Joi.string().pattern(new RegExp(/^\+(20|962|963|964|965|966|967|968|970|971|972|973|974|98)\d{6,12}$/)),
        address:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\- ]+$/)).required(),
        city:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\- ]+$/)),
        postalCode:Joi.string(),
        country:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\- ]+$/))
    })
}


// deliver order validation schema

export const deliverOrderSchema = {
    params:Joi.object({
        orderId:generalValidationRule.dbId.required()
    })
}