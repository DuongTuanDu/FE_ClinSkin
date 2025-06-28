import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import { useDebounce } from 'use-debounce';
import TablePromotion from './TablePromotion.jsx';
import { message } from "antd";

// Modal Component for Creating Promotions Only
const PromotionFormModal = ({ isOpen, onClose, onSubmit, allProducts }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    startDate: '',
    endDate: '',
    products: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        isActive: true,
        startDate: '',
        endDate: '',
        products: []
      });
    }
  }, [isOpen]);

  const loadProductOptions = async (inputValue) => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: 1,
        limit: 20,
        sort: 'name',
      });
      if (inputValue) {
        params.append('name', inputValue);
      }

      const response = await axios.get(
        `http://localhost:9999/api/v1/admin/product/search?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data.data.map(product => ({
        value: product._id,
        label: product.name,
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      return [];
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleProductChange = (index, selectedOption) => {
    const newProducts = [...formData.products];
    newProducts[index] = {
      ...newProducts[index],
      pid: selectedOption ? selectedOption.value : '',
      productName: selectedOption ? selectedOption.label : ''
    };
    setFormData({ ...formData, products: newProducts });
  };

  const handleDiscountChange = (index, e) => {
    const { value } = e.target;
    if (value >= 0 && value <= 100) {
      const newProducts = [...formData.products];
      newProducts[index] = { ...newProducts[index], discount: value };
      setFormData({ ...formData, products: newProducts });
    }
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { pid: '', discount: '', productName: '' }]
    });
  };

  const removeProduct = (index) => {
    setFormData({
      ...formData,
      products: formData.products.filter((_, i) => i !== index)
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        products: formData.products
          .filter(p => p.pid && p.discount)
          .map(({ pid, discount }) => ({ pid, discount: Number(discount) }))
      };

      const response = await onSubmit(payload);
      if (response) {
        onClose();
      }
    } catch (error) {
      console.error('Lỗi khi tạo khuyến mãi:', error);
      message.error('Lỗi khi tạo khuyến mãi');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Tạo khuyến mãi</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Tên khuyến mãi</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Kích hoạt</label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="mr-2"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700">Ngày bắt đầu</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">Ngày kết thúc</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Sản phẩm</label>
            {formData.products.length === 0 && (
              <p className="text-gray-500 mb-2">Chưa có sản phẩm nào được thêm.</p>
            )}
            {formData.products.map((product, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <div className="w-full">
                  <AsyncSelect
                    cacheOptions
                    defaultOptions={true}
                    loadOptions={loadProductOptions}
                    value={product.pid ? { value: product.pid, label: product.productName } : null}
                    onChange={(option) => handleProductChange(index, option)}
                    onInputChange={(input) => setSearchQuery(input)}
                    placeholder="Tìm kiếm sản phẩm..."
                    isClearable
                    loadingMessage={() => "Đang tải sản phẩm..."}
                    noOptionsMessage={() => "Không tìm thấy sản phẩm"}
                    className="w-full"
                  />
                </div>
                <input
                  type="number"
                  name="discount"
                  value={product.discount}
                  onChange={(e) => handleDiscountChange(index, e)}
                  placeholder="Giảm giá (%)"
                  className="w-1/4 p-2 border rounded"
                  required={product.pid !== ''}
                  min="0"
                  max="100"
                />
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addProduct}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Thêm sản phẩm
            </button>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManagePromotion = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [refreshTable, setRefreshTable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:9999/api/v1/admin/product/search?page=1&limit=100&sort=name', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllProducts(response.data.data || []);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        message.error('Không thể lấy danh sách sản phẩm. Vui lòng kiểm tra đăng nhập.');
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (payload) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:9999/api/v1/admin/promotion/createPromotion', payload, config);
      message.success('Tạo khuyến mãi thành công');
      setRefreshTable(prev => !prev);
      return true;
    } catch (error) {
      console.error('Lỗi khi tạo khuyến mãi:', error);
      if (error.response?.status === 422 && error.response.data?.errors) {
        error.response.data.errors.forEach(err => message.error(err.message));
      } else {
        message.error(error.response?.data?.message || 'Lỗi không xác định');
      }
      return false;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý khuyến mãi</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Tạo khuyến mãi
        </button>
      </div>
      <TablePromotion refreshTable={refreshTable} />
      <PromotionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        allProducts={allProducts}
      />
    </div>
  );
};

export default ManagePromotion;
