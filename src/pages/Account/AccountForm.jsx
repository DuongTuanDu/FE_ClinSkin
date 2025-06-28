import React, { useState, useEffect } from "react";
import { Button, Input, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUpdateAccountUserMutation } from "@/redux/user/user.query";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "sub-vn";

const { Option } = Select;

const AccountForm = ({ userInfo, isAuthenticated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarBase64, setAvatarBase64] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const [updateAccountUser, { isLoading }] = useUpdateAccountUserMutation();

  // Fallback: Chuyển name => code nếu DB cũ
  const findProvinceCodeByName = (name) => {
    const found = getProvinces().find((p) => p.name === name);
    return found?.code || "";
  };

  const findDistrictCodeByName = (provinceCode, name) => {
    const found = getDistrictsByProvinceCode(provinceCode).find(
      (d) => d.name === name
    );
    return found?.code || "";
  };

  const findWardCodeByName = (districtCode, name) => {
    const found = getWardsByDistrictCode(districtCode).find(
      (w) => w.name === name
    );
    return found?.code || "";
  };

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || "");
      setEmail(userInfo.email || "");
      setPhone(userInfo.phone || "");
      setPreviewAvatar(userInfo.avatar?.url || null);

      let p = userInfo.address?.province || "";
      let d = userInfo.address?.district || "";
      let w = userInfo.address?.ward || "";

      if (p && isNaN(p)) {
        p = findProvinceCodeByName(p);
      }
      if (d && isNaN(d)) {
        d = findDistrictCodeByName(p, d);
      }
      if (w && isNaN(w)) {
        w = findWardCodeByName(d, w);
      }

      setProvince(p);
      setDistrict(d);
      setWard(w);

      if (p) setDistrictList(getDistrictsByProvinceCode(p));
      if (d) setWardList(getWardsByDistrictCode(d));
    }
  }, [userInfo]);

  useEffect(() => {
    if (province) {
      setDistrictList(getDistrictsByProvinceCode(province));
    } else {
      setDistrictList([]);
    }
    setDistrict("");
    setWard("");
  }, [province]);

  useEffect(() => {
    if (district) {
      setWardList(getWardsByDistrictCode(district));
    } else {
      setWardList([]);
    }
    setWard("");
  }, [district]);

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
      await updateAccountUser({
        id: userInfo._id,
        name,
        email,
        phone,
        avatar: avatarBase64 || userInfo.avatar,
        address: {
          province,
          district,
          ward,
          detail: "", // Có thể cho nhập thêm nếu muốn
        },
      }).unwrap();
      message.success("Cập nhật thành công!");
      window.location.reload();
    } catch (err) {
      console.error("Update error:", err);
      message.error("Đã xảy ra lỗi khi cập nhật.");
    }
  };

  const provinceList = getProvinces();

  if (!isAuthenticated)
    return <div>Không thể tải thông tin tài khoản.</div>;

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
      <Input
        className="mb-2"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Số điện thoại"
      />

      <Select
        className="mb-2 w-full"
        value={province}
        onChange={(value) => setProvince(value)}
        placeholder="Chọn Tỉnh / Thành phố"
      >
        {provinceList.map((p) => (
          <Option key={p.code} value={p.code}>
            {p.name}
          </Option>
        ))}
      </Select>

      <Select
        className="mb-2 w-full"
        value={district}
        onChange={(value) => setDistrict(value)}
        placeholder="Chọn Quận / Huyện"
        disabled={!province}
      >
        {districtList.map((d) => (
          <Option key={d.code} value={d.code}>
            {d.name}
          </Option>
        ))}
      </Select>

      <Select
        className="mb-2 w-full"
        value={ward}
        onChange={(value) => setWard(value)}
        placeholder="Chọn Phường / Xã"
        disabled={!district}
      >
        {wardList.map((w) => (
          <Option key={w.code} value={w.code}>
            {w.name}
          </Option>
        ))}
      </Select>

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
