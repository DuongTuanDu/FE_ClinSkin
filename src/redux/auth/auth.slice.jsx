import { createSlice } from "@reduxjs/toolkit";
import {
    getAccountAdmin,
    getAccountAdminDetail,
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
        address: {
            province: "",
            district: "",
            ward: "",
            detail: "",
        },
        googleId: "",
        createdAt: "",
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
    adminDetail: null,
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
        setUserInfo(state, action) {
            state.userInfo = action.payload;
        },
        setAdminInfo(state, action) {
            state.adminInfo = action.payload;
        },
        logoutAdmin(state, action) {
            remove("ACCESS_TOKEN_ADMIN");
            state.isAuthenticatedAdmin = false;
            state.adminInfo = {};
        },
    },
    extraReducers: (builder) => {
        builder
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
            })
            .addCase(getAccountAdminDetail.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getAccountAdminDetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.adminDetail = action.payload.data;
                state.error = {};
            })
            .addCase(getAccountAdminDetail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});
export const {
    setEmailVerify,
    logoutUser,
    setOpenModelAuth,
    setIsLoading,
    setIsAuthenticated,
    logoutAdmin,
    setUserInfo,
    setAdminInfo
} = authSlice.actions;
export default authSlice.reducer;
