import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: async (args, api, extraOptions) => {
    const { url, method, data, params } = args;
    return baseQuery({ url, method, data, params });
  },
  tagTypes: ["ChatConversation", "ChatMessages"],
  endpoints: (builder) => ({
    getMyConversation: builder.query({
      query: () => ({
        url: "/chat/conversations/me",
        method: "GET",
      }),
      transformResponse: (res) => res.data,
      providesTags: ["ChatConversation"],
    }),
    createConversation: builder.mutation({
      query: () => ({
        url: "/chat/conversations",
        method: "POST",
        data: {},
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["ChatConversation"],
    }),
    getMessages: builder.query({
      query: ({ conversationId, page = 1, limit = 20, before }) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        method: "GET",
        params: { page, limit, ...(before ? { before } : {}) },
      }),
      transformResponse: (res) => res.data,
      providesTags: (_result, _error, { conversationId }) => [
        { type: "ChatMessages", id: conversationId },
      ],
    }),
    markConversationRead: builder.mutation({
      query: (conversationId) => ({
        url: `/chat/conversations/${conversationId}/read`,
        method: "PUT",
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["ChatConversation"],
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, content, type = "TEXT" }) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        method: "POST",
        data: { content, type },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: "ChatMessages", id: conversationId },
        "ChatConversation",
      ],
    }),
  }),
});

export const {
  useGetMyConversationQuery,
  useCreateConversationMutation,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useMarkConversationReadMutation,
  useSendMessageMutation,
} = chatApi;
