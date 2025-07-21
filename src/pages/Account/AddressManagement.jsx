import React, { useState } from "react";
import { Button, Card, Tag, Space, Popconfirm, message, Modal, Form, Input, Switch } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/redux/auth/auth.slice";
import AddressForm from "./AddressForm";
import AddAddressModal from "./AddAddressModal";
import { 
  useCreateAddressMutation, 
  useDeleteAddressMutation, 
  useGetAllAddressQuery, 
  useUpdateAddressMutation,
  useSetDefaultAddressMutation 
} from "@/redux/address/address.query";

const AddressManagement = ({ userInfo, isAuthenticated }) => {
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editForm] = Form.useForm();
  const [location, setLocation] = useState({
    province: { id: "", name: "" },
    district: { id: "", name: "" },
    ward: { id: "", name: "" },
  });

  // API hooks
  const { data: addresses = [], isLoading, refetch } = useGetAllAddressQuery();
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();
  const [setDefaultAddress, { isLoading: isSettingDefault }] = useSetDefaultAddressMutation();

  const handleChangeLocation = (key, value) => {
    setLocation((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddAddress = async (addressData) => {
    try {
      console.log("Sending address data:", addressData);
      const result = await createAddress(addressData).unwrap();
      console.log("Create address result:", result);
      
      // Cập nhật địa chỉ mặc định vào userInfo nếu cần
      if (addressData.isDefault) {
        const updatedUserInfo = {
          ...userInfo,
          address: {
            province: addressData.province.id,
            district: addressData.district.id,
            ward: addressData.ward.id,
            detail: addressData.street
          }
        };
        dispatch(setUserInfo(updatedUserInfo));
      }
      
      message.success("Thêm địa chỉ thành công!");
      
      // Refetch để cập nhật danh sách
      refetch();
      
    } catch (error) {
      console.error("Error adding address:", error);
      message.error("Thêm địa chỉ thất bại!");
      throw error;
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    
    // Set location state cho edit form - kiểm tra cấu trúc data
    console.log("Editing address:", address);
    
    if (address.province && address.district && address.ward) {
      setLocation({
        province: {
          id: address.province.id.toString(),
          name: address.province.name
        },
        district: {
          id: address.district.id.toString(), 
          name: address.district.name
        },
        ward: {
          id: address.ward.id.toString(),
          name: address.ward.name
        }
      });
      
      editForm.setFieldsValue({
        label: address.label,
        province: address.province.id,
        district: address.district.id,
        ward: address.ward.id.toString(),
        street: address.street,
        isDefault: address.isDefault
      });
    }
    
    setShowEditModal(true);
  };

  const handleUpdateAddress = async (values) => {
    try {
      const updateData = {
        id: editingAddress._id || editingAddress.id,
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
        label: values.label,
        isDefault: values.isDefault || false
      };

      console.log("Updating address with data:", updateData);
      
      await updateAddress(updateData).unwrap();

      // Cập nhật vào userInfo nếu đặt làm mặc định
      if (values.isDefault) {
        const updatedUserInfo = {
          ...userInfo,
          address: {
            province: location.province.id,
            district: location.district.id,
            ward: location.ward.id,
            detail: values.street
          }
        };
        dispatch(setUserInfo(updatedUserInfo));
      }

      setShowEditModal(false);
      setEditingAddress(null);
      editForm.resetFields();
      setLocation({
        province: { id: "", name: "" },
        district: { id: "", name: "" },
        ward: { id: "", name: "" },
      });
      
      message.success("Cập nhật địa chỉ thành công!");
      refetch();
      
    } catch (error) {
      console.error("Error updating address:", error);
      message.error("Cập nhật địa chỉ thất bại!");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const addressToDelete = addresses.find(addr => 
        (addr._id || addr.id) === addressId
      );
      
      // Không cho xóa địa chỉ mặc định nếu chỉ có 1 địa chỉ
      if (addressToDelete?.isDefault && addresses.length === 1) {
        message.warning("Không thể xóa địa chỉ mặc định duy nhất!");
        return;
      }
      
      await deleteAddress(addressId).unwrap();
      
      message.success("Xóa địa chỉ thành công!");
      refetch();
      
    } catch (error) {
      console.error("Error deleting address:", error);
      message.error("Xóa địa chỉ thất bại!");
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const addressToSetDefault = addresses.find(addr => 
        (addr._id || addr.id) === addressId
      );
      
      if (addressToSetDefault) {
        console.log("Setting default address for ID:", addressId);
        
        // Sử dụng API endpoint riêng cho set default
        await setDefaultAddress(addressId).unwrap();
        
        // Cập nhật vào userInfo
        const updatedUserInfo = {
          ...userInfo,
          address: {
            province: addressToSetDefault.province.id,
            district: addressToSetDefault.district.id,
            ward: addressToSetDefault.ward.id,
            detail: addressToSetDefault.street
          }
        };
        dispatch(setUserInfo(updatedUserInfo));
        
        message.success("Đặt địa chỉ mặc định thành công!");
        refetch();
      }
      
    } catch (error) {
      console.error("Error setting default address:", error);
      message.error("Đặt địa chỉ mặc định thất bại!");
    }
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setEditingAddress(null);
    editForm.resetFields();
    setLocation({
      province: { id: "", name: "" },
      district: { id: "", name: "" },
      ward: { id: "", name: "" },
    });
  };

  if (!isAuthenticated) {
    return <p>Vui lòng đăng nhập để quản lý địa chỉ.</p>;
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg">
        <div className="text-center py-8">
          <p>Đang tải danh sách địa chỉ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <EnvironmentOutlined />
          Quản lý địa chỉ
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAddModal(true)}
          loading={isCreating}
        >
          Thêm địa chỉ mới
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="text-center py-8">
          <div className="text-gray-500">
            <EnvironmentOutlined className="text-4xl mb-4" />
            <h3>Chưa có địa chỉ nào</h3>
            <p>Thêm địa chỉ đầu tiên để thuận tiện cho việc đặt hàng</p>
            <Button 
              type="primary" 
              className="mt-4"
              onClick={() => setShowAddModal(true)}
              loading={isCreating}
            >
              Thêm địa chỉ ngay
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card 
              key={address._id || address.id} 
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-lg">{address.label}</span>
                    {address.isDefault && (
                      <Tag color="blue">Mặc định</Tag>
                    )}
                  </div>
                  
                  <div className="text-gray-600 space-y-1">
                    <p className="font-medium">{address.street}</p>
                    <p>
                      {address?.ward?.name}, {address?.district?.name}, {address?.province?.name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Space>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => handleEditAddress(address)}
                      loading={isUpdating}
                    >
                      Sửa
                    </Button>
                    
                    <Popconfirm
                      title="Xóa địa chỉ"
                      description="Bạn có chắc chắn muốn xóa địa chỉ này?"
                      onConfirm={() => handleDeleteAddress(address._id || address.id)}
                      okText="Xóa"
                      cancelText="Hủy"
                      disabled={address.isDefault && addresses.length === 1}
                    >
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        size="small"
                        danger
                        disabled={address.isDefault && addresses.length === 1}
                        loading={isDeleting}
                      />
                    </Popconfirm>
                  </Space>

                  {!address.isDefault && (
                    <Button
                      type="link"
                      size="small"
                      onClick={() => handleSetDefault(address._id || address.id)}
                      loading={isSettingDefault}
                    >
                      Đặt làm mặc định
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal thêm địa chỉ */}
      <AddAddressModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddAddress={handleAddAddress}
        loading={isCreating}
      />

      {/* Modal sửa địa chỉ */}
      <Modal
        title="Cập nhật địa chỉ"
        open={showEditModal}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateAddress}
        >
          <Form.Item
            label="Tên gợi nhớ địa chỉ"
            name="label"
            rules={[{ required: true, message: 'Vui lòng nhập tên gợi nhớ' }]}
          >
            <Input 
              placeholder="Ví dụ: Nhà riêng, Văn phòng, Nhà bạn..." 
            />
          </Form.Item>

          <AddressForm
            form={editForm}
            initialValues={editingAddress}
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
            <Button 
              onClick={handleModalClose} 
              className="mr-2"
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isUpdating}
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddressManagement;