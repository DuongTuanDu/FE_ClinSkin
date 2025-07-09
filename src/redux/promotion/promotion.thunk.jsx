import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@axios/axios";
import { message } from "antd";

export const getListPromotion = createAsyncThunk(
  "promotion/getListPromotion",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.get(
        `/admin/promotions?page=${payload.page}&pageSize=${
          payload.pageSize
        }&startDate=${payload.startDate || ""}&endDate=${payload.endDate || ""}`
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createPromotion = createAsyncThunk(
  "promotion/createPromotion",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.post("/admin/promotions", payload);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePromotion = createAsyncThunk(
  "promotion/updatePromotion",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await axios.put(`/admin/promotions/${id}`, data);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePromotion = createAsyncThunk(
  "promotion/deletePromotion",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.delete(`/admin/promotions/${payload}`);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPromotionDetail = createAsyncThunk(
  "promotion/getPromotionDetail",
  async (id, { rejectWithValue }) => {
    try {
      return await axios.get(`/admin/promotions/${id}`);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
