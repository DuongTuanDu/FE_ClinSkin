# ClinSkin Chat — Tài liệu tích hợp Frontend (React.js)

> **Trạng thái:** Backend đã triển khai theo tài liệu này (tháng 6/2026).

---

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [Xác thực (Auth)](#2-xác-thực-auth)
3. [REST API — User](#3-rest-api--user)
4. [REST API — Admin/Staff](#4-rest-api--adminstaff)
5. [Socket.IO — Realtime](#5-socketio--realtime)
6. [Data Models (TypeScript)](#6-data-models-typescript)
7. [Luồng tích hợp Frontend](#7-luồng-tích-hợp-frontend)
8. [Xử lý lỗi & Edge cases](#8-xử-lý-lỗi--edge-cases)
9. [Checklist tích hợp](#9-checklist-tích-hợp)

---

## 1. Tổng quan

### 1.1. Mô hình nghiệp vụ

- **User (khách hàng)** chat với **cửa hàng** — bất kỳ tài khoản **ADMIN** hoặc **STAFF** nào cũng có thể xem và trả lời.
- Mỗi user có **tối đa 1 conversation** đang mở với store (reopen nếu đã đóng).
- Tin nhắn được **lưu MongoDB** (REST load history) + **push realtime** qua Socket.IO.
- **SUPPORT_ROLE** không tham gia chat (chỉ ADMIN + STAFF).

### 1.2. Kiến trúc

```
┌─────────────────┐     REST (history, list)      ┌──────────────────┐
│  React User App │ ◄────────────────────────────► │                  │
└────────┬────────┘                                │   Backend API    │
         │                                         │   + Socket.IO    │
         │     Socket.IO (send, receive, typing)   │                  │
         └────────────────────────────────────────►│                  │
                                                   └────────┬─────────┘
┌─────────────────┐     REST + Socket.IO                       │
│ React Admin App │ ◄──────────────────────────────────────────┘
└─────────────────┘
```

### 1.3. Base URL

| Môi trường | REST API | Socket.IO |
|------------|----------|-----------|
| Local | `http://localhost:{PORT}` | `http://localhost:{PORT}` |
| Production | `https://api.clinskin.example` | Cùng origin với REST |

- `PORT` mặc định: `9999` (hoặc theo `.env` backend).
- Socket.IO dùng **cùng server HTTP** với Express (không cần port riêng).

### 1.4. Prefix API

| Đối tượng | Prefix |
|-----------|--------|
| User | `/api/v1/chat` |
| Admin/Staff | `/api/v1/admin/chat` |

---

## 2. Xác thực (Auth)

### 2.1. REST API

Backend dùng **2 JWT riêng biệt**, gửi qua **custom header** (không dùng `Authorization: Bearer`).

| Đối tượng | Header | Lấy token từ |
|-----------|--------|--------------|
| User | `X-User-Header: <accessToken>` | `POST /api/v1/auth/login` → `accessToken` |
| Admin/Staff | `X-Admin-Header: <accessToken>` | `POST /api/v1/admin/auth/login` → `accessToken` |

**Ví dụ login User:**

```http
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "password123" }
```

```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "674a1b2c3d4e5f6789012345",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "phone": "0901234567",
    "avatar": "https://..."
  }
}
```

**Ví dụ login Admin:**

```http
POST /api/v1/admin/auth/login
Content-Type: application/json

{ "username": "staff", "password": "staff123" }
```

```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "_id": "674a1b2c3d4e5f6789012346",
    "name": "Nhân viên",
    "username": "staff",
    "avatar": null,
    "role": "STAFF"
  }
}
```

**Role được phép chat (admin side):** `"ADMIN"` | `"STAFF"`

### 2.2. Socket.IO Auth

Kết nối socket **bắt buộc gửi JWT** trong `auth` object (không tin `userId` từ query string).

```javascript
import { io } from "socket.io-client";

// User app
const socket = io(BACKEND_URL, {
  auth: {
    token: accessToken,        // JWT từ login user
    actorType: "customer",     // cố định cho user app
  },
  transports: ["websocket", "polling"],
});

// Admin app
const socket = io(BACKEND_URL, {
  auth: {
    token: accessToken,        // JWT từ login admin
    actorType: "admin",        // cố định cho admin app
  },
  transports: ["websocket", "polling"],
});
```

| `actorType` | JWT secret | Kết quả |
|-------------|------------|---------|
| `"customer"` | `JWT_SECRET_KEY_USER` | Gán `socket.userId`, `socket.actorModel = "User"` |
| `"admin"` | `JWT_SECRET_KEY_ADMIN` | Gán `socket.adminId`, `socket.role`, `socket.actorModel = "Admin"` |

**Lỗi auth socket:** Server disconnect ngay hoặc emit `chat:error`:

```json
{ "code": "UNAUTHORIZED", "message": "Token không hợp lệ" }
```

**Admin role không hợp lệ (SUPPORT):** disconnect hoặc `chat:error` với code `FORBIDDEN`.

---

## 3. REST API — User

> Tất cả endpoint cần header `X-User-Header`.

### 3.1. Tạo hoặc lấy conversation

```http
POST /api/v1/chat/conversations
X-User-Header: <token>
```

**Body:** không cần (hoặc `{}`).

**Logic:** Nếu user đã có conversation → trả về conversation hiện có. Nếu chưa → tạo mới status `OPEN`.

**Response 200:**

```json
{
  "success": true,
  "data": {
    "_id": "conv_abc123",
    "user": "674a1b2c3d4e5f6789012345",
    "assignedTo": null,
    "status": "OPEN",
    "lastMessage": null,
    "unreadCount": {
      "user": 0,
      "admin": 0
    },
    "createdAt": "2026-06-24T10:00:00.000Z",
    "updatedAt": "2026-06-24T10:00:00.000Z"
  }
}
```

### 3.2. Lấy conversation của tôi

```http
GET /api/v1/chat/conversations/me
X-User-Header: <token>
```

**Response 200:** Giống object `data` ở trên.

**Response 404** (chưa từng chat):

```json
{
  "success": false,
  "message": "Chưa có cuộc hội thoại",
  "data": null
}
```

→ Frontend gọi `POST /conversations` để tạo.

### 3.3. Lấy lịch sử tin nhắn

```http
GET /api/v1/chat/conversations/:conversationId/messages?page=1&limit=20
X-User-Header: <token>
```

| Query | Mặc định | Mô tả |
|-------|----------|-------|
| `page` | `1` | Trang (pagination) |
| `limit` | `20` | Số tin/trang |
| `before` | — | Optional: `messageId` — load tin cũ hơn (infinite scroll) |

**Response 200:**

```json
{
  "success": true,
  "data": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 45,
    "hasMore": true,
    "messages": [
      {
        "_id": "msg_001",
        "conversation": "conv_abc123",
        "sender": "674a1b2c3d4e5f6789012345",
        "senderModel": "User",
        "content": "Xin chào, tôi cần tư vấn sản phẩm",
        "type": "TEXT",
        "attachments": [],
        "isRead": true,
        "createdAt": "2026-06-24T10:01:00.000Z",
        "updatedAt": "2026-06-24T10:01:00.000Z"
      },
      {
        "_id": "msg_002",
        "conversation": "conv_abc123",
        "sender": "674a1b2c3d4e5f6789012346",
        "senderModel": "Admin",
        "content": "Chào bạn, ClinSkin có thể giúp gì?",
        "type": "TEXT",
        "attachments": [],
        "isRead": false,
        "createdAt": "2026-06-24T10:02:00.000Z",
        "updatedAt": "2026-06-24T10:02:00.000Z"
      }
    ]
  }
}
```

**Thứ tự hiển thị:** `messages` trả về **cũ → mới** (ascending `createdAt`). Frontend render từ trên xuống.

### 3.4. Đánh dấu đã đọc

```http
PUT /api/v1/chat/conversations/:conversationId/read
X-User-Header: <token>
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "conversationId": "conv_abc123",
    "unreadCount": { "user": 0, "admin": 3 }
  }
}
```

→ Reset `unreadCount.user` về `0`.

### 3.5. Gửi tin nhắn (REST fallback)

Dùng khi socket disconnect hoặc gửi thất bại. **Ưu tiên gửi qua Socket** (`chat:send`).

```http
POST /api/v1/chat/conversations/:conversationId/messages
X-User-Header: <token>
Content-Type: application/json

{
  "content": "Nội dung tin nhắn",
  "type": "TEXT"
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "message": { /* Message object */ },
    "conversation": { /* Conversation object đã cập nhật */ }
  }
}
```

---

## 4. REST API — Admin/Staff

> Tất cả endpoint cần header `X-Admin-Header`.  
> Chỉ role `ADMIN` và `STAFF` được truy cập.

### 4.1. Danh sách conversations

```http
GET /api/v1/admin/chat/conversations?status=OPEN&page=1&limit=20&search=
X-Admin-Header: <token>
```

| Query | Mô tả |
|-------|-------|
| `status` | `OPEN` \| `CLOSED` \| `PENDING` (optional) |
| `page`, `limit` | Pagination |
| `search` | Tìm theo tên/email user (optional) |

**Response 200:**

```json
{
  "success": true,
  "data": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 12,
    "hasMore": false,
    "conversations": [
      {
        "_id": "conv_abc123",
        "user": {
          "_id": "674a1b2c3d4e5f6789012345",
          "name": "Nguyễn Văn A",
          "email": "user@example.com",
          "avatar": "https://..."
        },
        "assignedTo": {
          "_id": "674a1b2c3d4e5f6789012346",
          "name": "Nhân viên",
          "role": "STAFF"
        },
        "status": "OPEN",
        "lastMessage": {
          "content": "Xin chào",
          "senderModel": "User",
          "sender": "674a1b2c3d4e5f6789012345",
          "createdAt": "2026-06-24T10:01:00.000Z"
        },
        "unreadCount": { "user": 0, "admin": 2 },
        "updatedAt": "2026-06-24T10:05:00.000Z"
      }
    ]
  }
}
```

**Sort mặc định:** `updatedAt` descending (conversation có tin mới nhất lên đầu).

### 4.2. Chi tiết conversation

```http
GET /api/v1/admin/chat/conversations/:conversationId
X-Admin-Header: <token>
```

### 4.3. Lấy tin nhắn

```http
GET /api/v1/admin/chat/conversations/:conversationId/messages?page=1&limit=20
X-Admin-Header: <token>
```

→ Response format giống User API (mục 3.3).

### 4.4. Đánh dấu đã đọc (admin)

```http
PUT /api/v1/admin/chat/conversations/:conversationId/read
X-Admin-Header: <token>
```

→ Reset `unreadCount.admin` về `0`.

### 4.5. Gán nhân viên phụ trách

```http
PUT /api/v1/admin/chat/conversations/:conversationId/assign
X-Admin-Header: <token>
```

**Body:** không cần — tự gán `assignedTo = admin đang login`.

**Lưu ý:** Khi admin reply lần đầu, backend có thể **auto-assign** mà không cần gọi endpoint này.

### 4.6. Đóng conversation

```http
PUT /api/v1/admin/chat/conversations/:conversationId/close
X-Admin-Header: <token>
```

**Response:** `status` → `"CLOSED"`.

### 4.7. Gửi tin nhắn (REST fallback)

```http
POST /api/v1/admin/chat/conversations/:conversationId/messages
X-Admin-Header: <token>
Content-Type: application/json

{
  "content": "Chúng tôi sẽ hỗ trợ bạn ngay",
  "type": "TEXT"
}
```

---

## 5. Socket.IO — Realtime

### 5.1. Rooms (server tự quản lý)

| Room | Ai được join | Mục đích |
|------|--------------|----------|
| `user:{userId}` | Socket user | Push tin admin → user khi user không mở room conversation |
| `admin:chat` | ADMIN + STAFF | Broadcast conversation mới / cập nhật list |
| `conversation:{conversationId}` | User + Admin đang mở chat | Realtime trong 1 hội thoại |

- Admin **tự động join** `admin:chat` khi connect.
- User **tự động join** `user:{userId}` khi connect.
- Cả hai cần emit `chat:join` khi mở màn hình chat cụ thể.

### 5.2. Events — Client → Server

#### `chat:join`

Join room conversation để nhận tin realtime.

```javascript
socket.emit("chat:join", { conversationId: "conv_abc123" });
```

**Server validate:** User chỉ join conversation của mình; Admin join bất kỳ conversation nào.

**Ack (optional):**

```javascript
socket.emit("chat:join", { conversationId }, (response) => {
  // { success: true } hoặc { success: false, message: "..." }
});
```

#### `chat:leave`

```javascript
socket.emit("chat:leave", { conversationId: "conv_abc123" });
```

Gọi khi rời màn chat (unmount component).

#### `chat:send`

**Cách gửi chính** — lưu DB + broadcast.

```javascript
socket.emit("chat:send", {
  conversationId: "conv_abc123",
  content: "Nội dung tin nhắn",
  type: "TEXT",           // optional, default "TEXT"
});
```

**Ack callback:**

```javascript
socket.emit("chat:send", payload, (response) => {
  if (response.success) {
    // response.data = { message, conversation }
  } else {
    // response.message = lỗi
  }
});
```

#### `chat:read`

```javascript
socket.emit("chat:read", { conversationId: "conv_abc123" });
```

Tương đương REST `PUT .../read` nhưng realtime hơn.

#### `chat:typing` / `chat:stopTyping`

```javascript
socket.emit("chat:typing", { conversationId: "conv_abc123" });
socket.emit("chat:stopTyping", { conversationId: "conv_abc123" });
```

Gọi `stopTyping` sau debounce ~2s hoặc khi gửi tin.

### 5.3. Events — Server → Client

#### `chat:message`

Tin nhắn mới (từ mình hoặc người kia).

```javascript
socket.on("chat:message", (payload) => {
  // payload = { message: Message, conversation: Conversation }
});
```

**Frontend xử lý:**
- Nếu `message._id` đã có trong state → bỏ qua (dedupe).
- Cập nhật `lastMessage` và `unreadCount` từ `conversation`.
- Nếu đang xem conversation đó → scroll xuống + gọi `chat:read`.

#### `chat:conversationUpdated`

Cập nhật sidebar list (admin) hoặc badge (user).

```javascript
socket.on("chat:conversationUpdated", (payload) => {
  // payload = { conversation: Conversation }
});
```

#### `chat:unread`

```javascript
socket.on("chat:unread", (payload) => {
  // payload = { conversationId, unreadCount: { user, admin } }
});
```

#### `chat:typing`

```javascript
socket.on("chat:typing", (payload) => {
  // payload = { conversationId, sender: { _id, senderModel, name? } }
});
```

Không nhận event typing của chính mình.

#### `chat:error`

```javascript
socket.on("chat:error", (payload) => {
  // { code: "FORBIDDEN" | "NOT_FOUND" | "VALIDATION" | "UNAUTHORIZED", message: "..." }
});
```

### 5.4. Sequence — User gửi tin

```
User FE                    Backend                     Admin FE
   |                          |                            |
   |-- chat:send ------------>|                            |
   |                          |-- save Message to DB       |
   |                          |-- update Conversation      |
   |<-- chat:message ---------|                            |
   |                          |-- chat:message ----------->| (room conversation)
   |                          |-- chat:conversationUpdated>| (room admin:chat)
   |                          |-- chat:unread ------------>| (unreadCount.admin)
```

### 5.5. Sequence — Admin trả lời

```
Admin FE                   Backend                     User FE
   |                          |                            |
   |-- chat:send ------------>|                            |
   |                          |-- save + auto-assign       |
   |<-- chat:message ---------|                            |
   |                          |-- chat:message ----------->| (room conversation + user:{id})
   |                          |-- chat:unread ------------>| (unreadCount.user)
```

### 5.6. Reconnect strategy (Frontend)

```javascript
socket.on("connect", () => {
  // 1. Admin: đã auto-join admin:chat
  // 2. Re-join conversation đang mở
  if (activeConversationId) {
    socket.emit("chat:join", { conversationId: activeConversationId });
  }
  // 3. Sync lại messages qua REST (tránh miss tin khi offline)
  refetchMessages(activeConversationId);
});
```

---

## 6. Data Models (TypeScript)

Copy vào frontend để type-check:

```typescript
// Enums
type ConversationStatus = "OPEN" | "CLOSED" | "PENDING";
type MessageType = "TEXT" | "IMAGE";
type SenderModel = "User" | "Admin";
type AdminChatRole = "ADMIN" | "STAFF";

// Models
interface UnreadCount {
  user: number;   // tin từ admin chưa đọc (phía user)
  admin: number;  // tin từ user chưa đọc (phía admin)
}

interface LastMessage {
  content: string;
  senderModel: SenderModel;
  sender: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  user: string | UserPreview;
  assignedTo?: string | AdminPreview | null;
  status: ConversationStatus;
  lastMessage?: LastMessage | null;
  unreadCount: UnreadCount;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  conversation: string;
  sender: string;
  senderModel: SenderModel;
  content: string;
  type: MessageType;
  attachments: Attachment[];
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserPreview {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

interface AdminPreview {
  _id: string;
  name: string;
  role: AdminChatRole;
  avatar?: string | null;
}

interface Attachment {
  url: string;
  type: string;
}

// Socket payloads
interface ChatSendPayload {
  conversationId: string;
  content: string;
  type?: MessageType;
}

interface ChatMessageEvent {
  message: Message;
  conversation: Conversation;
}

interface ChatUnreadEvent {
  conversationId: string;
  unreadCount: UnreadCount;
}

interface ChatErrorEvent {
  code: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION" | "INTERNAL";
  message: string;
}

// API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

### Phân biệt tin nhắn của mình

```typescript
function isOwnMessage(message: Message, currentUserId: string, actorModel: SenderModel): boolean {
  return message.sender === currentUserId && message.senderModel === actorModel;
}
```

- User app: `actorModel = "User"`, `currentUserId = user._id`
- Admin app: `actorModel = "Admin"`, `currentUserId = admin._id`

---

## 7. Luồng tích hợp Frontend

### 7.1. User App (React)

```
1. Login → lưu accessToken + user._id
2. Vào trang Chat:
   a. GET /api/v1/chat/conversations/me
   b. Nếu 404 → POST /api/v1/chat/conversations
3. Connect socket (auth.token + actorType: "customer")
4. socket.emit("chat:join", { conversationId })
5. GET /api/v1/chat/conversations/:id/messages?page=1&limit=20
6. Render messages
7. User gửi tin → socket.emit("chat:send", ...)
8. socket.on("chat:message") → append nếu chưa có
9. Khi mở chat / nhận tin mới → socket.emit("chat:read", ...)
10. Hiển thị badge unreadCount.user trên icon chat
11. Infinite scroll: GET messages?before=oldestMessageId
12. Unmount → socket.emit("chat:leave") + optional disconnect
```

### 7.2. Admin App (React)

```
1. Login admin → lưu accessToken + admin._id + role
2. Connect socket (auth.token + actorType: "admin")
3. GET /api/v1/admin/chat/conversations (sidebar)
4. socket.on("chat:conversationUpdated") → cập nhật/reorder sidebar
5. Chọn conversation:
   a. socket.emit("chat:join", { conversationId })
   b. GET messages
   c. socket.emit("chat:read", ...)
6. Admin reply → socket.emit("chat:send", ...)
7. Badge tổng unread = sum(conversations[].unreadCount.admin)
8. Optional: PUT assign, PUT close
```

### 7.3. Gợi ý React hooks

```typescript
// hooks/useChatSocket.ts
// - connect on mount với token từ auth context
// - expose: sendMessage, joinConversation, leaveConversation, markAsRead
// - return: messages, conversation, isConnected, typingUsers

// hooks/useChatMessages.ts
// - fetch initial messages REST
// - merge với socket events
// - handle pagination (before cursor)

// context/ChatContext.tsx
// - socket instance singleton
// - unread count global state
```

### 7.4. Optimistic UI (khuyến nghị)

Khi `chat:send`:

```typescript
const tempId = `temp_${Date.now()}`;
addMessageOptimistic({ _id: tempId, content, senderModel: "User", status: "sending" });

socket.emit("chat:send", payload, (res) => {
  if (res.success) {
    replaceMessage(tempId, res.data.message);
  } else {
    markMessageFailed(tempId);
  }
});
```

Khi nhận `chat:message` có `_id` thật → xóa bản optimistic trùng `content` + timestamp gần.

---

## 8. Xử lý lỗi & Edge cases

### 8.1. HTTP status codes

| Code | Ý nghĩa |
|------|---------|
| `200` | Thành công |
| `201` | Tạo message thành công |
| `400` | Validation lỗi (content rỗng, quá dài) |
| `401` | Thiếu/sai token |
| `403` | Không có quyền (user vào conversation người khác) |
| `404` | Conversation không tồn tại |
| `500` | Lỗi server |

### 8.2. Validation rules

| Field | Rule |
|-------|------|
| `content` | Required, 1–2000 ký tự (TEXT) |
| `type` | `"TEXT"` (phase 1) |
| `conversationId` | Valid MongoDB ObjectId |

### 8.3. Conversation CLOSED

- User vẫn **đọc được** lịch sử.
- User gửi tin mới → backend **tự reopen** (`status: OPEN`) hoặc trả `400` — frontend nên hiển thị nút "Bắt đầu chat lại" gọi `POST /conversations`.

### 8.4. Duplicate messages

Socket có thể deliver tin 2 lần (reconnect). **Dedupe theo `message._id`**.

### 8.5. Offline

- Tin gửi khi offline → queue local hoặc fallback `POST .../messages`.
- Khi online lại → `refetch` messages + conversations.

### 8.6. Multiple tabs

User mở 2 tab → 2 socket cùng `userId` → cả 2 đều nhận `chat:message` (backend hỗ trợ multi-connection).

---

## 9. Checklist tích hợp

### User App

- [ ] Lưu `accessToken` sau login
- [ ] Axios/fetch interceptor gắn `X-User-Header`
- [ ] Socket connect với `auth: { token, actorType: "customer" }`
- [ ] Tạo/lấy conversation trước khi chat
- [ ] Load history REST + listen `chat:message`
- [ ] Gửi tin qua `chat:send` (fallback REST)
- [ ] `chat:read` khi mở chat
- [ ] Badge `unreadCount.user`
- [ ] Typing indicator (`chat:typing`)
- [ ] Reconnect + re-join room
- [ ] Dedupe messages by `_id`

### Admin App

- [ ] Lưu `accessToken` sau login admin
- [ ] Axios interceptor `X-Admin-Header`
- [ ] Socket `actorType: "admin"`
- [ ] List conversations + search/filter
- [ ] Sidebar realtime qua `chat:conversationUpdated`
- [ ] Badge tổng `unreadCount.admin`
- [ ] Reply + auto-assign hiển thị `assignedTo`
- [ ] Đóng conversation (optional UI)
- [ ] Chỉ hiện menu chat nếu `role === "ADMIN" || role === "STAFF"`

---

## Phụ lục — Ví dụ code React nhanh

### Axios instance

```typescript
// api/chatApi.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const userChatApi = axios.create({
  baseURL: `${API_URL}/api/v1/chat`,
});

userChatApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) config.headers["X-User-Header"] = token;
  return config;
});

export const adminChatApi = axios.create({
  baseURL: `${API_URL}/api/v1/admin/chat`,
});

adminChatApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers["X-Admin-Header"] = token;
  return config;
});
```

### Socket hook tối giản

```typescript
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useChatSocket(token: string, actorType: "customer" | "admin") {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token, actorType },
    });

    socketRef.current = socket;

    socket.on("connect", () => console.log("Chat socket connected"));
    socket.on("chat:error", (err) => console.error("Chat error:", err));

    return () => {
      socket.disconnect();
    };
  }, [token, actorType]);

  return socketRef;
}
```

---

**Liên hệ backend:** Khi backend triển khai xong, kiểm tra lại endpoint thực tế bằng Postman/Thunder Client trước khi go-live. Tài liệu này là contract chuẩn để hai phía đồng bộ.
