import Joi from "joi"
import {generalValidationRule} from '../../utils/general.validation.rules.js';


export const addReviewSchema = {
    body:Joi.object({
        reviewRate:Joi.number().min(1).max(5).required(),
        reviewComment:Joi.string().min(5).max(255).optional()
    }),
    query:Joi.object({
        productId:generalValidationRule.dbId.required()
    })
} 