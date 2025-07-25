import React, { useState, useEffect } from "react";
import { Badge, Button, Avatar } from "antd";
import { BsFillChatFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { FaCircleDot } from "react-icons/fa6";

const mockAdmins = [
  {
    _id: "1",
    name: "Nguyễn Văn A",
    role: "ADMIN",
    avatar: {
      url: "https://i.pravatar.cc/150?img=3"
    },
    online: true,
    lastMessage: {
      content: "Chào bạn, mình có thể hỗ trợ gì?",
      createdAt: "5 phút trước",
      sender: "1",
      receiver: "user123",
      isRead: false
    }
  },
  {
    _id: "2",
    name: "Trần Thị B",
    role: "STAFF",
    avatar: {
      url: "https://i.pravatar.cc/150?img=5"
    },
    online: false,
    lastMessage: {
      content: "Bạn cần giúp đỡ gì ạ?",
      createdAt: "10 phút trước",
      sender: "2",
      receiver: "user123",
      isRead: true
    }
  }
];

const ConversationSupport = () => {
  const [isConversationOpen, setIsConversationOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [unreadCount] = useState(1);
  const [messages] = useState([
    { sender: "admin", text: "Xin chào, tôi có thể giúp gì cho bạn?", time: "1 phút trước" },
    { sender: "user", text: "Tôi cần tư vấn sản phẩm", time: "Vừa xong" }
  ]);

  return (
    <div className="fixed bottom-16 right-6 z-50">
      {!isConversationOpen && !isChatOpen && (
        <div
          onClick={() => setIsConversationOpen(true)}
          className="relative cursor-pointer animate-bounce"
        >
          <Button
            type="primary"
            shape="circle"
            size="large"
            className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-500 border-none shadow-xl flex items-center justify-center"
          >
            <Badge count={unreadCount} color="#c13338" offset={[-5, 5]}>
              <BsFillChatFill className="text-3xl text-white" />
            </Badge>
          </Button>
          <div className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-25"></div>
        </div>
      )}

      {isConversationOpen && (
        <div className="w-[320px] bg-white rounded-xl shadow-2xl overflow-hidden animate-slideIn">
          <div className="p-4 bg-gradient-to-r from-rose-500 to-rose-400 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <BsFillChatFill /> Nhân viên hỗ trợ 🎧
              </h3>
              <p className="text-xs">Chọn 1 người để bắt đầu chat</p>
            </div>
            <IoClose
              className="text-white text-2xl cursor-pointer hover:text-gray-200"
              onClick={() => setIsConversationOpen(false)}
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {mockAdmins.map((admin) => (
              <div
                key={admin._id}
                className="p-4 hover:bg-gray-100 cursor-pointer border-b"
                onClick={() => {
                  setSelectedAdmin(admin);
                  setIsConversationOpen(false);
                  setIsChatOpen(true);
                }}
              >
                <div className="flex gap-3 items-center">
                  <Badge dot status={admin.online ? "success" : "warning"}>
                    <Avatar src={admin.avatar.url} size={48} />
                  </Badge>
                  <div>
                    <h4 className="font-medium text-gray-900">{admin.name}</h4>
                    <p className="text-xs text-gray-500">
                      {admin.role === "ADMIN" ? "Quản trị viên" : "Hỗ trợ viên"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {admin.lastMessage?.content}
                    </p>
                  </div>
                  {!admin.lastMessage?.isRead && (
                    <FaCircleDot className="text-sky-400 animate-ping ml-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isChatOpen && selectedAdmin && (
        <div className="w-[320px] bg-white rounded-xl shadow-xl overflow-hidden animate-fadeIn">
          <div className="bg-gradient-to-r from-pink-500 to-pink-400 p-4 flex justify-between items-center text-white">
            <div className="flex gap-2 items-center">
              <Avatar src={selectedAdmin.avatar.url} />
              <div>
                <h4 className="font-semibold">{selectedAdmin.name}</h4>
                <p className="text-xs">{selectedAdmin.role === "ADMIN" ? "Quản trị viên" : "Hỗ trợ viên"}</p>
              </div>
            </div>
            <IoClose
              className="text-2xl cursor-pointer hover:text-gray-200"
              onClick={() => {
                setIsChatOpen(false);
                setSelectedAdmin(null);
              }}
            />
          </div>
          <div className="p-4 h-64 overflow-y-auto bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-3 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="text-xs text-gray-400 mt-1">{msg.time}</div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t bg-white">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="w-full px-3 py-2 rounded-lg border outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationSupport;
