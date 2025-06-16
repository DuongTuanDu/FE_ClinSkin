import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaTrash } from 'react-icons/fa';
import PromotionDetailModal from './PromotionDetailModal.jsx';

const TablePromotion = ({ refreshTable, onEdit }) => {
  const [promotions, setPromotions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [isActive, setIsActive] = useState('all'); // Default to 'all'
  const [fromDate, setFromDate] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem('token');
      // Chỉ thêm tham số isActive nếu không phải 'all'
      const isActiveParam = isActive !== 'all' ? `isActive=${isActive}` : '';
      const response = await axios.get(
        `http://localhost:9999/api/v1/admin/promotion?${isActiveParam}&page=${page}&limit=${limit}&fromDate=${fromDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPromotions(response.data.data || []);
      setTotalPages(response.data.pagination.totalPages || 1);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      alert('Không thể lấy danh sách khuyến mãi.');
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [page, isActive, fromDate, refreshTable]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa khuyến mãi này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:9999/api/v1/admin/promotion/deletePromotion/${id}`, {
          headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Xóa khuyến mãi thành công');
        fetchPromotions();
      } catch (error) {
        console.error('Error deleting promotion:', error);
        alert('Xóa khuyến mãi thất bại');
      }
    }
  };

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:9999/api/v1/admin/promotion/${id}`, {
        headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedPromotion(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching promotion details:', error);
      alert('Không thể lấy chi tiết khuyến mãi');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:9999/api/v1/admin/promotion/updatePromotion/${id}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Cập nhật trạng thái thành công');
      fetchPromotions();
    } catch (error) {
      console.error('Error updating promotion status:', error);
      alert('Cập nhật trạng thái thất bại');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPromotion(null);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Danh sách khuyến mãi</h2>
      <div className="mb-4 flex gap-4">
        <div>
          <label className="block text-gray-700">Trạng thái</label>
          <select
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">Hiển thị tất cả</option>
            <option value="true">Kích hoạt</option>
            <option value="false">Không kích hoạt</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Từ ngày</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Tên</th>
            <th className="border p-2">Mô tả</th>
            <th className="border p-2">Kích hoạt</th>
            <th className="border p-2">Ngày bắt đầu</th>
            <th className="border p-2">Ngày kết thúc</th>
            <th className="border p-2">Sản phẩm</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => (
            <tr key={promotion._id} className="hover:bg-gray-100">
              <td className="border p-2">{promotion.name}</td>
              <td className="border p-2">{promotion.description}</td>
              <td className="border p-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promotion.isActive}
                    onChange={() => handleToggleActive(promotion._id, promotion.isActive)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </td>
              <td className="border p-2">{new Date(promotion.startDate).toLocaleDateString()}</td>
              <td className="border p-2">{new Date(promotion.endDate).toLocaleDateString()}</td>
              <td className="border p-2">
                {promotion.products.map((product, index) => (
                  <div key={index}>
                    {product.pid.name}: {product.discount}%
                  </div>
                ))}
              </td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleView(promotion._id)}
                  className="text-green-500 hover:text-green-600"
                  title="Xem chi tiết"
                >
                  <FaEye size={20} />
                </button>
                <button
                  onClick={() => handleDelete(promotion._id)}
                  className="text-red-500 hover:text-red-600"
                  title="Xóa"
                >
                  <FaTrash size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Trước
        </button>
        <span>Trang {page} / {totalPages}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Sau
        </button>
      </div>
      <PromotionDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        promotion={selectedPromotion}
      />
    </div>
  );
};

export default TablePromotion;