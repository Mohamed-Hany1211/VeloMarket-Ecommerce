// modules imports
import { Router } from "express";
import asyncHandler from "express-async-handler";
// files imports
import * as AuthController from './auth.controller.js'
import * as AuthValidationSchemas from './auth.validationSchemas.js';
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {auth} from '../../middlewares/auth.middleware.js';
import { systemRoles } from "../../utils/system-roles.js";
const router = Router();



router.post('/signUp', validationMiddleware(AuthValidationSchemas.signUpSchema), asyncHandler(AuthController.signUp));
router.get('/verify-email', validationMiddleware(AuthValidationSchemas.verifyEmailSchema), asyncHandler(AuthController.verifyEmail));
router.post('/signIn', validationMiddleware(AuthValidationSchemas.signInSchema), asyncHandler(AuthController.signIn));

router.post('/forgetPassword', validationMiddleware(AuthValidationSchemas.forgetPasswordSchema),asyncHandler(AuthController.forgetPassword));
router.post('/resetPassword/:token',validationMiddleware(AuthValidationSchemas.resetPasswordSchema),asyncHandler(AuthController.resetPassword));

router.patch('/getNewAccessToken',auth([systemRoles.USER]),asyncHandler(AuthController.getNewAccessToken));



export default router;