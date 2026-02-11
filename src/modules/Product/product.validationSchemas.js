// modules imports
import Joi from 'joi';
// files imports
import { generalValidationRule } from '../../utils/general.validation.rules.js';


// add product validation schema

export const addProductSchema = {
    body: Joi.object({
        title: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\- ]+$/)).required(),
        description: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\- ]+$/)).required(),
        basePrice: Joi.number().required(),
        discount: Joi.number().required(),
        stock: Joi.number().default(0).min(0).required(),
        specifications: Joi.string().required()
    }),
    query: Joi.object({
        brandId: generalValidationRule.dbId.required(),
        categoryId: generalValidationRule.dbId.required(),
        subCategoryId: generalValidationRule.dbId.required()
    })
}


// update product validation schema 

export const updateProductSchema = {
    body: Joi.object({
        title: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\- ]+$/)).required(),
        description: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\- ]+$/)).required(),
        basePrice: Joi.number().required(),
        discount: Joi.number().required(),
        stock: Joi.number().default(0).min(0).required(),
        specifications: Joi.string().required(),
        oldPublicId: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9\/\-]+$/)).required()
    }),
    params: Joi.object({
        productId: generalValidationRule.dbId.required()
    })
}

// get All Products With Api Features

export const getAllProductsWithApiFeaturesSchema = {
    query: Joi.object({
        page: Joi.number(),
        size: Joi.number()
    })
}

// delete product validation schema
export const deleteProductSchema = {
    body: Joi.object({
        productId: generalValidationRule.dbId.required()
    }),
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    })
}