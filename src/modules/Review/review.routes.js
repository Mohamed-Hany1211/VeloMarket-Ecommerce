import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as reviewController from './review.controller.js'
import {auth} from '../../middlewares/auth.middleware.js';
import {validationMiddleware} from '../../middlewares/validation.middleware.js';
import {addReviewSchema} from './review.validationSchemas.js'
import {reviewApiesRules} from './review.endPoints.js';
const router = Router();




router.post(
    '/addReview',
    auth(reviewApiesRules.ADD_REVIEW),
    validationMiddleware(addReviewSchema),
    expressAsyncHandler(reviewController.addReview)
);

router.delete('/deleteReview/:reviewId',auth(reviewApiesRules.ADD_REVIEW),expressAsyncHandler(reviewController.deleteReview));

router.get('/getAllReviewsForSpecificProduct',expressAsyncHandler(reviewController.getAllReviewsForSpecificProduct));





export default router;