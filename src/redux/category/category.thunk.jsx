import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@axios/axios";
import { message } from "antd";

export const createCategory = createAsyncThunk(
    "category/createCategory",
    async (payload, { rejectWithValue }) => {
        try {
            return await axios.post("/admin/categories", payload);
        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
);