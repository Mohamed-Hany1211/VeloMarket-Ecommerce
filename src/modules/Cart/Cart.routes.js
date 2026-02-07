// modules imports
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
// files imports
import * as cartController from './Cart.controller.js';
import {auth} from '../../middlewares/auth.middleware.js';
import { systemRoles } from "../../utils/system-roles.js";
import {validationMiddleware} from '../../middlewares/validation.middleware.js';
import * as cartValidationSchemas from './Cart.validationShemas.js';
const router = Router();

router.post('/addProductToCart',auth([systemRoles.USER]),validationMiddleware(cartValidationSchemas.addProductToCartSchema),expressAsyncHandler(cartController.addProductToCart));

router.put('/removeFromCart/:productId',auth([systemRoles.USER]),validationMiddleware(cartValidationSchemas.removeFromCartSchema),expressAsyncHandler(cartController.removeFromCart))





export default router;