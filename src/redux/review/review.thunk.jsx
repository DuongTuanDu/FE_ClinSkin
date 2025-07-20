import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@axios/axios";
import { message } from "antd";

export const updateReview = createAsyncThunk(
    "review/updateReview",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await axios.put(
                `/admin/reviews/${id}`, payload
            );
            return res;
        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteReview = createAsyncThunk(
    "review/deleteReview",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.delete(
                `/admin/reviews/${id}`
            );
            return res;
        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
);
