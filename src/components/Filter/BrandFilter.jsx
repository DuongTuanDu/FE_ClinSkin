import React, { memo } from "react";
import { Checkbox } from "antd";

const BrandFilter = memo(({ brands = [], selectedBrands = [], onChange }) => {
  return (
    <div className="max-h-[200px] overflow-y-auto pr-2">
      <Checkbox.Group
        value={selectedBrands}
        onChange={onChange}
        className="flex flex-col gap-2.5"
      >
        {brands?.map((brand) => (
          <Checkbox key={brand._id} value={brand._id}>
            <span className="text-gray-600">{brand.name}</span>
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  );
});

export default BrandFilter;
