// modules imports
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
// files imports
import * as orderController from './order.controller.js';
import {auth} from '../../middlewares/auth.middleware.js';
import { systemRoles } from "../../utils/system-roles.js";
import {validationMiddleware} from '../../middlewares/validation.middleware.js';
import * as validator from './order.validationShemas.js';
const router = Router();

router.post('/createOrder',auth(systemRoles.USER),validationMiddleware(validator.createOrderSchema),expressAsyncHandler(orderController.createOrder));

router.post('/convertFromCartToOrder',auth(systemRoles.USER),validationMiddleware(validator.convertFromCartToOrderSchema),expressAsyncHandler(orderController.convertFromCartToOrder));

router.put('/deliverOrder/:orderId',auth(systemRoles.DELIEVERY_ROLE),validationMiddleware(validator.deliverOrderSchema),expressAsyncHandler(orderController.deliverOrder));

router.post('/stripePay/:orderId',auth([systemRoles.USER]),validationMiddleware(validator.deliverOrderSchema),expressAsyncHandler(orderController.payWithStripe));

router.post('/webhook',expressAsyncHandler(orderController.stripeWebhookLocal));

router.post('/refundOrder/:orderId',auth([systemRoles.ADMIN,systemRoles.SUPER_ADMIN]),validationMiddleware(validator.deliverOrderSchema),expressAsyncHandler(orderController.refundOrder));

export default router;
