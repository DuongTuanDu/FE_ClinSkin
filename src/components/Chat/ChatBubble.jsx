import React from "react";
import dayjs from "@utils/dayjsTz";
import { getMessageSide, getSenderLabel } from "@/utils/chatHelpers";

const ChatBubble = ({
  message,
  currentUserId,
  senderModel,
  viewAs = "customer",
  showSenderLabel = false,
  conversation = null,
  adminInfo = null,
}) => {
  const side = getMessageSide(message, { viewAs, currentUserId, senderModel });
  const isRight = side === "right";
  const isFailed = message._status === "failed";
  const isSending = message._isOptimistic && !isFailed;

  const senderLabel =
    showSenderLabel && viewAs === "admin"
      ? getSenderLabel(message, {
        viewAs,
        currentUserId,
        conversation,
        adminInfo,
      })
      : null;

  const isStoreSide = viewAs === "admin" && isRight;

  return (
    <div className={`mb-3 ${isRight ? "text-right" : "text-left"}`}>
      {senderLabel && (
        <p
          className={`text-[11px] font-medium mb-1 ${isStoreSide ? "text-pink-600" : "text-gray-500"
            }`}
        >
          {senderLabel}
        </p>
      )}
      <div
        className={`inline-block max-w-[85%] px-3 py-2 rounded-lg text-sm text-left ${isRight
            ? "bg-pink-500 text-white"
            : "bg-gray-200 text-gray-800"
          } ${isFailed ? "opacity-60 border border-red-400" : ""}`}
      >
        {message.content}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {isSending && "Đang gửi... "}
        {isFailed && "Gửi thất bại · "}
        {message.createdAt ? dayjs(message.createdAt).fromNow() : "Vừa xong"}
      </div>
    </div>
  );
};

export default ChatBubble;
