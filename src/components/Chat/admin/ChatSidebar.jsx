import React from "react";
import { Avatar, Badge, Empty, Input, Select, Spin } from "antd";
import dayjs from "@utils/dayjsTz";

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "OPEN", label: "Đang mở" },
  { value: "CLOSED", label: "Đã đóng" },
  // PENDING: ẩn tạm — backend chưa triển khai
];

const ChatSidebar = ({
  conversations = [],
  activeId,
  onSelect,
  isLoading,
  search,
  onSearchChange,
  status,
  onStatusChange,
  hasMore,
  onLoadMore,
  isFetching,
}) => {
  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden bg-white">
      <div className="shrink-0 p-4 border-b space-y-3">
        <h3 className="font-semibold text-gray-800">Hội thoại khách hàng</h3>
        <Input.Search
          placeholder="Tìm theo tên, email..."
          allowClear
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onSearch={onSearchChange}
        />
        <Select
          className="w-full"
          value={status}
          onChange={onStatusChange}
          options={STATUS_OPTIONS}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : conversations.length === 0 ? (
          <Empty description="Chưa có hội thoại" className="mt-8" />
        ) : (
          conversations.map((conv) => {
            const user =
              typeof conv.user === "object" ? conv.user : { name: "Khách hàng" };
            const unread = conv.unreadCount?.admin || 0;
            const isActive = conv._id === activeId;

            return (
              <div
                key={conv._id}
                onClick={() => onSelect(conv)}
                className={`p-4 cursor-pointer border-b hover:bg-gray-50 transition ${
                  isActive ? "bg-pink-50 border-l-4 border-l-pink-500" : ""
                }`}
              >
                <div className="flex gap-3 items-start">
                  <Avatar src={user.avatar?.url || user.avatar}>
                    {user.name?.[0]}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {user.name || "Khách hàng"}
                      </span>
                      {unread > 0 && <Badge count={unread} size="small" />}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {conv.lastMessage?.content || "Chưa có tin nhắn"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {conv.updatedAt
                        ? dayjs(conv.updatedAt).fromNow()
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        {hasMore && (
          <div className="p-3 text-center">
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isFetching}
              className="text-pink-500 text-sm hover:underline disabled:opacity-50"
            >
              {isFetching ? "Đang tải..." : "Xem thêm"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
