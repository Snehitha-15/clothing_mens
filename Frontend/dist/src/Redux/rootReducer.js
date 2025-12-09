// src/Redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
// import userReducer from "./userSlice";
import wishlistReducer from "./wishlistSlice";
import categoryReducer from "./categorySlice";
import productReducer from "./productSlice";
import profileReducer from "./profileSlice";
import bannerReducer from "./bannerSlice";
import addressReducer from "./addressSlice";
import checkoutReducer from "./checkoutSlice"
import myOrdersReducer from "./myOrderSlice";



const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer, 
  categories: categoryReducer,
  products: productReducer,
  profile: profileReducer,
  banners: bannerReducer,
  address: addressReducer,
  checkout:checkoutReducer,
  orders: myOrdersReducer, 

});

export default rootReducer;
