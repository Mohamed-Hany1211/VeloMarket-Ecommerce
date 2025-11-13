// modules imports
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
// files imports
import { auth } from "../../middlewares/auth.middleware.js";
import * as couponController from'./coupon.controller.js';
import {endpointsRoles} from './coupon.endPoints.js';
import {validationMiddleware} from '../../middlewares/validation.middleware.js';
import * as validator from './coupon.validationSchemas.js';
const router = Router();

router.post('/addCoupon',auth(endpointsRoles.ADD_COUPON),validationMiddleware(validator.addCouponSchema),expressAsyncHandler(couponController.addCoupon));

router.post('/validateCoupon',auth(endpointsRoles.ADD_COUPON),expressAsyncHandler(couponController.ValidateCoupon));
router.get('/getCouponById/:copunId',expressAsyncHandler(couponController.getCouponById));
router.get('/getAllCouponsWithApiFeatures',expressAsyncHandler(couponController.getAllCouponsWithApiFeatures));
router.get('/getAllDisabledCoupons',expressAsyncHandler(couponController.getAllDisabledCoupons));
router.get('/getAllEnabledCoupons',expressAsyncHandler(couponController.getAllEnabledCoupons));
router.patch('/disableAndEnableCoupon/:couponId',auth(endpointsRoles.ADD_COUPON),expressAsyncHandler(couponController.disableAndEnableCoupon));
router.put('/updateCoupon/:couponId',auth(endpointsRoles.ADD_COUPON),validationMiddleware(validator.updateCouponSchema),expressAsyncHandler(couponController.updateCoupon));




export default router;