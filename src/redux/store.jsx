import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth.slice";
import { categoryApi } from "./category/category.query";
import { reviewApi } from "./review/review.query";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(categoryApi.middleware, reviewApi.middleware),
});