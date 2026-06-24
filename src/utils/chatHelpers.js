export const isOwnMessage = (message, currentUserId, senderModel) =>
  message?.sender === currentUserId && message?.senderModel === senderModel;

export const isCustomerMessage = (message) => message?.senderModel === "User";

export const isStoreMessage = (message) => message?.senderModel === "Admin";

/** customer: tin mình (User) bên phải | admin: khách trái, đội hỗ trợ phải */
export const getMessageSide = (message, { viewAs, currentUserId, senderModel }) => {
  if (viewAs === "admin") {
    return isStoreMessage(message) ? "right" : "left";
  }
  return isOwnMessage(message, currentUserId, senderModel) ? "right" : "left";
};

const resolveSenderObject = (sender) =>
  sender && typeof sender === "object" ? sender : null;

export const getSenderLabel = (
  message,
  { viewAs, currentUserId, conversation, adminInfo }
) => {
  if (viewAs !== "admin" || !message) return null;

  // Chỉ hiện nhãn phía đội hỗ trợ (bên phải), tin khách không cần label
  if (isCustomerMessage(message)) {
    return null;
  }

  if (isStoreMessage(message)) {
    if (message.sender === currentUserId) {
      const role = adminInfo?.role === "ADMIN" ? "Admin" : "Staff";
      return `Bạn · ${role}`;
    }

    const populated = resolveSenderObject(message.sender);
    if (populated?.name) {
      const role = populated.role === "ADMIN" ? "Admin" : "Staff";
      return `${populated.name} · ${role}`;
    }

    const assigned = resolveSenderObject(conversation?.assignedTo);
    if (assigned?._id === message.sender && assigned?.name) {
      const role = assigned.role === "ADMIN" ? "Admin" : "Staff";
      return `${assigned.name} · ${role}`;
    }

    return "Đội ngũ hỗ trợ";
  }

  return null;
};

export const dedupeMessages = (messages) => {
  const seen = new Set();
  return messages.filter((msg) => {
    if (!msg?._id || seen.has(msg._id)) return false;
    seen.add(msg._id);
    return true;
  });
};

export const sortMessagesAsc = (messages) =>
  [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
