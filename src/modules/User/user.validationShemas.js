// modules imports
import Joi from "joi"
// files imports
import { generalValidationRule } from "../../utils/general.validation.rules.js"

// update user schema
export const updateUserSchema = {
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    }),
    body: Joi.object({
        newUserName: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9 ]{2,30}$/)).min(2).required(),
        newAge: Joi.number().min(18).max(100).required(),
        newPhoneNumbers: Joi.array().items(Joi.string().pattern(new RegExp(/^(\+?[1-9]\d{0,3})?[-.\s]?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/)).required()),
        newAddresses: Joi.array().items(Joi.string().required())
    })
}

// update password schema
export const updatePassword = {
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    }),
    body: Joi.object({
        newPassword: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>/?\\|\[\]]).{8,}$/)).required()
    })
}

// user Profile Soft Deletion
export const userProfileSoftDeletion = {
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    })
}

// get User Profile
export const getUserProfile = {
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    })
}

// delete User Profile

export const deleteUserProfile = {
    authUser: Joi.object({
        _id: generalValidationRule.dbId.required()
    })
}