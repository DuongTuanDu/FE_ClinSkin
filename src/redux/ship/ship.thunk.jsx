import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_SHIP_URL;
const TOKEN = import.meta.env.VITE_APP_TOKEN_SHIP;
const SHOP_ID = import.meta.env.VITE_APP_SHOP_ID;

export const getProvince = createAsyncThunk(
    "ship/getProvince",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(API_URL + "/master-data/province", {
                headers: {
                    Token: TOKEN,
                },
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getDistrict = createAsyncThunk(
    "ship/getDistrict",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                API_URL + `/master-data/district?province_id=${payload}`,
                {
                    headers: {
                        Token: TOKEN,
                    },
                }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getWard = createAsyncThunk(
    "ship/getWard",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                API_URL + `/master-data/ward?district_id=${payload}`,
                {
                    headers: {
                        Token: TOKEN,
                    },
                }
            );
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
