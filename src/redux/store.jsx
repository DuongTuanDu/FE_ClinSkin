import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth.slice";
import { categoryApi } from "./category/category.query";
import { productApi } from "./product/product.query";
import { brandApi } from "./brand/brand.query";
import { reviewApi } from "./review/review.query";
import { orderApi } from "./order/order.query";
import reducer from "./reducer";
import { inventoryBatchApi } from "./inventory/inventoryBatch.query";
import { productSearchApi } from "./product/productSearch.query";
import { userApi } from "./user/user.query";
import { shipApi } from "./ship/ship.query";
import { promotionApi } from "./promotion/promotion.query";
import { notificationApi } from "./notification/notification.query";


export const store = configureStore({
  reducer: {
    ...reducer,
    auth: authReducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [inventoryBatchApi.reducerPath]: inventoryBatchApi.reducer,
    [productSearchApi.reducerPath]: productSearchApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [shipApi.reducerPath]: shipApi.reducer,
    [promotionApi.reducerPath]: promotionApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      categoryApi.middleware,
      reviewApi.middleware,
      productApi.middleware,
      brandApi.middleware,
      orderApi.middleware,
      inventoryBatchApi.middleware,
      productSearchApi.middleware,
      userApi.middleware,
      shipApi.middleware,
      notificationApi.middleware,
      promotionApi.middleware
    )

});