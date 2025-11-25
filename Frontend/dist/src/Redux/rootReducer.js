// src/Redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import wishlistReducer from "./wishlistSlice";
import categoryReducer from "./categorySlice";
import productReducer from "./productSlice";
// import profileReducer from "./profileSlice";



const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  user: userReducer,
  wishlist: wishlistReducer, 
  categories: categoryReducer,
  products: productReducer,
  // profile: profileReducer,
  

});

export default rootReducer;
