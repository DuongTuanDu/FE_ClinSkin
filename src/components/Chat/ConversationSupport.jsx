import React, { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Button, Avatar, Spin, Tag, message } from "antd";
import { BsFillChatFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModelAuth } from "@/redux/auth/auth.slice";
import { ChatActions } from "@/redux/chat/chat.slice";
import {
  useGetMyConversationQuery,
  useCreateConversationMutation,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
  chatApi,
} from "@/redux/chat/chat.query";
import { useChatSocket } from "@/hook/useChatSocket";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=ClinSkin&background=f472b6&color=fff";

const ConversationSupport = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const { userConversation, userUnreadCount, messagesByConversation } =
    useSelector((state) => state.chat);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const creatingRef = useRef(false);

  const conversationId = userConversation?._id;
  const messages = conversationId
    ? messagesByConversation[conversationId] || []
    : [];
  const hasMore = useSelector(
    (state) =>
      conversationId
        ? state.chat.hasMoreByConversation[conversationId] ?? false
        : false
  );
  const typingSender = useSelector((state) =>
    conversationId ? state.chat.typingByConversation[conversationId] : null
  );

  const { data: conversationData, error: conversationError, isLoading: isLoadingConversation } =
    useGetMyConversationQuery(undefined, { skip: !isAuthenticated });

  const [createConversation] = useCreateConversationMutation();
  const [fetchMessages] = useLazyGetMessagesQuery();
  const [sendMessageRest] = useSendMessageMutation();

  const loadMessages = useCallback(
    async (convId, { before, append = false } = {}) => {
      if (!convId) return;
      const result = await fetchMessages({
        conversationId: convId,
        page: 1,
        limit: 20,
        ...(before ? { before } : {}),
      }).unwrap();

      dispatch(
        ChatActions.setMessagesForConversation({
          conversationId: convId,
          messages: result.messages || [],
          hasMore: result.hasMore,
          append,
        })
      );
    },
    [fetchMessages, dispatch]
  );

  const {
    senderModel,
    currentUserId,
    joinConversation,
    leaveConversation,
    markAsRead,
    sendMessage,
    emitTyping,
    stopTyping,
    isConnected,
    socket,
    rejoinOnReconnect,
  } = useChatSocket({ actorType: "customer" });

  useEffect(() => {
    if (!conversationData) return;

    // POST reopen có thể trả OPEN nhưng GET /me vẫn CLOSED — không ghi đè OPEN đã set
    if (
      userConversation?._id === conversationData._id &&
      userConversation?.status === "OPEN" &&
      conversationData.status === "CLOSED"
    ) {
      return;
    }

    dispatch(ChatActions.setUserConversation(conversationData));
  }, [conversationData, dispatch, userConversation?._id, userConversation?.status]);

  useEffect(() => {
    if (!isAuthenticated || conversationData?._id || creatingRef.current) return;
    if (conversationError?.status !== 404) return;

    creatingRef.current = true;
    createConversation()
      .unwrap()
      .then((created) => {
        dispatch(ChatActions.setUserConversation(created));
      })
      .finally(() => {
        creatingRef.current = false;
      });
  }, [isAuthenticated, conversationData, conversationError, createConversation, dispatch]);

  useEffect(() => {
    if (!socket || !conversationId || !isChatOpen) return;

    const handleConnect = () => {
      rejoinOnReconnect(conversationId, loadMessages);
    };

    socket.on("connect", handleConnect);
    return () => socket.off("connect", handleConnect);
  }, [socket, conversationId, isChatOpen, loadMessages, rejoinOnReconnect]);

  useEffect(() => {
    if (isChatOpen && conversationId) {
      joinConversation(conversationId);
      loadMessages(conversationId);
      markAsRead(conversationId);
      dispatch(ChatActions.setUserUnreadCount(0));
    }
  }, [isChatOpen, conversationId]);

  useEffect(() => {
    if (isChatOpen && conversationId && messages.length > 0) {
      markAsRead(conversationId);
    }
  }, [messages.length, isChatOpen, conversationId]);

  const handleOpenChat = () => {
    if (!isAuthenticated) {
      dispatch(setOpenModelAuth(true));
      return;
    }
    setIsChatOpen(true);
    dispatch(ChatActions.setWidgetOpen(true));
  };

  const handleCloseChat = () => {
    leaveConversation(conversationId);
    setIsChatOpen(false);
    dispatch(ChatActions.setWidgetOpen(false));
  };

  const handleLoadMore = async () => {
    if (!conversationId || !hasMore || isLoadingMore || messages.length === 0)
      return;
    setIsLoadingMore(true);
    try {
      const oldestId = messages[0]?._id;
      await loadMessages(conversationId, { before: oldestId, append: true });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSend = async (content) => {
    if (!conversationId) return;

    const tempId = `temp_${Date.now()}`;
    const optimistic = {
      _id: tempId,
      conversation: conversationId,
      sender: currentUserId,
      senderModel,
      content,
      type: "TEXT",
      _isOptimistic: true,
      createdAt: new Date().toISOString(),
    };

    dispatch(
      ChatActions.addOptimisticMessage({ conversationId, message: optimistic })
    );
    stopTyping(conversationId);

    const tryRestFallback = async () => {
      try {
        const result = await sendMessageRest({ conversationId, content }).unwrap();
        dispatch(
          ChatActions.replaceOptimisticMessage({
            conversationId,
            tempId,
            message: result.message,
          })
        );
        if (result.conversation) {
          dispatch(ChatActions.setUserConversation(result.conversation));
        } else if (isClosed) {
          dispatch(
            ChatActions.setUserConversation({
              ...userConversation,
              status: "OPEN",
            })
          );
        }
      } catch {
        dispatch(ChatActions.markMessageFailed({ conversationId, tempId }));
      }
    };

    if (!isConnected) {
      await tryRestFallback();
      return;
    }

    sendMessage({
      conversationId,
      content,
      onSuccess: (data) => {
        dispatch(
          ChatActions.replaceOptimisticMessage({
            conversationId,
            tempId,
            message: data.message,
          })
        );
        if (data.conversation) {
          dispatch(ChatActions.setUserConversation(data.conversation));
        } else if (isClosed) {
          dispatch(
            ChatActions.setUserConversation({
              ...userConversation,
              status: "OPEN",
            })
          );
        }
      },
      onError: () => {
        tryRestFallback();
      },
    });
  };

  const assignedStaff = userConversation?.assignedTo;
  const staffName =
    typeof assignedStaff === "object"
      ? assignedStaff?.name
      : null;
  const staffAvatar =
    typeof assignedStaff === "object" && assignedStaff?.avatar?.url
      ? assignedStaff.avatar.url
      : DEFAULT_AVATAR;
  const isClosed = userConversation?.status === "CLOSED";

  const handleReopen = async () => {
    try {
      const created = await createConversation().unwrap();
      // Backend POST trả conversation cũ (có thể vẫn CLOSED) — UI mở lại để chat
      const reopened = { ...created, status: "OPEN" };

      dispatch(ChatActions.setUserConversation(reopened));
      dispatch(
        chatApi.util.updateQueryData("getMyConversation", undefined, () => reopened)
      );

      joinConversation(reopened._id);
      await loadMessages(reopened._id);
      markAsRead(reopened._id);
    } catch {
      message.error("Không thể mở lại hội thoại");
    }
  };

  return (
    <div className="fixed bottom-16 right-6 z-50">
      {!isChatOpen && (
        <div onClick={handleOpenChat} className="relative cursor-pointer animate-bounce">
          <Button
            type="primary"
            shape="circle"
            size="large"
            className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 border-none shadow-xl flex items-center justify-center"
          >
            <Badge count={userUnreadCount} color="#c13338" offset={[-5, 5]}>
              <BsFillChatFill className="text-3xl text-white" />
            </Badge>
          </Button>
          <div className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-25" />
        </div>
      )}

      {isChatOpen && (
        <div className="w-[320px] bg-white rounded-xl shadow-xl overflow-hidden animate-fadeIn">
          <div className="bg-gradient-to-r from-pink-500 to-pink-400 p-4 flex justify-between items-center text-white">
            <div className="flex gap-2 items-center min-w-0">
              <Avatar src={staffAvatar} />
              <div className="min-w-0">
                <h4 className="font-semibold truncate">
                  {staffName || "Hỗ trợ ClinSkin"}
                </h4>
                <p className="text-xs opacity-90">
                  {isClosed ? (
                    <Tag color="default" className="text-xs m-0 border-0">
                      Đã đóng
                    </Tag>
                  ) : isConnected ? (
                    "Đang trực tuyến"
                  ) : (
                    "Đang kết nối..."
                  )}
                </p>
              </div>
            </div>
            <IoClose
              className="text-2xl cursor-pointer hover:text-gray-200 shrink-0"
              onClick={handleCloseChat}
            />
          </div>

          {isLoadingConversation || (!conversationId && isAuthenticated) ? (
            <div className="h-64 flex items-center justify-center">
              <Spin />
            </div>
          ) : (
            <>
              <ChatMessageList
                messages={messages}
                currentUserId={currentUserId || userInfo?._id}
                senderModel={senderModel}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
                typingSender={typingSender}
              />
              {isClosed && (
                <div className="px-3 py-2 border-t bg-amber-50 text-center">
                  <p className="text-xs text-amber-700 mb-2">
                    Cuộc hội thoại đã đóng
                  </p>
                  <Button type="primary" size="small" onClick={handleReopen}>
                    Bắt đầu chat lại
                  </Button>
                </div>
              )}
              <ChatInput
                onSend={handleSend}
                onTyping={() => emitTyping(conversationId)}
                onStopTyping={() => stopTyping(conversationId)}
                disabled={!conversationId}
                placeholder={
                  isClosed
                    ? "Gửi tin để mở lại hội thoại..."
                    : "Nhập tin nhắn..."
                }
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationSupport;
