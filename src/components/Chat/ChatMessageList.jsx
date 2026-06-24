import React, { useEffect, useRef, useCallback } from "react";
import { Spin } from "antd";
import ChatBubble from "./ChatBubble";

const ChatMessageList = ({
  messages = [],
  currentUserId,
  senderModel,
  viewAs = "customer",
  showSenderLabel = false,
  conversation = null,
  adminInfo = null,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  typingSender = null,
  /** Chiều cao wrapper: h-64 (widget) hoặc flex-1 (admin panel) */
  containerClassName = "h-64",
}) => {
  const containerRef = useRef(null);
  const prevLengthRef = useRef(0);
  const isNearBottomRef = useRef(true);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior });
    }
  }, []);

  useEffect(() => {
    const grew = messages.length > prevLengthRef.current;
    prevLengthRef.current = messages.length;

    if (grew && isNearBottomRef.current) {
      scrollToBottom(messages.length <= 3 ? "auto" : "smooth");
    }
  }, [messages, scrollToBottom]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distanceFromBottom < 80;

    if (el.scrollTop < 40 && hasMore && !isLoadingMore) {
      onLoadMore?.();
    }
  };

  return (
    <div className={`relative min-h-0 ${containerClassName}`}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 bg-gray-50"
      >
        {isLoadingMore && (
          <div className="text-center py-2">
            <Spin size="small" />
          </div>
        )}
        {messages.length === 0 && !isLoadingMore && (
          <p className="text-center text-gray-400 text-sm mt-8">
            Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
          </p>
        )}
        {messages.map((msg) => (
          <ChatBubble
            key={msg._id}
            message={msg}
            currentUserId={currentUserId}
            senderModel={senderModel}
            viewAs={viewAs}
            showSenderLabel={showSenderLabel}
            conversation={conversation}
            adminInfo={adminInfo}
          />
        ))}
        {typingSender && (
          <p className="text-xs text-gray-500 italic mt-1">
            {typingSender.name || "Đối phương"} đang nhập...
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessageList;
