import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatActions } from "@/redux/chat/chat.slice";

export const useChatSocket = ({ actorType } = {}) => {
  const dispatch = useDispatch();
  const socket = useSelector((state) =>
    actorType === "customer"
      ? state.socket.socketCustomer
      : state.socket.socketAdmin
  );
  const activeConversationId = useSelector(
    (state) => state.chat.activeConversationId
  );
  const currentUserId = useSelector((state) =>
    actorType === "customer"
      ? state.auth.userInfo?._id
      : state.auth.adminInfo?._id
  );
  const senderModel = actorType === "customer" ? "User" : "Admin";

  const joinConversation = useCallback(
    (conversationId) => {
      if (!conversationId) return;
      dispatch(ChatActions.setActiveConversationId(conversationId));
      socket?.emit("chat:join", { conversationId });
    },
    [socket, dispatch]
  );

  const leaveConversation = useCallback(
    (conversationId) => {
      const id = conversationId || activeConversationId;
      if (!id) return;
      socket?.emit("chat:leave", { conversationId: id });
      dispatch(ChatActions.clearTyping(id));
      if (activeConversationId === id) {
        dispatch(ChatActions.setActiveConversationId(null));
      }
    },
    [socket, activeConversationId, dispatch]
  );

  const markAsRead = useCallback(
    (conversationId) => {
      if (!conversationId) return;
      socket?.emit("chat:read", { conversationId });
    },
    [socket]
  );

  const sendMessage = useCallback(
    ({ conversationId, content, type = "TEXT", onSuccess, onError }) => {
      if (!socket?.connected) {
        onError?.({ message: "Socket chưa kết nối" });
        return;
      }

      socket.emit(
        "chat:send",
        { conversationId, content, type },
        (response) => {
          if (response?.success) {
            onSuccess?.(response.data);
          } else {
            onError?.(response);
          }
        }
      );
    },
    [socket]
  );

  const emitTyping = useCallback(
    (conversationId) => {
      if (!conversationId) return;
      socket?.emit("chat:typing", { conversationId });
    },
    [socket]
  );

  const stopTyping = useCallback(
    (conversationId) => {
      if (!conversationId) return;
      socket?.emit("chat:stopTyping", { conversationId });
    },
    [socket]
  );

  const rejoinOnReconnect = useCallback(
    (conversationId, onRefetch) => {
      if (conversationId) {
        socket?.emit("chat:join", { conversationId });
        onRefetch?.(conversationId);
      }
    },
    [socket]
  );

  return {
    socket,
    senderModel,
    currentUserId,
    isConnected: !!socket?.connected,
    joinConversation,
    leaveConversation,
    markAsRead,
    sendMessage,
    emitTyping,
    stopTyping,
    rejoinOnReconnect,
  };
};
