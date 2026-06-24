import React, { useState, useCallback } from "react";
import { Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDebouncedCallback } from "use-debounce";

const MAX_LENGTH = 2000;

const ChatInput = ({
  disabled = false,
  placeholder = "Nhập tin nhắn...",
  onSend,
  onTyping,
  onStopTyping,
}) => {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  const debouncedStopTyping = useDebouncedCallback(() => {
    onStopTyping?.();
  }, 2000);

  const handleChange = (e) => {
    const next = e.target.value;
    if (next.length <= MAX_LENGTH) {
      setValue(next);
      if (next.trim()) {
        onTyping?.();
        debouncedStopTyping();
      } else {
        onStopTyping?.();
      }
    }
  };

  const handleSend = useCallback(async () => {
    const content = value.trim();
    if (!content || sending || disabled) return;

    setSending(true);
    onStopTyping?.();
    debouncedStopTyping.cancel();

    try {
      await onSend?.(content);
      setValue("");
    } finally {
      setSending(false);
    }
  }, [value, sending, disabled, onSend, onStopTyping, debouncedStopTyping]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-2 border-t bg-white flex gap-2 items-end">
      <Input.TextArea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || sending}
        autoSize={{ minRows: 1, maxRows: 4 }}
        className="flex-1"
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSend}
        loading={sending}
        disabled={disabled || !value.trim()}
        className="bg-pink-500"
      />
    </div>
  );
};

export default ChatInput;
