// files imports
import Coupon from '../../../DB/models/coupon.model.js';
import CouponUsers from '../../../DB/models/coupon-users.model.js';
import User from '../../../DB/models/user.model.js';
import { applyCouponValidations } from '../../utils/coupon.validation.js';
import { ApiFeatures } from '../../utils/ApiFeatures/api-features.js';
import { DateTime } from 'luxon';

// ===================== add coupon ==================== //
/*
    1 - destructing coupon's info
    2 - destructing the id of the logged in user 
    3 - coupon code check
    4 - creat coupon object
    5 - save coupon in db
    6 - roll back the coupon document in case of any error occur
    7 - check if the user that we want to assign the coupon to is in the DB or not 
    8 - assign coupons to users
    9 - roll back the coupon users document in case of any error occur
    10 - return the response
*/
export const addCoupon = async (req, res, next) => {
    // 1 - destructing coupon's info
    const {
        couponCode,
        couponAmount,
        isFixed,
        isPercentage,
        fromDate,
        toDate,
        Users // [{userId,maxUsage}]
    } = req.body;
    // 2 - destructing the id of the logged in user 
    const { _id } = req.authUser;
    // 3 - coupon code check
    const isCouponCodeExist = await Coupon.findOne({ couponCode });
    if (isCouponCodeExist) return next({ message: 'Coupon code already exist', cause: 409 });
    if (isFixed == isPercentage) return next({ message: 'Coupon can be either fixed or percentage', cause: 409 });
    if (isPercentage) {
        if (couponAmount > 100) return next({ message: 'Percentage should be less than or equal to 100', cause: 409 });
    }
    // 4 - creat coupon object
    const couponObj = {
        addedBy: _id,
        couponCode,
        couponAmount,
        isFixed,
        isPercentage,
        fromDate,
        toDate
    }
    // 5 - save coupon in db
    const coupon = await Coupon.create(couponObj);
    // 6 - roll back the coupon document in case of any error occur
    req.savedDocuments = { model: Coupon, _id: coupon._id };
    // 7 - check if the user that we want to assign the coupon to is in the DB or not 
    const userIds = [];
    for (const user of Users) {
        userIds.push(user.userId);
    }
    const isUserExist = await User.find({ _id: { $in: userIds } });
    if (isUserExist.length != Users.length) return next({ message: 'Users not found', cause: 404 });
    // 8 - assign coupons to users
    const couponUsers = await CouponUsers.create(
        Users.map(ele => ({ couponId: coupon._id, ...ele }))
    )
    // 9 - roll back the coupon users document in case of any error occur
    req.savedDocuments = { model: CouponUsers, _id: couponUsers._id };
    // 10 - return the response
    res.status(201).json({ message: 'Coupon added successfully', coupon, couponUsers });
}

// ============================ validateCoupon ================== //
/*
    1 - destructing the coupon code
    2 - destructing userId
    3 - check if the coupon is valid
    4 - return the response
*/
export const ValidateCoupon = async (req, res, next) => {
    // 1 - destructing the coupon code
    const { couponCode } = req.body;
    // 2 - destructing userId
    const { _id } = req.authUser;
    // 3 - check if the coupon is valid
    const isCouponValid = await applyCouponValidations(couponCode, _id);
    if (isCouponValid.status) return next({ message: isCouponValid.message, cause: isCouponValid.status });
    // 4 - return the response
    return res.json({
        success: true,
        message: 'Coupon is valid',
        data: isCouponValid
    })
}



// =============================== Get coupon by id ============================== //
/*
    // 1 - destructing the coupon id from the params
    // 2 - get the coupon 
    // 3 - return the response
*/
export const getCouponById = async (req, res, next) => {
    // 1 - destructing the coupon id from the params
    const { copunId } = req.params;
    // 2 - get the coupon 
    const coupon = await Coupon.findById(copunId);
    if (!coupon) return next({ message: 'Coupon not found', cause: 404 });
    // 3 - return the response
    res.status(200).json({
        success: true,
        message: 'Coupon fetched successfully',
        data: coupon
    })

}

// ================================== get all coupons with api features ==================== //
/*
    // 1 - destructing the page and size from req.query
    // 2 - applying the api features to coupons
    // 3 - return the response
*/
export const getAllCouponsWithApiFeatures = async (req, res, next) => {
    // 1 - destructing the page and size from req.query
    const { page, size, sort, ...query } = req.query;
    // 2 - applying the api features to coupons
    const features = new ApiFeatures(req.query, Coupon.find())
        .pagination({ page, size })
        .sort(sort)
        .search(query)
        .filter(query)
    const coupons = await features.mongooseQuery;
    if (!coupons) return next({ message: 'An Error Occour While Fetching The Coupons', cause: 500 });
    // 3 - return the response
    return res.status(200).json({
        success: true,
        message: 'Coupons Fetched Successfully',
        data: coupons
    })
}

