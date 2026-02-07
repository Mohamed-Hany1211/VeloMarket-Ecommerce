// modules imports
import Joi from "joi"
// files imports
import {generalValidationRule} from '../../utils/general.validation.rules.js';


// add category validation schema
export const addCategorySchema = {
    body:Joi.object({
        name:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9 ]{2,30}$/)).min(2).required()
    })
}

// delete category validation schema
export const deleteCategorySchema = {
    params:Joi.object({
        categoryId:generalValidationRule.dbId.required()
    })
}

// update category validation schema
export const updateCategorySchema = {
    body:Joi.object({
        name:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9 ]{2,30}$/)).min(2).required(),
        oldPublicId: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\-]+$/)).required()
    }),
    params:Joi.object({
        categoryId:generalValidationRule.dbId.required()
    })
}


// get All Categories With Api Features

export const getAllCategoriesWithApiFeaturesSchema = {
    query:Joi.object({
        page:Joi.number(),
        size:Joi.number()
    })
}