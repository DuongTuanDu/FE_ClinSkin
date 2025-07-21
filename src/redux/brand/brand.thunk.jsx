import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@axios/axios";
import { message } from "antd";
// get
export const getBrandByCreatePro = createAsyncThunk(
  "brand/getBrandByCreatePro",
  async (_, { rejectWithValue }) => {
    try {
      return await axios.get("/admin/brands");
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// get
export const getBrandList = createAsyncThunk(
  "brand/getBrandList",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.get(
        `/admin/brands?page=${payload.page}&pageSize=${payload.pageSize}&name=${payload.name || ""}`
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// get
export const getAllBrand = createAsyncThunk(
  "brand/getAllBrand",
  async (_, { rejectWithValue }) => {
    try {
      return await axios.get(`/brands`);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductByBrand = createAsyncThunk(
  "brand/getProductByBrand",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.get(
        `/products/brands/${payload.slug}?page=${payload.page}&pageSize=${payload.pageSize}&priceRange=${payload.priceRange}&sortOrder=${payload.sortOrder}&tags=${payload.tags}&categoriesList=${payload.categoriesList}`
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createBrand = createAsyncThunk(
  "brand/createBrand",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.post("/admin/brands", payload);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await axios.put(`/admin/brands/${id}`, payload);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "brand/deleteBrand",
  async (id, { rejectWithValue }) => {
    try {
      return await axios.delete(`/admin/brands/${id}`);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

