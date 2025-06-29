import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

const API_URL = import.meta.env.VITE_APP_API_SHIP_URL;
const TOKEN = import.meta.env.VITE_APP_TOKEN_SHIP;

export const shipApi = createApi({
    reducerPath: "shipApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, data, params } = args;
        return baseQuery({
            url, method, data, params, config: {
                headers: {
                    Token: TOKEN,
                },
            }
        });
    },
    endpoints: (builder) => ({
        getProvince: builder.query({
            query: () => ({
                url: API_URL + `/master-data/province`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
        getDistrict: builder.query({
            query: ({ payload }) => ({
                url: API_URL + `/master-data/district?province_id=${payload}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
        getWard: builder.query({
            query: ({ payload }) => ({
                url: API_URL + `/master-data/ward?district_id=${payload}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        })
    }),
});

export const {
    useGetProvinceQuery,
    useGetDistrictQuery,
    useGetWardQuery
} = shipApi;
