import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TablePromotion = ({ refreshTable, onEdit }) => {
  const [promotions, setPromotions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [isActive, setIsActive] = useState(true);
  const [fromDate, setFromDate] = useState('2025-06-03');
  const [totalPages, setTotalPages] = useState(1);

  const fetchPromotions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9999/api/v1/admin/promotion?isActive=${isActive}&page=${page}&limit=${limit}&fromDate=${fromDate}`
      );
      setPromotions(response.data.data || []);
      setTotalPages(response.data.pagination.totalPages || 1);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [page, isActive, fromDate, refreshTable]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await axios.delete(`http://localhost:9999/api/v1/admin/promotion/deletePromotion/${id}`);
        alert('Promotion deleted successfully');
        fetchPromotions();
      } catch (error) {
        console.error('Error deleting promotion:', error);
        alert('Failed to delete promotion');
      }
    }
  };

  const handleView = async (id) => {
    try {
      const response = await axios.get(`http://localhost:9999/api/v1/admin/promotion/${id}`);
      alert(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Error fetching promotion details:', error);
      alert('Failed to fetch promotion details');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Promotions List</h2>
      <div className="mb-4 flex gap-4">
        <div>
          <label className="block text-gray-700">Active</label>
          <input聆听
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mr-2"
          />
        </div>
        <div>
          <label className="block text-gray-700">From Date</label>
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
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Active</th>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Products</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => (
            <tr key={promotion._id} className="hover:bg-gray-100">
              <td className="border p-2">{promotion.name}</td>
              <td className="border p-2">{promotion.description}</td>
              <td className="border p-2">{promotion.isActive ? 'Yes' : 'No'}</td>
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
                  View
                </button>
                <button
                  onClick={() => onEdit(promotion)}
                  className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(promotion._id)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                >
                  Delete
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
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TablePromotion;