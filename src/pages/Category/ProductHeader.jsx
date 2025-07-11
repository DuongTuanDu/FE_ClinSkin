import React, { memo } from "react";
import { Select } from "antd";
import { FaFilter } from "react-icons/fa";

const ProductHeader = memo(
  ({ totalItems, sortOrder, onSortChange, onOpenFilter }) => {
    return (
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-bold">Sản phẩm ({totalItems || 0})</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFilter}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 border rounded-lg hover:bg-gray-50"
          >
            <FaFilter className="text-gray-600" />
            <span>Lọc</span>
          </button>

          <Select
            size="large"
            value={sortOrder}
            style={{ width: 180 }}
            onChange={onSortChange}
            options={[
              { value: "asc", label: "Giá: Thấp đến cao" },
              { value: "desc", label: "Giá: Cao đến thấp" },
            ]}
          />
        </div>
      </div>
    );
  }
);

export default ProductHeader;
