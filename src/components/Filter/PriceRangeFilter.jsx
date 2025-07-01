import React, { memo } from 'react';
import { Radio } from 'antd';
import { formatPrice } from '@/helpers/formatPrice';

const PriceRangeFilter = memo(({ priceRanges, selectedRange, onChange }) => {
  return (
    <Radio.Group
      className="flex flex-col gap-3"
      value={selectedRange}
      onChange={onChange}
    >
      {priceRanges?.map((range, index) => (
        <Radio key={index} value={`${range.min}-${range.max}`}>
          <span className="text-gray-600">
            {formatPrice(range.min)}đ - {formatPrice(range.max)}đ
          </span>
        </Radio>
      ))}
    </Radio.Group>
  );
});

export default PriceRangeFilter;