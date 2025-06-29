import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Upload, Avatar, message } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
  getProvinces,
  getDistrictsByProvinceId,
  getWardsByDistrictId,
} from "@/axios/ghn.api.js";
import { useUpdateAccountUserMutation } from "@/redux/user/user.query";

const { Option } = Select;

const AccountForm = ({ userInfo, isAuthenticated }) => {
  const [form] = Form.useForm();
  const [updateAccountUser, { isLoading }] = useUpdateAccountUserMutation();

  const [avatarBase64, setAvatarBase64] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await getProvinces();
      setProvinces(data);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (userInfo) {
      const address = userInfo.address || {};
      form.setFieldsValue({
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        province: address.province,
        district: address.district,
        ward: address.ward,
      });
      setPreviewAvatar(userInfo.avatar?.url || null);

      if (address.province) {
        getDistrictsByProvinceId(parseInt(address.province)).then(setDistricts);
      }
      if (address.district) {
        getWardsByDistrictId(parseInt(address.district)).then(setWards);
      }
    }
  }, [userInfo]);

  const handleProvinceChange = async (provinceId) => {
    const districts = await getDistrictsByProvinceId(parseInt(provinceId));
    setDistricts(districts);
    form.setFieldsValue({ district: undefined, ward: undefined });
    setWards([]);
  };

  const handleDistrictChange = async (districtId) => {
    const wards = await getWardsByDistrictId(parseInt(districtId));
    setWards(wards);
    form.setFieldsValue({ ward: undefined });
  };

  const handleFileChange = ({ file }) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarBase64(reader.result);
      setPreviewAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onFinish = async (values) => {
    try {
      await updateAccountUser({
        id: userInfo._id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        avatar: avatarBase64 || userInfo.avatar,
        address: {
          province: values.province,
          district: values.district,
          ward: values.ward,
          detail: "",
        },
      }).unwrap();

      message.success("Cập nhật thành công!");
      window.location.reload();
    } catch (err) {
      console.error("Update failed:", err);
      message.error("Cập nhật thất bại.");
    }
  };

  if (!isAuthenticated) {
    return <p>Không thể tải thông tin tài khoản.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Thông tin cá nhân</h2>

      <div className="flex justify-center mb-4">
        <Avatar size={80} src={previewAvatar} icon={<UserOutlined />} />
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{}}
      >
        <Form.Item label="Họ và tên" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ type: "email" }]}>
          <Input disabled />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone">
          <Input />
        </Form.Item>

        <Form.Item label="Tỉnh / Thành phố" name="province" rules={[{ required: true }]}>
          <Select onChange={handleProvinceChange} placeholder="Chọn tỉnh/thành">
            {provinces?.map((p) => (
              <Option key={p.ProvinceID} value={p.ProvinceID.toString()}>
                {p.ProvinceName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Quận / Huyện" name="district" rules={[{ required: true }]}>
          <Select onChange={handleDistrictChange} placeholder="Chọn quận/huyện" disabled={!districts.length}>
            {districts?.map((d) => (
              <Option key={d.DistrictID} value={d.DistrictID.toString()}>
                {d.DistrictName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Phường / Xã" name="ward" rules={[{ required: true }]}>
          <Select placeholder="Chọn phường/xã" disabled={!wards.length}>
            {wards?.map((w) => (
              <Option key={w.WardCode} value={w.WardCode.toString()}>
                {w.WardName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Ảnh đại diện">
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleFileChange}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Tải ảnh mới</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="w-full"
          >
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AccountForm;
