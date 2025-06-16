import React, { useState, useCallback, useMemo } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import TableReview from "./TableReview";
import { useGetReviewListQuery } from "@/redux/review/review.query";
import { comment } from "postcss";

const ManageReview = () => {
  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 10,
  });

  const [searchText, setSearchText] = useState("");

  const debouncedFilter = useMemo(() => debounce((value) => {
    setSearchText(value);
    setPaginate((prev) => ({ ...prev, page: 1 }));
  }, 500), []);

  const handleSearchChange = (e) => {
    debouncedFilter(e.target.value);
  };

  const handlePageChange = (page, pageSize) => {
    setPaginate({ page, pageSize });
  };

  const { data, isLoading, refetch } = useGetReviewListQuery({
    ...paginate,
    comment: searchText,
  });

  const reviews = data?.reviews || [];
const pagination = data?.pagination || {};


  return (
    <div className="mt-4">
      <div className="mb-4 bg-white p-4 rounded-md shadow-md flex gap-4 items-center">
        <Input
          size="middle"
          placeholder="Tìm kiếm nội dung đánh giá..."
          prefix={<SearchOutlined />}
          onChange={handleSearchChange}
          allowClear
        />
      </div>

      <TableReview
        reviews={reviews}
        isLoading={isLoading}
        page={pagination.page || paginate.page}
        pageSize={pagination.pageSize || paginate.pageSize}
        totalItems={pagination.totalItems || 0}
        onPageChange={handlePageChange}
        refetch={refetch}
      />
    </div>
  );
};

export default ManageReview;
