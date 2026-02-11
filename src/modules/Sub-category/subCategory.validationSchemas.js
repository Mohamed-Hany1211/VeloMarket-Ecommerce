// modules imports 
import Joi from 'joi';
// files imports 
import { generalValidationRule } from '../../utils/general.validation.rules.js';

// add sub category schema
export const addSubCategorySchema = {
    body: Joi.object({
        name: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9 ]{2,30}$/)).min(2).required()
    }),
    params: Joi.object({
        categoryId: generalValidationRule.dbId.required()
    }),
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    })
}

// delete SubCategory schema 
export const deleteSubCategorySchema = {
    body: Joi.object({
        categoryId: generalValidationRule.dbId.required(),
        subCategoryId: generalValidationRule.dbId.required()
    })
}

// update sub category schema 
export const updateSubCategorySchema = {
    body: Joi.object({
        name: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9 ]{2,30}$/)).min(2).required(),
        oldPublicId: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\-]+$/))
    }),
    params: Joi.object({
        subCategoryId: generalValidationRule.dbId.required()
    }), authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    })
}

// get All SubCategories For Specific Category
export const getAllSubCategoriesForSpecificCategorySchema = {
    params: Joi.object({
        categoryId: generalValidationRule.dbId.required()
    })
}


// get SubCategory By Id
export const getSubCategoryByIdSchema = {
    params: Joi.object({
        subCategoryId: generalValidationRule.dbId.required()
    })
}

// get All SubCategories With Api Features schema
export const getAllSubCategoriesWithApiFeaturesSchema = {
    query: Joi.object({
        page: Joi.number(),
        size: Joi.number()
    })
}