import React, { useMemo } from "react";
import { Table, Tooltip, Pagination, Popconfirm, message, Tag } from "antd";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  deletePromotion,
  getListPromotion,
} from "@redux/promotion/promotion.thunk";
import { useNavigate } from "react-router-dom";
import { formatDateReview } from "@helpers/formatDate";

const TablePromotion = ({
  promotions = [],
  isLoading = false,
  page,
  pageSize,
  totalItems,
  setPaginate,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        title: "STT",
        key: "stt",
        width: 60,
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "Tên khuyến mãi",
        dataIndex: "name",
        key: "name",
        render: (text) => (
          <Tooltip title={text}>
            <span className="font-extrabold text-sm text-center uppercase">
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
        render: (text) => (
          <div className="text-sm">{text ? text : "Không có"}</div>
        ),
      },
      {
        title: "Thời gian",
        key: "time",
        render: (_, record) => (
          <div>
            <div className="text-sm space-y-1">
              <span className="font-bold">Bắt đầu</span>:{" "}
              {formatDateReview(record.startDate)}
            </div>
            <div className="text-sm">
              <span className="font-bold">Kết thúc</span>:{" "}
              {formatDateReview(record.endDate)}
            </div>
          </div>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "isActive",
        key: "isActive",
        render: (isActive) => (
          <Tag className="text-sm" color={isActive ? "green" : "gold"}>
            {isActive ? "Hoạt động" : "Đã ngừng"}
          </Tag>
        ),
      },
      {
        title: "Thao Tác",
        key: "action",
        width: 120,
        render: (_, record) => (
          <div className="flex gap-2 items-center text-[#00246a]">
            <Tooltip title="Chi tiết">
              <button
                onClick={() => navigate(`/admin/promotions/${record._id}`)}
                className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
              >
                <FaEye />
              </button>
            </Tooltip>
            <Popconfirm
              className="max-w-40"
              placement="topLeft"
              title={"Xác nhận xóa khuyến mãi"}
              description={record.name}
              onConfirm={() => removePromotion(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{
                loading: isLoading,
              }}
              destroyTooltipOnHide={true}
            >
              <Tooltip title="Xóa">
                <button className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors">
                  <MdOutlineDeleteOutline />
                </button>
              </Tooltip>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [page, pageSize]
  );

  const removePromotion = async (id) => {
    const res = await dispatch(deletePromotion(id)).unwrap();
    if (res.success) {
      dispatch(
        getListPromotion({
          page,
          pageSize,
        })
      );
      message.success(res.message);
      return;
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={promotions}
        rowKey={(record) => record._id}
        pagination={false}
        loading={isLoading}
        scroll={{ x: true }}
      />
      {promotions.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={(newPage, newPageSize) =>
              setPaginate((prev) => ({
                ...prev,
                page: newPage,
                pageSize: newPageSize,
              }))
            }
            showSizeChanger
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </div>
      )}
    </>
  );
};

export default React.memo(TablePromotion);
