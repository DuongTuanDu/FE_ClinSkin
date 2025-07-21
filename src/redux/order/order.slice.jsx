import { createSlice } from "@reduxjs/toolkit";
import {
  orderCod,
  getOrderDetail
} from "./order.thunk";

const initialState = {
  isLoading: false,
  error: {},
  order: {},
  orders: [],
  orderReturn: {},
  orderHistories: [],
  pagination: {
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItems: 0,
  },
  statusCounts: {
    pending: 0,
    processing: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
  },
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderReturn(state, action) {
      state.orderReturn = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      //Order Cod
      .addCase(orderCod.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(orderCod.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(orderCod.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      //Get order detail admin
      .addCase(getOrderDetail.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetail.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.order = action.payload.data;
        }
      })
      .addCase(getOrderDetail.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
  },
});

export const { setOrderReturn } = orderSlice.actions;
export default orderSlice.reducer;
