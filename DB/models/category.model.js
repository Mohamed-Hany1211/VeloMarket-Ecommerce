// modules imports
import mongoose from "mongoose";

const CategroySchema = new mongoose.Schema({
    name: {
        type: String, required: true, unique: true, trim: true
    },
    slug: {
        type: String, required: true, unique: true, trim: true
    },
    img: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true, unique: true },
    },
    folderId: {
        type: String, required: true, unique: true
    },
    addedBy: {   // superAdmin
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true 
    }, 
    updatedBy: {  // superAdmin
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }  

}, {
    timestamps: true,
    toJSON:{virtuals: true},
    toObject:{virtuals: true}
});

// virtual populate for subCategory model
CategroySchema.virtual('SubCategories',{
    ref:'subCategroies',
    localField: '_id',
    foreignField: 'categoryId'
})

// virtual populate for brands model
CategroySchema.virtual('Brands',{
    ref:'Brands',
    localField: '_id',
    foreignField: 'categoryId'
})

export default mongoose.models.Category || mongoose.model('Category', CategroySchema);