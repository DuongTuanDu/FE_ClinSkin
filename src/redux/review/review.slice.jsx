import { createSlice } from "@reduxjs/toolkit";
import { createReview, getReviewList, getReviewProduct } from "./review.thunk";

const initialState = {
    isLoading: false,
    error: {},
    reviews: [],
    averageRating: "",
    rateDistribution: {},
    pagination: {
        page: 1,
        totalPage: 0,
        totalItems: 0,
        pageSize: 10,
    },
};
// Create review
export const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        setReview(state, action) {
            state.reviews = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            //Create review
            .addCase(createReview.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isLoading = false;
                }
            })
            .addCase(createReview.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            //Get review product detail
            .addCase(getReviewProduct.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getReviewProduct.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isLoading = false;
                    state.reviews = action.payload.data;
                    state.pagination = action.payload.pagination;
                    state.rateDistribution = action.payload.rateDistribution;
                    state.averageRating = action.payload.averageRating;
                }
            })
            .addCase(getReviewProduct.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            //Get review list admin
            .addCase(getReviewList.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getReviewList.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isLoading = false;
                    state.reviews = action.payload.data;
                    state.pagination = action.payload.pagination;
                }
            })
            .addCase(getReviewList.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});

export const { setReview } = reviewSlice.actions;
export default reviewSlice.reducer;
