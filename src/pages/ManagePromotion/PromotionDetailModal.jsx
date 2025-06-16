import React from 'react';

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

export default PromotionDetailModal;