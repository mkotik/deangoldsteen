// redux/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import yourSlice from "./slices/yourSlice"; // Import your slice

const rootReducer = combineReducers({
  yourSlice,
});

export default rootReducer;
