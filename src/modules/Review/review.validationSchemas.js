// modules imports
import Joi from "joi"
// files imports
import { generalValidationRule } from '../../utils/general.validation.rules.js';

// add review schema
export const addReviewSchema = {
    body: Joi.object({
        reviewRate: Joi.number().min(1).max(5).required(),
        reviewComment: Joi.string().min(5).max(255).optional()
    }),
    query: Joi.object({
        productId: generalValidationRule.dbId.required()
    }),
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    })
}


// delete review schema

export const deleteReviewSchema = {
    params: Joi.object({
        reviewId: generalValidationRule.dbId.required()
    }),
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    })
}

// get All Reviews For Specific Product validation schema

export const getAllReviewsForSpecificProductSchema = {
    query: Joi.object({
        productId: generalValidationRule.dbId.required()
    })
}