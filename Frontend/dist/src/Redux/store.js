import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Redux/rootReducer";

export const store = configureStore({
  reducer: rootReducer,
});

export default store;