// =========================== disable and enable coupon =================== //
/*
    // 1 - destructing the id of the coupon creator
    // 2 - get the coupon by the id
    // 3 - disable or enable the coupon
    // 4 - save the updated coupon
    // 5 - return the response
*/
export const disableAndEnableCoupon = async (req,res,next) =>{
    // 1 - destructing the id of the coupon creator
    const {_id} = req.authUser;
    // 2 - get the coupon by the id
    const {couponId} = req.params;
    const coupon = await Coupon.findOne({ _id:couponId , addedBy:_id});
    if (!coupon) return next({ message: 'Coupon not found', cause: 404 });
    // 3 - disable or enable the coupon
    coupon.isCouponDisabled = !coupon.isCouponDisabled;
    // 4 - save the updated coupon
    await coupon.save();
    // 5 - return the response
    res.status(200).json({
        success: true,
        message: 'Coupon Disabled/Enabled Successfully',
        data: coupon
    })
} 


// ========================= get all disabled coupons ================== //
/*
    // 1 - get all disabled coupons
    // 2 - check if there is any disabled coupons
    // 3 - return the response
*/
export const getAllDisabledCoupons = async (req,res,next) =>{
    // 1 - get all disabled coupons
    const disabledCoupons = await Coupon.find({isCouponDisabled:true});
    // 2 - check if there is any disabled coupons
    if(!disabledCoupons.length){
        return next({message:'No Disabled Coupons Found',cause:404});
    }
    // 3 - return the response
    res.status(200).json({
        success: true,
        message: 'Disabled Coupons Fetched Successfully',
        data: disabledCoupons
    })
}

// ========================== Get all enabled coupons ==================== //
/*
    // 1 - get all enabled coupons
    // 2 - check if there is any enabled coupons
    // 3 - check if there is any enabled coupons
*/
export const getAllEnabledCoupons = async (req,res,next) =>{
    // 1 - get all enabled coupons
    const enabledCoupons = await Coupon.find({isCouponDisabled:false});
    // 2 - check if there is any enabled coupons
    if(!enabledCoupons.length) return next({message:'No Enabled Coupons Found',cause:404});
    // 3 - check if there is any enabled coupons
    res.status(200).json({
        success: true,
        message: 'Enabled Coupons Fetched Successfully',
        data: enabledCoupons
    })
}

// ====================== update coupon ====================== //
/*
    // 1 - destructing the coupon id from the params
    // 2 - destructing the user id from the authUser
    // 3 - destructing the coupon from the body
    // 4 - find the coupon by the id
    // 5 - check if the coupon is found
    // 6 - check if the coupon code is diffrent from the old one
    // 7 - check if the coupon amount is diffrent from the old one
    // 8 - check if the coupon is fixed is diffrent from the old one
    // 9 - check if the coupon is percentage is diffrent from the old one
*/
export const updateCoupon = async (req,res,next) =>{
    // destructing the coupon id from the params
    const {couponId} = req.params;
    // destructing the user id from the authUser
    const {_id} = req.authUser;
    // destructing the coupon from the body
    const {couponCode,couponAmount,isFixed,isPercentage,fromDate,toDate} = req.body;
    // find the coupon by the id
    const coupon = await Coupon.findOne({_id:couponId,addedBy:_id});
    // check if the coupon is found
    if(!coupon) return next({message:'Coupon Not Found',cause:404});
    // check if the coupon code is diffrent from the old one
    if(couponCode && couponCode !== coupon.couponCode){
        coupon.couponCode = couponCode;
    }else{
        return next({message:'Coupon Code Is The Same As The Old One',cause:400});
    } 
    // check if the coupon amount is diffrent from the old one
    if(couponAmount && couponAmount !== coupon.couponAmount){
        coupon.couponAmount = couponAmount;
    }else{
        return next({message:'Coupon Amount Is The Same As The Old One',cause:400});
    }
    // check if the coupon is fixed is diffrent from the old one
    if(isFixed){
        coupon.isFixed = isFixed;
    }
    // check if the coupon is percentage is diffrent from the old one
    if(isPercentage){
        coupon.isPercentage = isPercentage;
    }
    // check if the coupon from date is diffrent from the old one
    if(fromDate && fromDate !== coupon.fromDate && DateTime.fromISO(fromDate) >= DateTime.now()){
        coupon.fromDate = fromDate;
    }else{
        return next({message:'Coupon From Date Is The Same As The Old One Or Is Greater Than Or Equal To The To Date',cause:400});
    }
    // check if the coupon to date is diffrent from the old one
    if(toDate && toDate !== coupon.toDate && DateTime.fromISO(toDate) > DateTime.fromISO(coupon.fromDate && fromDate)){
        coupon.toDate = toDate;
    }else{
        return next({message:'Coupon To Date Is The Same As The Old One Or is less than or equal to the from date',cause:400});
    }
    // save the updated coupon
    await coupon.save();
    // return the response
    res.status(200).json({
        success: true,
        message:'Coupon Updated Successfully',
        data:coupon
    });
}
