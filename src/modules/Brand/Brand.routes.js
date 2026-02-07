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

router.post('/addBrand',auth(endPointRoles.ADD_BRAND),multerMiddleWareHost({
    extinsions:allowedExtensions.image
}).single('image'),validationMiddleware(BrandValidationShemas.addBrand),asyncHandler(BrandController.addBrand));
router.delete('/deleteBrand/:brandId',auth(endPointRoles.ADD_BRAND),validationMiddleware(BrandValidationShemas.deleteBrand),asyncHandler(BrandController.deleteBrand));
router.get('/getAllBrands',asyncHandler(BrandController.getAllBrands));
router.get('/getAllBrandsWithApiFeatures',validationMiddleware(BrandValidationShemas.getAllBrandsWithApiFeatures),asyncHandler(BrandController.getAllBrandsWithApiFeatures));
router.put('/updateBrand',auth(endPointRoles.ADD_BRAND),multerMiddleWareHost({
    extinsions:allowedExtensions.image
}).single('image'),validationMiddleware(BrandValidationShemas.updateBrand),asyncHandler(BrandController.updateBrand));
export default router;