import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "@axios/axios";

export const markNotificationAsRead = createAsyncThunk(
    "notification/markNotificationAsRead",
    async ({ id, recipient, path = "mark-as-read" }, { rejectWithValue }) => {
        try {
            return await axios.put(`/notifications/${path}/${id}`, {
                recipient,
            });
        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk(
    "notification/markAllNotificationsAsRead",
    async ({ type, path = "mark-all-as-read" }, { rejectWithValue }) => {
        try {
            return await axios.post(`/notifications/${path}`, { type });
        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
);
