// modules imports
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    reviewRate: {
        type: Number,
        required: true,
        min: 1,
        max: 5 
    },
    comment: {
        type: String
    }

}, {
    timestamps: true
});


export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);