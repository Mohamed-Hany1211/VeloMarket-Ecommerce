// modules imports
import { Router } from "express";
import asyncHandler from "express-async-handler";
// files imports 
import * as SubCategoryController from './subCategory.controller.js';
import { multerMiddleWareHost } from "../../middlewares/multer.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { allowedExtensions } from "../../utils/Allowed-extensions.js";
import { endPointRoles } from "./subCategory.endPoints.js";
import {validationMiddleware} from '../../middlewares/validation.middleware.js';
import * as validator from './subCategory.validationSchemas.js';

const router = Router();

router.post('/addSubCategory/:categoryId',auth(endPointRoles.ADD_CATEGORY),multerMiddleWareHost({
    extinsions:allowedExtensions.image
}).single('image'),validationMiddleware(validator.addSubCategorySchema),asyncHandler(SubCategoryController.addSubCategory));

router.delete('/deleteSubCategory',auth(endPointRoles.ADD_CATEGORY),validationMiddleware(validator.deleteSubCategorySchema),asyncHandler(SubCategoryController.deleteSubCategory));
router.get('/getAllSubCategoriesWithBrands',asyncHandler(SubCategoryController.getAllSubCategoriesWithBrands));
router.get('/getAllSubCategoriesForSpecificCategory/:categoryId',validationMiddleware(validator.getAllSubCategoriesForSpecificCategorySchema),asyncHandler(SubCategoryController.getAllSubCategoriesForSpecificCategory));
router.get('/getSubCategoryById/:subCategoryId',validationMiddleware(validator.getSubCategoryByIdSchema),asyncHandler(SubCategoryController.getSubCategoryById));
router.get('/getAllSubCategoriesWithApiFeatures',validationMiddleware(validator.getAllSubCategoriesWithApiFeaturesSchema),asyncHandler(SubCategoryController.getAllSubCategoriesWithApiFeatures));

router.put('/updateSubCategory/:subCategoryId',auth(endPointRoles.ADD_CATEGORY),multerMiddleWareHost({extinsions:allowedExtensions.image}).single('image'),validationMiddleware(validator.updateSubCategorySchema),asyncHandler(SubCategoryController.updateSubCategory));

export default router;