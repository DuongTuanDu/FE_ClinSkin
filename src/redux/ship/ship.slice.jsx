import { createSlice } from "@reduxjs/toolkit";
import { getDistrict, getProvince, getWard } from "./ship.thunk";

const initialState = {
    isLoading: false,
    error: {},
    provinces: [],
    districts: [],
    wards: [],
};

export const shipSlice = createSlice({
    name: "ship",
    initialState,
    reducers: {
        setProvince(state, action) {
            state.provinces = action.payload;
        },
        setDistrict(state, action) {
            state.districts = action.payload;
        },
        setWard(state, action) {
            state.wards = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            //Get Province
            .addCase(getProvince.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getProvince.fulfilled, (state, action) => {
                if (action.payload.message === "Success") {
                    state.isLoading = false;
                    state.provinces = action.payload.data;
                }
            })
            .addCase(getProvince.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            //Get District
            .addCase(getDistrict.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getDistrict.fulfilled, (state, action) => {
                if (action.payload.message === "Success") {
                    state.isLoading = false;
                    state.districts = action.payload.data;
                }
            })
            .addCase(getDistrict.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            //Get Ward
            .addCase(getWard.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getWard.fulfilled, (state, action) => {
                if (action.payload.message === "Success") {
                    state.isLoading = false;
                    state.wards = action.payload.data;
                }
            })
            .addCase(getWard.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});

export const { setDistrict, setProvince, setWard } = shipSlice.actions;
export default shipSlice.reducer;
