import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import { ChatActions } from "@/redux/chat/chat.slice";
import {
  useGetConversationsQuery,
  useLazyGetAdminMessagesQuery,
  useAssignConversationMutation,
  useCloseConversationMutation,
  useSendAdminMessageMutation,
} from "@/redux/chat/chatAdmin.query";
import { useChatSocket } from "@/hook/useChatSocket";
import ChatSidebar from "@/components/Chat/admin/ChatSidebar";
import ChatPanel from "@/components/Chat/admin/ChatPanel";

const ManageChat = () => {
  const dispatch = useDispatch();
  const { adminInfo } = useSelector((state) => state.auth);
  const { conversations, activeConversationId, messagesByConversation } =
    useSelector((state) => state.chat);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const debouncedSetSearch = useDebouncedCallback((val) => setSearch(val), 400);

  const { data, isLoading, isFetching, refetch } = useGetConversationsQuery({
    status,
    page,
    limit: 20,
    search,
  });

  const [fetchMessages] = useLazyGetAdminMessagesQuery();
  const [assignConversation, { isLoading: isAssigning }] =
    useAssignConversationMutation();
  const [closeConversation, { isLoading: isClosing }] =
    useCloseConversationMutation();
  const [sendAdminMessageRest] = useSendAdminMessageMutation();

  const activeConversation =
    conversations.find((c) => c._id === activeConversationId) || null;
  const messages = activeConversationId
    ? messagesByConversation[activeConversationId] || []
    : [];
  const hasMore = useSelector((state) =>
    activeConversationId
      ? state.chat.hasMoreByConversation[activeConversationId] ?? false
      : false
  );
  const typingSender = useSelector((state) =>
    activeConversationId
      ? state.chat.typingByConversation[activeConversationId]
      : null
  );

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

  const handleReconnect = useCallback(
    (convId) => {
      if (convId) loadMessages(convId);
      refetch();
    },
    [loadMessages, refetch]
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
  } = useChatSocket({ actorType: "admin" });

  useEffect(() => {
    if (!socket || !activeConversationId) return;

    const handleConnect = () => {
      rejoinOnReconnect(activeConversationId, handleReconnect);
    };

    socket.on("connect", handleConnect);
    return () => socket.off("connect", handleConnect);
  }, [socket, activeConversationId, rejoinOnReconnect, handleReconnect]);

  useEffect(() => {
    if (data?.conversations) {
      if (page === 1) {
        dispatch(ChatActions.setConversations(data.conversations));
      } else {
        const existingIds = new Set(conversations.map((c) => c._id));
        const merged = [
          ...conversations,
          ...data.conversations.filter((c) => !existingIds.has(c._id)),
        ];
        dispatch(ChatActions.setConversations(merged));
      }
    }
  }, [data?.conversations, page]);

  useEffect(() => {
    setPage(1);
  }, [status, search]);

  const handleSelectConversation = async (conv) => {
    if (activeConversationId && activeConversationId !== conv._id) {
      leaveConversation(activeConversationId);
    }
    joinConversation(conv._id);
    setIsLoadingMessages(true);
    try {
      await loadMessages(conv._id);
      markAsRead(conv._id);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleLoadMoreMessages = async () => {
    if (
      !activeConversationId ||
      !hasMore ||
      isLoadingMore ||
      messages.length === 0
    )
      return;
    setIsLoadingMore(true);
    try {
      await loadMessages(activeConversationId, {
        before: messages[0]?._id,
        append: true,
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSend = async (content) => {
    if (!activeConversationId) return;

    const tempId = `temp_${Date.now()}`;
    const optimistic = {
      _id: tempId,
      conversation: activeConversationId,
      sender: currentUserId,
      senderModel,
      content,
      type: "TEXT",
      _isOptimistic: true,
      createdAt: new Date().toISOString(),
    };

    dispatch(
      ChatActions.addOptimisticMessage({
        conversationId: activeConversationId,
        message: optimistic,
      })
    );
    stopTyping(activeConversationId);

    const tryRest = async () => {
      try {
        const result = await sendAdminMessageRest({
          conversationId: activeConversationId,
          content,
        }).unwrap();
        dispatch(
          ChatActions.replaceOptimisticMessage({
            conversationId: activeConversationId,
            tempId,
            message: result.message,
          })
        );
        if (result.conversation) {
          dispatch(ChatActions.updateConversation({ conversation: result.conversation }));
        }
      } catch {
        dispatch(
          ChatActions.markMessageFailed({
            conversationId: activeConversationId,
            tempId,
          })
        );
      }
    };

    if (!isConnected) {
      await tryRest();
      return;
    }

    sendMessage({
      conversationId: activeConversationId,
      content,
      onSuccess: (data) => {
        dispatch(
          ChatActions.replaceOptimisticMessage({
            conversationId: activeConversationId,
            tempId,
            message: data.message,
          })
        );
        if (data.conversation) {
          dispatch(ChatActions.updateConversation({ conversation: data.conversation }));
        }
      },
      onError: tryRest,
    });
  };

  const handleAssign = async () => {
    if (!activeConversationId) return;
    try {
      const result = await assignConversation(activeConversationId).unwrap();
      dispatch(ChatActions.updateConversation({ conversation: result }));
    } catch {
      // noop
    }
  };

  const handleClose = async () => {
    if (!activeConversationId) return;
    const result = await closeConversation(activeConversationId).unwrap();
    dispatch(ChatActions.updateConversation({ conversation: result }));
  };

  return (
    <div className="mt-4 bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-220px)] min-h-[480px] max-h-[calc(100vh-220px)] flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] flex-1 min-h-0 overflow-hidden">
        <div className="min-h-0 h-full overflow-hidden border-r">
          <ChatSidebar
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={handleSelectConversation}
          isLoading={isLoading && page === 1}
          search={searchInput}
          onSearchChange={(val) => {
            setSearchInput(val);
            debouncedSetSearch(val);
          }}
          status={status}
          onStatusChange={setStatus}
          hasMore={data?.hasMore}
          onLoadMore={() => setPage((p) => p + 1)}
          isFetching={isFetching}
        />
        </div>
        <div className="min-h-0 h-full overflow-hidden">
          <ChatPanel
          conversation={activeConversation}
          messages={messages}
          currentUserId={currentUserId || adminInfo?._id}
          senderModel={senderModel}
          adminInfo={adminInfo}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore || isLoadingMessages}
          onLoadMore={handleLoadMoreMessages}
          typingSender={typingSender}
          onSend={handleSend}
          onTyping={() => emitTyping(activeConversationId)}
          onStopTyping={() => stopTyping(activeConversationId)}
          onClose={handleClose}
          onAssign={handleAssign}
          isClosed={activeConversation?.status === "CLOSED"}
          isAssigning={isAssigning}
          isClosing={isClosing}
        />
        </div>
      </div>
    </div>
  );
};

export default ManageChat;
