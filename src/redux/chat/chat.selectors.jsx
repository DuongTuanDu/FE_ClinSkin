export const selectTotalAdminUnread = (state) =>
  state.chat.adminTotalUnread;

export const selectActiveMessages = (state) => {
  const id = state.chat.activeConversationId;
  return id ? state.chat.messagesByConversation[id] || [] : [];
};

export const selectActiveTyping = (state) => {
  const id = state.chat.activeConversationId;
  return id ? state.chat.typingByConversation[id] : null;
};

export const selectHasMoreMessages = (state) => {
  const id = state.chat.activeConversationId;
  return id ? state.chat.hasMoreByConversation[id] ?? false : false;
};
