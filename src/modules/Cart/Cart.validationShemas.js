// modules imports 
import Joi from 'joi'
// files imports
import { generalValidationRule } from '../../utils/general.validation.rules.js'





// add product to cart schema

export const addProductToCartSchema = {
    body: Joi.object({
        productId: generalValidationRule.dbId.required(),
        quantity: Joi.number().default(1).min(1).required()
    }),
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    })
}

// remove product from cart 

export const removeFromCartSchema = {
    params: Joi.object({
        productId: generalValidationRule.dbId.required()
    }),
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    })
}