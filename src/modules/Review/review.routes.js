import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as reviewController from './review.controller.js'
import {auth} from '../../middlewares/auth.middleware.js';
import {validationMiddleware} from '../../middlewares/validation.middleware.js';
import * as validator from './review.validationSchemas.js';
import {reviewApiesRules} from './review.endPoints.js';
const router = Router();




router.post(
    '/addReview',
    auth(reviewApiesRules.ADD_REVIEW),
    validationMiddleware(validator.addReviewSchema),
    expressAsyncHandler(reviewController.addReview)
);

router.delete('/deleteReview/:reviewId',auth(reviewApiesRules.ADD_REVIEW),validationMiddleware(validator.deleteReviewSchema),expressAsyncHandler(reviewController.deleteReview));

router.get('/getAllReviewsForSpecificProduct',validationMiddleware(validator.getAllReviewsForSpecificProductSchema),expressAsyncHandler(reviewController.getAllReviewsForSpecificProduct));





export default router;