import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth.slice";
import { categoryApi } from "./category/category.query";
import { productApi } from "./product/product.query";
import { brandApi } from "./brand/brand.query";
import { reviewApi } from "./review/review.query";
import { orderApi } from "./order/order.query";
import reducer from "./reducer";

export const store = configureStore({
  reducer: {
    ...reducer,
    auth: authReducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(categoryApi.middleware, reviewApi.middleware)
    .concat(productApi.middleware)
    .concat(brandApi.middleware).concat(orderApi.middleware),

});