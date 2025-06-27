import React, { useState, useEffect } from "react";
import { Button, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUpdateAccountUserMutation } from "@/redux/user/user.query";

const AccountForm = ({ userInfo, isAuthenticated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarBase64, setAvatarBase64] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const [updateAccountUser, { isLoading }] = useUpdateAccountUserMutation();

  // Đồng bộ ban đầu khi nhận userInfo
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || "");
      setEmail(userInfo.email || "");
      setPreviewAvatar(userInfo.avatar?.url || null);
    }
  }, [userInfo]);

  if (!isAuthenticated) return <div>Không thể tải thông tin tài khoản.</div>;

  const handleFileChange = ({ file }) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarBase64(reader.result);
      setPreviewAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    try {
      const response = await updateAccountUser({
        id: userInfo._id,
        name,
        email,
        avatar: avatarBase64 || userInfo.avatar,
      }).unwrap();
      message.success("Cập nhật thành công!");
      window.location.reload();
    } catch (err) {
      console.error("Update error:", err);
      message.error("Đã xảy ra lỗi khi cập nhật.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>

      {previewAvatar && (
        <img
          src={previewAvatar}
          alt="Avatar preview"
          className="w-24 h-24 rounded-full object-cover mb-4 border"
        />
      )}

      <Input
        className="mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Họ và tên"
      />

      <Input
        className="mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <Upload
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleFileChange}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />}>Tải ảnh đại diện mới</Button>
      </Upload>

      <Button
        type="primary"
        onClick={handleUpdate}
        className="mt-4 w-full"
        loading={isLoading}
      >
        Cập nhật
      </Button>
    </div>
  );
};

export default AccountForm;
