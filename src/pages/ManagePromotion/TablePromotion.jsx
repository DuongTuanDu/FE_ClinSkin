import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Modal Component for Viewing Promotion Details
const PromotionDetailModal = ({ isOpen, onClose, promotion }) => {
  if (!isOpen || !promotion) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Chi tiết khuyến mãi</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Tên khuyến mãi</label>
            <p className="p-2 border rounded bg-gray-100">{promotion.name}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Mô tả</label>
            <p className="p-2 border rounded bg-gray-100">{promotion.description}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Trạng thái</label>
            <p className="p-2 border rounded bg-gray-100">{promotion.isActive ? 'Kích hoạt' : 'Không kích hoạt'}</p>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">Ngày bắt đầu</label>
              <p className="p-2 border rounded bg-gray-100">{new Date(promotion.startDate).toLocaleDateString()}</p>
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-semibold">Ngày kết thúc</label>
              <p className="p-2 border rounded bg-gray-100">{new Date(promotion.endDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Sản phẩm</label>
            {promotion.products.length > 0 ? (
              <div className="border rounded bg-gray-100 p-2">
                {promotion.products.map((product, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <span>{product.pid.name}</span>
                    <span>Giảm giá: {product.discount}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-2 border rounded bg-gray-100 text-gray-500">Không có sản phẩm nào.</p>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const TablePromotion = ({ refreshTable, onEdit }) => {
  const [promotions, setPromotions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [isActive, setIsActive] = useState(true);
  const [fromDate, setFromDate] = useState('2025-06-03');
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:9999/api/v1/admin/promotion?isActive=${isActive}&page=${page}&limit=${limit}&fromDate=${fromDate}`,
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
          headers: { Authorization: `Bearer ${token}` }
        });
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
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedPromotion(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching promotion details:', error);
      alert('Không thể lấy chi tiết khuyến mãi');
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
          <label className="block text-gray-700">Kích hoạt</label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mr-2"
          />
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
              <td className="border p-2">{promotion.isActive ? 'Có' : 'Không'}</td>
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
                  className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                >
                  Xem
                </button>
                <button
                  onClick={() => onEdit(promotion)}
                  className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(promotion._id)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                >
                  Xóa
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