import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@axios/axios";
import { message } from "antd";

export const createProduct = createAsyncThunk(
    "product/createProduct",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post("/admin/product", payload);
            return response;
        } catch (error) {
            message.error(error.response.data.message || "Lỗi khi tạo sản phẩm");
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async ({ id, ...payload }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/admin/product/${id}`, payload);
            return response;
        } catch (error) {
            message.error(error.response.data.message || "Lỗi khi cập nhật sản phẩm");
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/admin/product/${id}`);
            message.success("Xóa sản phẩm thành công");
            return response;
        } catch (error) {
            message.error(error.response.data.message || "Lỗi khi xóa sản phẩm");
            return rejectWithValue(error.response.data);
        }
    }
);

export const restoreProduct = createAsyncThunk(
    "product/restoreProduct",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/admin/product/${id}/restore`);
            message.success("Khôi phục sản phẩm thành công");
            return response;
        } catch (error) {
            message.error(error.response.data.message || "Lỗi khi khôi phục sản phẩm");
            return rejectWithValue(error.response.data);
        }
    }
);
