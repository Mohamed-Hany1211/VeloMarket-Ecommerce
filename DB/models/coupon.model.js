import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    couponCode:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true
    },
    couponAmount:{
        type:Number,
        min:1
    },
    couponStatus:{
        type:String,
        enum:['valid','expired'],
        default:'valid'
    },
    isFixed:{
        type:Boolean,
        default:false
    },
    isPercentage:{
        type:Boolean,
        default:false
    },
    fromDate:{
        type:String
    },
    toDate:{
        type:String
    },
    addedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    updatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isCouponDisabled:{
        type:Boolean,
        default:false
    },
    disabledBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    disabledAt:{
        type:String
    },
    enabledBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    enabledAt:{
        type:String
    }
},{timestamps:true})



export default mongoose.models.Coupon || mongoose.model('Coupon',couponSchema);