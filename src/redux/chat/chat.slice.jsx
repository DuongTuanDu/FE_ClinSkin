import { createSlice } from "@reduxjs/toolkit";
import { dedupeMessages, sortMessagesAsc } from "@/utils/chatHelpers";

const initialState = {
  userConversation: null,
  userUnreadCount: 0,
  adminUnreadByConversation: {},
  adminTotalUnread: 0,
  conversations: [],
  activeConversationId: null,
  messagesByConversation: {},
  hasMoreByConversation: {},
  typingByConversation: {},
  isWidgetOpen: false,
};

const recalcAdminTotalUnread = (state) => {
  state.adminTotalUnread = Object.values(state.adminUnreadByConversation).reduce(
    (sum, n) => sum + (n || 0),
    0
  );
};

const upsertConversation = (list, conversation) => {
  const idx = list.findIndex((c) => c._id === conversation._id);
  if (idx === -1) {
    return [conversation, ...list];
  }
  const next = [...list];
  next[idx] = { ...next[idx], ...conversation };
  next.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return next;
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUserConversation(state, action) {
      state.userConversation = action.payload;
      state.userUnreadCount = action.payload?.unreadCount?.user ?? 0;
    },
    setUserUnreadCount(state, action) {
      state.userUnreadCount = action.payload;
      if (state.userConversation) {
        state.userConversation = {
          ...state.userConversation,
          unreadCount: {
            ...state.userConversation.unreadCount,
            user: action.payload,
          },
        };
      }
    },
    setConversations(state, action) {
      state.conversations = action.payload;
      action.payload.forEach((c) => {
        state.adminUnreadByConversation[c._id] = c.unreadCount?.admin || 0;
      });
      recalcAdminTotalUnread(state);
    },
    setActiveConversationId(state, action) {
      state.activeConversationId = action.payload;
    },
    setWidgetOpen(state, action) {
      state.isWidgetOpen = action.payload;
    },
    setMessagesForConversation(state, action) {
      const { conversationId, messages, hasMore, append } = action.payload;
      const existing = state.messagesByConversation[conversationId] || [];
      const merged = append
        ? sortMessagesAsc(dedupeMessages([...messages, ...existing]))
        : sortMessagesAsc(dedupeMessages(messages));
      state.messagesByConversation[conversationId] = merged;
      if (hasMore !== undefined) {
        state.hasMoreByConversation[conversationId] = hasMore;
      }
    },
    appendMessage(state, action) {
      const { message, conversation } = action.payload;
      const conversationId = message?.conversation || conversation?._id;
      if (!conversationId) return;

      const list = state.messagesByConversation[conversationId] || [];
      if (list.some((m) => m._id === message._id)) return;

      const withoutTemp = list.filter(
        (m) =>
          !(
            m._isOptimistic &&
            m.content === message.content &&
            m.senderModel === message.senderModel
          )
      );

      state.messagesByConversation[conversationId] = sortMessagesAsc(
        dedupeMessages([...withoutTemp, message])
      );

      if (conversation) {
        state.conversations = upsertConversation(state.conversations, conversation);
        if (state.userConversation?._id === conversation._id) {
          state.userConversation = { ...state.userConversation, ...conversation };
          state.userUnreadCount = conversation.unreadCount?.user ?? 0;
        }
        if (conversation.unreadCount?.admin !== undefined) {
          state.adminUnreadByConversation[conversation._id] =
            conversation.unreadCount.admin;
          recalcAdminTotalUnread(state);
        }
      }
    },
    addOptimisticMessage(state, action) {
      const { conversationId, message } = action.payload;
      const list = state.messagesByConversation[conversationId] || [];
      state.messagesByConversation[conversationId] = [...list, message];
    },
    replaceOptimisticMessage(state, action) {
      const { conversationId, tempId, message } = action.payload;
      const list = state.messagesByConversation[conversationId] || [];
      state.messagesByConversation[conversationId] = sortMessagesAsc(
        dedupeMessages(
          list.map((m) => (m._id === tempId ? { ...message } : m))
        )
      );
    },
    markMessageFailed(state, action) {
      const { conversationId, tempId } = action.payload;
      const list = state.messagesByConversation[conversationId] || [];
      state.messagesByConversation[conversationId] = list.map((m) =>
        m._id === tempId ? { ...m, _status: "failed" } : m
      );
    },
    updateConversation(state, action) {
      const { conversation } = action.payload;
      if (!conversation?._id) return;

      state.conversations = upsertConversation(state.conversations, conversation);
      if (state.userConversation?._id === conversation._id) {
        state.userConversation = { ...state.userConversation, ...conversation };
        state.userUnreadCount = conversation.unreadCount?.user ?? 0;
      }
      if (conversation.unreadCount?.admin !== undefined) {
        state.adminUnreadByConversation[conversation._id] =
          conversation.unreadCount.admin;
        recalcAdminTotalUnread(state);
      }
    },
    setUnread(state, action) {
      const { conversationId, unreadCount } = action.payload;
      state.conversations = state.conversations.map((c) =>
        c._id === conversationId
          ? { ...c, unreadCount: { ...c.unreadCount, ...unreadCount } }
          : c
      );
      if (state.userConversation?._id === conversationId) {
        state.userConversation = {
          ...state.userConversation,
          unreadCount: { ...state.userConversation.unreadCount, ...unreadCount },
        };
        state.userUnreadCount = unreadCount?.user ?? state.userUnreadCount;
      }
      if (unreadCount?.admin !== undefined) {
        state.adminUnreadByConversation[conversationId] = unreadCount.admin;
        recalcAdminTotalUnread(state);
      }
    },
    setTyping(state, action) {
      const { conversationId, sender } = action.payload;
      state.typingByConversation[conversationId] = sender;
    },
    clearTyping(state, action) {
      delete state.typingByConversation[action.payload];
    },
    resetChatState(state) {
      return { ...initialState };
    },
  },
});

export const ChatActions = chatSlice.actions;
export default chatSlice.reducer;
