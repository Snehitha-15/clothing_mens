// src/Redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import jacketsReducer from "./jacketSlice";
import tshirtsReducer from "./tshirtsSlice";
import sweatersReducer from "./sweaterSlice";
import jeansReducer from "./jeansSlice";
import sweatshirtsReducer from "./sweatshirtSlice";
import wishlistReducer from "./wishlistSlice";
// import profileReducer from "./profileSlice";



const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  user: userReducer,
  jackets: jacketsReducer,
  tshirts: tshirtsReducer,
  sweaters: sweatersReducer,
  jeans: jeansReducer,
  sweatshirts: sweatshirtsReducer,
  wishlist: wishlistReducer, 
  // profile: profileReducer,
  

});

export default rootReducer;
