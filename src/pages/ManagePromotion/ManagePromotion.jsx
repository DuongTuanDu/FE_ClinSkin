import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TablePromotion from "@/pages/ManagePromotion/TablePromotion";
import { getListPromotion } from "@redux/promotion/promotion.thunk";
import locale from "antd/es/date-picker/locale/vi_VN";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

const ManagePromotion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { promotions, pagination, isLoading } = useSelector(
    (state) => state.promotion
  );

  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItems: 0,
  });
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(getListPromotion({ ...paginate, ...filter }));
  }, [dispatch, paginate.page, paginate.pageSize, filter]);

  useEffect(() => {
    if (pagination) {
      setPaginate((prev) => ({
        ...prev,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPage: pagination.totalPage,
        totalItems: pagination.totalItems,
      }));
    }
  }, [pagination]);

  return (
    <div className="mt-4">
      <div className="mb-4 bg-white p-6 rounded-md shadow-lg flex gap-4 items-center flex-wrap">
        <RangePicker
          size="middle"
          locale={locale}
          className="flex-1"
          onChange={(_, dateStrings) => {
            setFilter((prev) => ({
              ...prev,
              startDate: dateStrings[0],
              endDate: dateStrings[1],
            }));
            setPaginate((prev) => ({
              ...prev,
              page: 1,
              pageSize: 10,
            }));
          }}
        />
        <Button
          onClick={() => navigate("/admin/promotions/create")}
          size="middle"
          type="primary"
          icon={<PlusOutlined />}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Thêm khuyến mãi
        </Button>
      </div>

      <TablePromotion
        promotions={promotions}
        isLoading={isLoading}
        page={paginate.page}
        pageSize={paginate.pageSize}
        totalItems={paginate.totalItems}
        setPaginate={setPaginate}
      />
    </div>
  );
};

export default ManagePromotion;
