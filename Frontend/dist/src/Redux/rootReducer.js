// src/Redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import shirtsReducer from "./shirtsSlice";
import pantsReducer from "./pantsSlice";
import jacketsReducer from "./jacketSlice";
import tshirtsReducer from "./tshirtsSlice";
import sweatersReducer from "./sweaterSlice";
import shortsReducer from "./shortsSlice";
import blazerReducer from "./blazerSlice";
import jeansReducer from "./jeansSlice";
import sweatshirtsReducer from "./sweatshirtSlice";
import suitsReducer from "./suitSlice"; 
// import profileReducer from "./profileSlice";



const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  user: userReducer,
  shirts: shirtsReducer,
  pants: pantsReducer,
  jackets: jacketsReducer,
  tshirts: tshirtsReducer,
  sweaters: sweatersReducer,
  shorts: shortsReducer,
  blazers: blazerReducer,
  jeans: jeansReducer,
  sweatshirts: sweatshirtsReducer,
  suits: suitsReducer, 
  // profile: profileReducer,
  

});

export default rootReducer;
