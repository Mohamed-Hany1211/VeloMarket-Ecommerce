// modules imports
import { Router } from "express";
import asyncHandler from "express-async-handler";
// files imports 
import * as BrandController from './Brand.controller.js'
import { multerMiddleWareHost } from "../../middlewares/multer.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { allowedExtensions } from "../../utils/Allowed-extensions.js";
import { endPointRoles } from "./Brand.endPoints.js";
import {validationMiddleware} from '../../middlewares/validation.middleware.js';
import * as BrandValidationShemas from './Brand.validationSchema.js';
const router = Router();

router.post('/addBrand',validationMiddleware(BrandValidationShemas.addBrand),auth(endPointRoles.ADD_BRAND),multerMiddleWareHost({
    extinsions:allowedExtensions.image
}).single('image'),asyncHandler(BrandController.addBrand));
router.delete('/deleteBrand/:brandId',validationMiddleware(BrandValidationShemas.deleteBrand),auth(endPointRoles.ADD_BRAND),asyncHandler(BrandController.deleteBrand));
router.get('/getAllBrands',asyncHandler(BrandController.getAllBrands));
router.get('/getAllBrandsWithApiFeatures',asyncHandler(BrandController.getAllBrandsWithApiFeatures));
router.put('/updateBrand',validationMiddleware(BrandValidationShemas.updateBrand),auth(endPointRoles.ADD_BRAND),multerMiddleWareHost({
    extinsions:allowedExtensions.image
}).single('image'),asyncHandler(BrandController.updateBrand));
export default router;