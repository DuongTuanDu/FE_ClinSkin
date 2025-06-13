import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import { categoryApi } from "./category/category.query";
import { productApi } from "./product/product.query";
import { brandApi } from "./brand/brand.query";

export const store = configureStore({
  reducer: {
    ...reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(categoryApi.middleware)
    .concat(productApi.middleware)
    .concat(brandApi.middleware),

});
