import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@axios/axios";

export const chatAdminApi = createApi({
  reducerPath: "chatAdminApi",
  baseQuery: async (args, api, extraOptions) => {
    const { url, method, data, params } = args;
    return baseQuery({ url, method, data, params });
  },
  tagTypes: ["AdminChatConversation", "AdminChatMessages"],
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: ({ status = "", page = 1, limit = 20, search = "" } = {}) => ({
        url: "/admin/chat/conversations",
        method: "GET",
        params: {
          page,
          limit,
          ...(status ? { status } : {}),
          ...(search ? { search } : {}),
        },
      }),
      transformResponse: (res) => res.data,
      providesTags: ["AdminChatConversation"],
    }),
    getConversationDetail: builder.query({
      query: (conversationId) => ({
        url: `/admin/chat/conversations/${conversationId}`,
        method: "GET",
      }),
      transformResponse: (res) => res.data,
      providesTags: (_result, _error, id) => [
        { type: "AdminChatConversation", id },
      ],
    }),
    getAdminMessages: builder.query({
      query: ({ conversationId, page = 1, limit = 20, before }) => ({
        url: `/admin/chat/conversations/${conversationId}/messages`,
        method: "GET",
        params: { page, limit, ...(before ? { before } : {}) },
      }),
      transformResponse: (res) => res.data,
      providesTags: (_result, _error, { conversationId }) => [
        { type: "AdminChatMessages", id: conversationId },
      ],
    }),
    markAdminConversationRead: builder.mutation({
      query: (conversationId) => ({
        url: `/admin/chat/conversations/${conversationId}/read`,
        method: "PUT",
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["AdminChatConversation"],
    }),
    assignConversation: builder.mutation({
      query: (conversationId) => ({
        url: `/admin/chat/conversations/${conversationId}/assign`,
        method: "PUT",
        data: {},
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["AdminChatConversation"],
    }),
    closeConversation: builder.mutation({
      query: (conversationId) => ({
        url: `/admin/chat/conversations/${conversationId}/close`,
        method: "PUT",
        data: {},
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: ["AdminChatConversation"],
    }),
    sendAdminMessage: builder.mutation({
      query: ({ conversationId, content, type = "TEXT" }) => ({
        url: `/admin/chat/conversations/${conversationId}/messages`,
        method: "POST",
        data: { content, type },
      }),
      transformResponse: (res) => res.data,
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: "AdminChatMessages", id: conversationId },
        "AdminChatConversation",
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationDetailQuery,
  useGetAdminMessagesQuery,
  useLazyGetAdminMessagesQuery,
  useMarkAdminConversationReadMutation,
  useAssignConversationMutation,
  useCloseConversationMutation,
  useSendAdminMessageMutation,
} = chatAdminApi;
