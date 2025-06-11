import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TablePromotion from './TablePromotion';

const ManagePromotion = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    startDate: '',
    endDate: '',
    products: []
  });
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [refreshTable, setRefreshTable] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  // Lấy danh sách sản phẩm khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:9999/api/v1/admin/product/search', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllProducts(response.data || []);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        alert('Không thể lấy danh sách sản phẩm. Vui lòng kiểm tra đăng nhập.');
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const newProducts = [...formData.products];
    if (name === 'pid') {
      const selectedProduct = allProducts.find(p => p._id === value);
      newProducts[index] = {
        ...newProducts[index],
        pid: value,
        productName: selectedProduct ? selectedProduct.name : ''
      };
    } else {
      newProducts[index] = { ...newProducts[index], [name]: value };
    }
    setFormData({ ...formData, products: newProducts });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        products: formData.products
          .filter(p => p.pid && p.discount)
          .map(({ pid, discount }) => ({ pid, discount: Number(discount) }))
      };
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      if (selectedPromotion) {
        await axios.put(`http://localhost:9999/api/v1/admin/promotion/updatePromotion/${selectedPromotion._id}`, payload, config);
        alert('Cập nhật khuyến mãi thành công');
      } else {
        await axios.post('http://localhost:9999/api/v1/admin/promotion/createPromotion', payload, config);
        alert('Tạo khuyến mãi thành công');
      }
      setFormData({
        name: '',
        description: '',
        isActive: true,
        startDate: '',
        endDate: '',
        products: []
      });
      setSelectedPromotion(null);
      setRefreshTable(!refreshTable);
    } catch (error) {
      console.error('Lỗi khi lưu khuyến mãi:', error);
      alert('Lỗi khi lưu khuyến mãi');
    }
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setFormData({
      name: promotion.name,
      description: promotion.description,
      isActive: promotion.isActive,
      startDate: promotion.startDate.split('T')[0],
      endDate: promotion.endDate.split('T')[0],
      products: promotion.products.length > 0
        ? promotion.products.map(p => ({
            pid: p.pid,
            discount: p.discount,
            productName: allProducts.find(prod => prod._id === p.pid)?.name || ''
          }))
        : []
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý khuyến mãi</h1>
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded shadow">
        <div className="mb-4">
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
        <div className="mb-4">
          <label className="block text-gray-700">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Kích hoạt</label>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="mr-2"
          />
        </div>
        <div className="mb-4">
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
        <div className="mb-4">
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
        <div className="mb-4">
          <label className="block text-gray-700">Sản phẩm</label>
          {formData.products.length === 0 && (
            <p className="text-gray-500 mb-2">Chưa có sản phẩm nào được thêm.</p>
          )}
          {formData.products.map((product, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <div className="w-full">
                <select
                  name="pid"
                  value={product.pid}
                  onChange={(e) => handleProductChange(index, e)}
                  className="w-full p-2 border rounded"
                  required={product.discount !== ''}
                >
                  <option value="">Chọn sản phẩm</option>
                  {allProducts.map((prod) => (
                    <option key={prod._id} value={prod._id}>
                      {prod.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                name="discount"
                value={product.discount}
                onChange={(e) => handleProductChange(index, e)}
                placeholder="Giảm giá (%)"
                className="w-1/4 p-2 border rounded"
                required={product.pid !== ''}
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
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          {selectedPromotion ? 'Cập nhật khuyến mãi' : 'Tạo khuyến mãi'}
        </button>
      </form>
      <TablePromotion refreshTable={refreshTable} onEdit={handleEdit} />
    </div>
  );
};

export default ManagePromotion;