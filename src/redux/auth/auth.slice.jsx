import { createSlice } from "@reduxjs/toolkit";
import {
    getAccountAdmin,
    loginAdmin,
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
    adminInfo: {
        _id: "",
        name: "",
        username: "",
        role: "",
        avatar: {
            url: "",
            publicId: "",
        },
    },
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
        },
        logoutAdmin(state, action) {
            remove("ACCESS_TOKEN_ADMIN");
            state.isAuthenticatedAdmin = false;
            state.adminInfo = {};
        },
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

            //Login Admin
            .addCase(loginAdmin.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isLoading = false;
                    state.adminInfo = action.payload.data;
                    state.isAuthenticatedAdmin = true;
                    state.error = {};
                }
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            // Get Account Admin
            .addCase(getAccountAdmin.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getAccountAdmin.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isLoading = false;
                    state.adminInfo = action.payload.data;
                    state.isAuthenticatedAdmin = true;
                    state.error = {};
                }
            })
            .addCase(getAccountAdmin.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
                state.isAuthenticatedAdmin = false;
            });
    },
});
export const {
    setEmailVerify,
    logoutUser,
    setOpenModelAuth,
    setIsLoading,
    setIsAuthenticated,
    logoutAdmin
} = authSlice.actions;
export default authSlice.reducer;
