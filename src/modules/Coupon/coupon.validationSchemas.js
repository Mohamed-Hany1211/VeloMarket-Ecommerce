// modules imports
import Joi from "joi"
// files imports
import { generalValidationRule } from "../../utils/general.validation.rules.js"

// add coupon validation schema
export const addCouponSchema = {
    body: Joi.object({
        couponCode: Joi.string().required(),
        couponAmount: Joi.number().required().min(1),
        isFixed: Joi.boolean(),
        isPercentage: Joi.boolean(),
        fromDate: Joi.date().greater(Date.now() - (24 * 60 * 60 * 1000)).required(),
        toDate: Joi.date().greater(Joi.ref('fromDate')).required(),
        Users: Joi.array().items(Joi.object({
            userId: generalValidationRule.dbId.required(),
            maxUsage: Joi.number().required().min(1)
        }))
    }),
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    })
}


// update coupon validation schema
export const updateCouponSchema = {
    body: Joi.object({
        couponCode: Joi.string(),
        couponAmount: Joi.number().min(1),
        isFixed: Joi.boolean(),
        isPercentage: Joi.boolean(),
        Users: Joi.array().items(Joi.object({
            userId: generalValidationRule.dbId.required(),
            maxUsage: Joi.number().required().min(1)
        }))
    }),
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    })
}

// validate coupon schema 
export const ValidateCouponSchema = {
    body: Joi.object({
        couponCode: Joi.string().required()
    }),
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    })
}

// get coupon by id 
export const getCouponByIdSchema = {
    params: Joi.object({
        couponId: generalValidationRule.dbId.required()
    })
}

// get All Coupons With Api Features

export const getAllCouponsWithApiFeaturesSchema = {
    query: Joi.object({
        page: Joi.number(),
        size: Joi.number()
    })
}
// disable and enable coupon 
export const disableAndEnableCoupon = {
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    }),
    params: Joi.object({
        couponId: generalValidationRule.dbId.required()
    })
}





