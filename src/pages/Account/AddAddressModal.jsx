import React, { useState } from "react";
import { Modal, Form, Button, Input, Switch } from "antd";
import AddressForm from "./AddressForm";

const AddAddressModal = ({ 
  visible, 
  onClose, 
  onAddAddress,
  loading = false 
}) => {
  const [form] = Form.useForm();
  
  // State để lưu thông tin location giống ModalCheckout
  const [location, setLocation] = useState({
    province: {
      id: "",
      name: "",
    },
    district: {
      id: "",
      name: "",
    },
    ward: {
      id: "",
      name: "",
    },
  });

  const handleChangeLocation = (key, value) => {
    setLocation((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (values) => {
    try {
      const addressData = {
        province: {
          id: parseInt(location.province.id),
          name: location.province.name
        },
        district: {
          id: parseInt(location.district.id),
          name: location.district.name
        },
        ward: {
          id: parseInt(location.ward.id),
          name: location.ward.name
        },
        street: values.street,
        isDefault: values.isDefault || false,
        label: values.label || "Địa chỉ mới"
      };
      
      await onAddAddress(addressData);
      
      // Reset form sau khi thêm thành công
      form.resetFields();
      setLocation({
        province: { id: "", name: "" },
        district: { id: "", name: "" },
        ward: { id: "", name: "" },
      });
      onClose();
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setLocation({
      province: { id: "", name: "" },
      district: { id: "", name: "" },
      ward: { id: "", name: "" },
    });
    onClose();
  };

  return (
    <Modal
      title="Thêm địa chỉ mới"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          isDefault: false,
          label: "Địa chỉ mới"
        }}
      >
        <Form.Item
          label="Tên gợi nhớ địa chỉ"
          name="label"
          rules={[{ required: true, message: 'Vui lòng nhập tên gợi nhớ' }]}
        >
          <Input placeholder="Ví dụ: Nhà riêng, Văn phòng, Nhà bạn..." />
        </Form.Item>

        {/* Sử dụng AddressForm với props bổ sung để handle location */}
        <AddressForm
          form={form}
          required={true}
          location={location}
          onLocationChange={handleChangeLocation}
        />

        <Form.Item
          label="Đặt làm địa chỉ mặc định"
          name="isDefault"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Button onClick={handleCancel} className="mr-2">
            Hủy
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
          >
            Thêm địa chỉ
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAddressModal;