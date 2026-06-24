import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { ChatActions } from "@/redux/chat/chat.slice";

const ChatSocketBridge = ({ actorType }) => {
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
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (payload) => {
      dispatch(ChatActions.appendMessage(payload));
    };

    const handleConversationUpdated = (payload) => {
      dispatch(ChatActions.updateConversation(payload));
    };

    const handleUnread = (payload) => {
      dispatch(ChatActions.setUnread(payload));
    };

    const handleTyping = (payload) => {
      if (payload?.sender?._id === currentUserId) return;
      dispatch(
        ChatActions.setTyping({
          conversationId: payload.conversationId,
          sender: payload.sender,
        })
      );
    };

    const handleStopTyping = (payload) => {
      dispatch(ChatActions.clearTyping(payload.conversationId));
    };

    const handleError = (payload) => {
      message.error(payload?.message || "Lỗi chat");
    };

    const handleConnect = () => {
      if (activeConversationId) {
        socket.emit("chat:join", { conversationId: activeConversationId });
      }
    };

    socket.on("chat:message", handleMessage);
    socket.on("chat:conversationUpdated", handleConversationUpdated);
    socket.on("chat:unread", handleUnread);
    socket.on("chat:typing", handleTyping);
    socket.on("chat:stopTyping", handleStopTyping);
    socket.on("chat:error", handleError);
    socket.on("connect", handleConnect);

    return () => {
      socket.off("chat:message", handleMessage);
      socket.off("chat:conversationUpdated", handleConversationUpdated);
      socket.off("chat:unread", handleUnread);
      socket.off("chat:typing", handleTyping);
      socket.off("chat:stopTyping", handleStopTyping);
      socket.off("chat:error", handleError);
      socket.off("connect", handleConnect);
    };
  }, [socket, currentUserId, activeConversationId, dispatch]);

  return null;
};

export default ChatSocketBridge;
