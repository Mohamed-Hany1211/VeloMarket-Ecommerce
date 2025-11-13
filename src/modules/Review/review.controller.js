// files imports
import Order from '../../../DB/models/order.model.js';
import Review from '../../../DB/models/review.model.js';
import Product from '../../../DB/models/product.model.js';

// ================================= add review ================================= //
/*
    // 1 - destructing the id of the logged in user
    // 2 - destructing the product id from the query
    // 3 - check if the user is authorized to make a review on this product
    // 4 - check if we found the required product 
    // 5 - destructing the review rate and comment 
    // 6 - create the review object
    // 7 - review document creation in the DB
    // 8 - save the document for roll back in case of any errors 
    // 9 - find the product to change it's rate 
    // 10 - find all reviews to calculate the overall rate of the product  
    // 11 - sum all the rates
    // 12 - calculate the overall rate of the product (average rate) then assign it to the product rate
    // 13 - save the new product rate 
    // 14 - return the response
*/
export const addReview = async (req,res,next)=>{
    // 1 - destructing the id of the logged in user
    const {_id} = req.authUser;
    // 2 - destructing the product id from the query
    const {productId} = req.query;
    // 3 - check if the user is authorized to make a review on this product
    const isProductValidToBeReviewd = await Order.findOne({
        user:_id,
        'orderItems.product':productId,
        orderStatus:'Delivered'
    });
    // 4 - check if we found the required product 
    if(!isProductValidToBeReviewd){
        return next({message:'You Should Buy The Product First',cause:400})
    }
    // 5 - destructing the review rate and comment 
    const {reviewRate, reviewComment} = req.body;
    // 6 - create the review object
    const reviewObject = {
        userId:_id,
        productId,
        reviewRate, 
        comment:reviewComment
    }
    // 7 - review document creation in the DB
    const reviewDB = await Review.create(reviewObject);
    // 8 - save the document for roll back in case of any errors 
    req.savedDocuments = { model: Review , _id: reviewDB._id };
    if(!reviewDB){
        return next({message:'Fail To Add Review',cause:500});
    }
    // 9 - find the product to change it's rate 
    const producut = await Product.findById(productId);
    // 10 - find all reviews to calculate the overall rate of the product  
    const reviews = await Review.find({productId});
    // 11 - sum all the rates
    let sumOfRates = 0;
    for(const review of reviews){

        sumOfRates+=review.reviewRate;
    }
    // 12 - calculate the overall rate of the product (average rate) then assign it to the product rate
    producut.rate = Number(sumOfRates/reviews.length).toFixed(2);
    // 13 - save the new product rate 
    await producut.save();
    // 14 - return the response
    res.status(201).json({
        success:true,
        message:'Review Created successfully',
        data:reviewDB
    })
}


