import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import { categoryApi } from "./category/category.query";

export const store = configureStore({
  reducer: {
    ...reducer,
    [categoryApi.reducerPath]: categoryApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(categoryApi.middleware),
});
