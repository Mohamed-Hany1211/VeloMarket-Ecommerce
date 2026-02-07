// modules imports
import Joi from "joi"
// files imports 
import { generalValidationRule } from '../../utils/general.validation.rules.js';

// add brand schema
export const addBrand = {
    body: Joi.object({
        name: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9 ]{2,30}$/)).min(2).required()
    }),
    query: Joi.object({
        categoryId: generalValidationRule.dbId.required(),
        subCategoryId: generalValidationRule.dbId.required()
    })
}


// delete brand schema

export const deleteBrand = {
    params: Joi.object({
        brandId: generalValidationRule.dbId.required()
    })
}


// update brand schema

export const updateBrand = {
    body: Joi.object({
        newName: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9 ]{2,30}$/)).min(2).required(),
        oldPublicId: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\-]+$/)).required(),
    }),
    query: Joi.object({
        brandId: generalValidationRule.dbId.required()
    })
}


export const getAllBrandsWithApiFeatures = {
    query:Joi.object({
        page:Joi.number(),
        size:Joi.number()
    })
}