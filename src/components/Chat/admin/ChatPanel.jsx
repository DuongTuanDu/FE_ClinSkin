import React, { useState } from "react";
import { Avatar, Button, Popconfirm, Space, Switch, Tag, message } from "antd";
import ChatMessageList from "../ChatMessageList";
import ChatInput from "../ChatInput";

const ChatPanel = ({
  conversation,
  messages = [],
  currentUserId,
  senderModel,
  adminInfo,
  showSenderLabel: showSenderLabelProp,
  hasMore,
  isLoadingMore,
  onLoadMore,
  typingSender,
  onSend,
  onTyping,
  onStopTyping,
  onClose,
  onAssign,
  isClosed,
  isAssigning,
  isClosing,
}) => {
  const [localClosing, setLocalClosing] = useState(false);
  const [showSenderLabel, setShowSenderLabel] = useState(
    showSenderLabelProp ?? true
  );

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 text-gray-400">
        Chọn một hội thoại để bắt đầu
      </div>
    );
  }

  const user =
    typeof conversation.user === "object"
      ? conversation.user
      : { name: "Khách hàng" };
  const assigned =
    typeof conversation.assignedTo === "object"
      ? conversation.assignedTo
      : null;

  const handleClose = async () => {
    setLocalClosing(true);
    try {
      await onClose?.();
      message.success("Đã đóng hội thoại");
    } catch {
      message.error("Không thể đóng hội thoại");
    } finally {
      setLocalClosing(false);
    }
  };

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden bg-white">
      <div className="shrink-0 p-4 border-b flex justify-between items-center bg-gradient-to-r from-pink-50 to-white">
        <div className="flex gap-3 items-center min-w-0">
          <Avatar src={user.avatar?.url || user.avatar} size={48}>
            {user.name?.[0]}
          </Avatar>
          <div className="min-w-0">
            <h4 className="font-semibold truncate">{user.name}</h4>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <Space size={4} className="mt-1">
              <Tag
                color={
                  conversation.status === "OPEN"
                    ? "green"
                    : conversation.status === "CLOSED"
                    ? "default"
                    : "orange"
                }
              >
                {conversation.status}
              </Tag>
              {assigned && <Tag color="blue">PV: {assigned.name}</Tag>}
            </Space>
          </div>
        </div>
        <Space wrap>
          <Space size={4} className="text-xs text-gray-500">
            <span>Tên người gửi</span>
            <Switch
              size="small"
              checked={showSenderLabel}
              onChange={setShowSenderLabel}
            />
          </Space>
          {!assigned && (
            <Button size="small" loading={isAssigning} onClick={onAssign}>
              Nhận phụ trách
            </Button>
          )}
          {conversation.status !== "CLOSED" && (
            <Popconfirm
              title="Đóng hội thoại này?"
              onConfirm={handleClose}
              okText="Đóng"
              cancelText="Hủy"
            >
              <Button size="small" danger loading={isClosing || localClosing}>
                Đóng
              </Button>
            </Popconfirm>
          )}
        </Space>
      </div>

      <ChatMessageList
        messages={messages}
        currentUserId={currentUserId}
        senderModel={senderModel}
        viewAs="admin"
        showSenderLabel={showSenderLabel}
        conversation={conversation}
        adminInfo={adminInfo}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={onLoadMore}
        typingSender={typingSender}
        containerClassName="flex-1 min-h-0"
      />

      {isClosed ? (
        <div className="shrink-0 p-4 border-t text-center text-sm text-gray-500">
          Hội thoại đã đóng. Khách có thể mở lại khi gửi tin mới.
        </div>
      ) : (
        <div className="shrink-0">
          <ChatInput
            onSend={onSend}
            onTyping={onTyping}
            onStopTyping={onStopTyping}
          />
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
