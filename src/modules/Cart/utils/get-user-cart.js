// files imports
import Cart from '../../../../DB/models/cart.model.js';

export const getUserCart = async (userId) =>{
    const userCart = await Cart.findOne({userId});
    if(!userCart) return null;
    return userCart;
}