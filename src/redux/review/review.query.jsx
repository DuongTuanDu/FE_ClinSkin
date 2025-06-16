import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: async (args, api, extraOptions) => {
    const { url, method, data, params } = args;
    return baseQuery({ url, method, data, params });
  },
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    getReviewList: builder.query({

      query: ({ page = 1, pageSize = 10, content = "" }) => {
        const queryStrings = new URLSearchParams({
          page,
          pageSize,
          content,
        }).toString();
        return {
          url: `/admin/reviews/getReview?${queryStrings}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response.data,
      providesTags: ["Review"],
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/admin/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),

    toggleDisplay: builder.mutation({
      query: (id) => ({
        url: `/admin/reviews/${id}/toggle-display`,
        method: "PATCH",
      }),
      invalidatesTags: ["Review"],
    }),

    replyReview: builder.mutation({
      query: ({ id, reply }) => ({
        url: `/admin/reviews/${id}/reply`,
        method: "PUT",
        data: { reply },
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetReviewListQuery,
  useDeleteReviewMutation,
  useToggleDisplayMutation,
  useReplyReviewMutation,
} = reviewApi;
