import { createSlice } from "@reduxjs/toolkit";
import {
    loginUser,
    registerUser,
    resetPassword,
    sendOtp,
    verifyAccount,
} from "./auth.thunk";
import { remove } from "@storage/storage";

const initialState = {
    userInfo: {
        _id: "",
        name: "",
        email: "",
        phone: "",
        avatar: {
            url: "",
            publicId: "",
        },
        googleId: "",
    },
    isLoading: false,
    error: {},
    isAuthenticated: false,
    isAuthenticatedAdmin: false,
    emailVerify: "",
    openModelAuth: false,
};

export const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setIsLoading(state, action) {
            state.isLoading = action.payload;
        },
        setIsAuthenticated(state, action) {
            state.isAuthenticated = action.payload;
        },
        setOpenModelAuth(state, action) {
            state.openModelAuth = action.payload;
        },
        setEmailVerify(state, action) {
            state.emailVerify = action.payload;
        },
        logoutUser(state, action) {
            remove("ACCESS_TOKEN");
            remove("cart");
            state.isAuthenticated = false;
            state.userInfo = {};
            window.location.reload();
        }
    },
    extraReducers: (builder) => {
        builder
            //Login Customer
            .addCase(loginUser.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isLoading = false;
                    state.userInfo = action.payload.user;
                    state.isAuthenticated = true;
                    state.error = {};
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            //Register Customer
            .addCase(registerUser.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isLoading = false;
                    state.error = {};
                }
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            //Send Otp
            .addCase(sendOtp.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(sendOtp.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isLoading = false;
                    state.error = {};
                }
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            //Verify Otp
            .addCase(verifyAccount.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(verifyAccount.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isLoading = false;
                    state.error = {};
                }
            })
            .addCase(verifyAccount.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })
            //Reset Password
            .addCase(resetPassword.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isLoading = false;
                    state.error = {};
                }
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })
    },
});
export const {
    setEmailVerify,
    logoutUser,
    setOpenModelAuth,
    setIsLoading,
    setIsAuthenticated,
} = authSlice.actions;
export default authSlice.reducer;
