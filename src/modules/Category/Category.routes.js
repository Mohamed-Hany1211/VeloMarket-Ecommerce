// modules imports
import { Router } from "express";
import asyncHandler from "express-async-handler";
// files imports 
import * as CategoryController from './Category.controller.js';
import { multerMiddleWareHost } from "../../middlewares/multer.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { allowedExtensions } from "../../utils/Allowed-extensions.js";
import { endPointRoles } from "./Category.endPoints.js";
import {validationMiddleware} from '../../middlewares/validation.middleware.js';
import * as categoryValidationSchemas from './Category.validationSchemas.js';
const router = Router();

router.post('/addCategory',auth(endPointRoles.ADD_CATEGORY),multerMiddleWareHost({
    extinsions:allowedExtensions.image
}).single('image'),validationMiddleware(categoryValidationSchemas.addCategorySchema),asyncHandler(CategoryController.addCategory));

router.put('/updateCategory/:categoryId',auth(endPointRoles.ADD_CATEGORY),multerMiddleWareHost({
    extinsions:allowedExtensions.image
}).single('image'),validationMiddleware(categoryValidationSchemas.updateCategorySchema),asyncHandler(CategoryController.updateCategory));

router.delete('/deleteCategory/:categoryId',auth(endPointRoles.ADD_CATEGORY),validationMiddleware(categoryValidationSchemas.deleteCategorySchema),asyncHandler(CategoryController.deleteCategory))

router.get('/getAllCategories',asyncHandler(CategoryController.getAllCategories));
router.get('/getCategoryById/:categoryId',validationMiddleware(categoryValidationSchemas.deleteCategorySchema),asyncHandler(CategoryController.getCategoryById));
router.get('/getAllCategoriesWithApiFeatures',validationMiddleware(categoryValidationSchemas.getAllCategoriesWithApiFeaturesSchema),asyncHandler(CategoryController.getAllCategoriesWithApiFeatures));
router.get('/getAllCategoriesWithBrands',asyncHandler(CategoryController.getAllCategoriesWithBrands));

export default router;