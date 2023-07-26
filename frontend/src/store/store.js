// store/store.js
import { applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import entitiesReducer from "./reducers";
import { composeWithDevTools } from "@redux-devtools/extension";
const initialState = {}; // Initialize with an empty object

const store = configureStore({
  reducer: {
    users: entitiesReducer,
  },
});

export default store;
