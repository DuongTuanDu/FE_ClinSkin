import React, { useEffect, useState } from "react";
import { Form, Select, Input } from "antd";
import {
  getProvinces,
  getDistrictsByProvinceId,
  getWardsByDistrictId,
} from "@/redux/profile/ghn.api";

const { Option } = Select;

const AddressForm = ({ 
  form, 
  initialValues = {}, 
  required = true,
  disabled = false,
  onAddressChange = () => {},
  // Thêm props để support location pattern
  location,
  onLocationChange
}) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Load provinces khi component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Load districts và wards khi có initialValues
  useEffect(() => {
    if (initialValues.province) {
      getDistrictsByProvinceId(parseInt(initialValues.province))
        .then(setDistricts)
        .catch(console.error);
    }
    if (initialValues.district) {
      getWardsByDistrictId(parseInt(initialValues.district))
        .then(setWards)
        .catch(console.error);
    }
  }, [initialValues.province, initialValues.district]);

  // Load districts khi location.province thay đổi
  useEffect(() => {
    if (location?.province?.id) {
      getDistrictsByProvinceId(parseInt(location.province.id))
        .then(setDistricts)
        .catch(console.error);
    } else {
      setDistricts([]);
    }
  }, [location?.province?.id]);

  // Load wards khi location.district thay đổi
  useEffect(() => {
    if (location?.district?.id) {
      getWardsByDistrictId(parseInt(location.district.id))
        .then(setWards)
        .catch(console.error);
    } else {
      setWards([]);
    }
  }, [location?.district?.id]);

  const handleProvinceChange = async (provinceId) => {
    try {
      const selected = provinces.find((p) => p.ProvinceID === provinceId);
      
      if (selected && onLocationChange) {
        // Cập nhật location state theo pattern ModalCheckout
        onLocationChange("province", {
          id: selected.ProvinceID,
          name: selected.ProvinceName,
        });
        
        // Reset dependent fields
        onLocationChange("district", { id: "", name: "" });
        onLocationChange("ward", { id: "", name: "" });
        form.setFieldsValue({ district: undefined, ward: undefined });
      }
      
      // Callback cho parent component (backward compatibility)
      onAddressChange({
        province: provinceId,
        district: null,
        ward: null,
        street: form.getFieldValue('street') || ''
      });
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (districtId) => {
    try {
      const selected = districts.find((d) => d.DistrictID === districtId);
      
      if (selected && onLocationChange) {
        // Cập nhật location state theo pattern ModalCheckout
        onLocationChange("district", {
          id: selected.DistrictID,
          name: selected.DistrictName,
        });
        
        // Reset ward when district changes
        onLocationChange("ward", { id: "", name: "" });
        form.setFieldsValue({ ward: undefined });
      }
      
      // Callback cho parent component (backward compatibility)
      onAddressChange({
        province: form.getFieldValue('province'),
        district: districtId,
        ward: null,
        street: form.getFieldValue('street') || ''
      });
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleWardChange = (wardCode) => {
    const selected = wards.find((w) => w.WardCode === wardCode);
    
    if (selected && onLocationChange) {
      // Cập nhật location state theo pattern ModalCheckout
      onLocationChange("ward", {
        id: selected.WardCode,
        name: selected.WardName,
      });
    }
    
    // Callback cho parent component (backward compatibility)
    onAddressChange({
      province: form.getFieldValue('province'),
      district: form.getFieldValue('district'),
      ward: form.getFieldValue('ward'),
      street: form.getFieldValue('street') || ''
    });
  };

  const handleStreetChange = (e) => {
    // Callback cho parent component
    onAddressChange({
      province: form.getFieldValue('province'),
      district: form.getFieldValue('district'),
      ward: form.getFieldValue('ward'),
      street: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <Form.Item 
        label="Tỉnh / Thành phố" 
        name="province" 
        rules={required ? [{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }] : []}
      >
        <Select 
          onChange={handleProvinceChange} 
          placeholder="Chọn tỉnh/thành"
          disabled={disabled}
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {provinces?.map((p) => (
            <Option key={p.ProvinceID} value={p.ProvinceID}>
              {p.ProvinceName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item 
        label="Quận / Huyện" 
        name="district" 
        rules={required ? [{ required: true, message: 'Vui lòng chọn quận/huyện' }] : []}
      >
        <Select 
          onChange={handleDistrictChange} 
          placeholder="Chọn quận/huyện" 
          disabled={disabled || !districts.length}
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {districts?.map((d) => (
            <Option key={d.DistrictID} value={d.DistrictID}>
              {d.DistrictName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item 
        label="Phường / Xã" 
        name="ward" 
        rules={required ? [{ required: true, message: 'Vui lòng chọn phường/xã' }] : []}
      >
        <Select 
          onChange={handleWardChange}
          placeholder="Chọn phường/xã" 
          disabled={disabled || !wards.length}
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {wards?.map((w) => (
            <Option key={w.WardCode} value={w.WardCode}>
              {w.WardName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item 
        label="Số nhà, tên đường" 
        name="street"
        rules={required ? [{ required: true, message: 'Vui lòng nhập số nhà, tên đường' }] : []}
      >
        <Input 
          placeholder="Nhập số nhà, tên đường" 
          disabled={disabled}
          onChange={handleStreetChange}
        />
      </Form.Item>
    </div>
  );
};

export default AddressForm;