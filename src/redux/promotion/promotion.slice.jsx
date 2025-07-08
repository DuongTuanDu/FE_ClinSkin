import { createSlice } from "@reduxjs/toolkit";
import { getListPromotion, getPromotionDetail } from "./promotion.thunk";

const initialState = {
  promotions: [],
  isLoading: false,
  error: {},
  pagination: {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPage: 0,
  },
  promotion: {},
};

export const promotionSlice = createSlice({
  name: "promotion",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Get promotion list admin
      .addCase(getListPromotion.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getListPromotion.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.promotions = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getListPromotion.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      //Get promotion detail admin
      .addCase(getPromotionDetail.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getPromotionDetail.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.isLoading = false;
          state.promotion = action.payload.data;
        }
      })
      .addCase(getPromotionDetail.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { } = promotionSlice.actions;
export default promotionSlice.reducer;
