import React, { useMemo, useState } from "react";
import { Table, Tooltip, Pagination, Tag, Popconfirm, message } from "antd";
import { GrEdit } from "react-icons/gr";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useDeleteBatchMutation } from "@/redux/inventory/inventoryBatch.query";
import ModalInventoryAction from "./ModalInventoryAction";
import dayjs from "dayjs";

const TableInventory = ({
  batches = [],
  isLoading = false,
  page,
  pageSize,
  totalItems,
  setPaginate,
  refetch,
  products,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const [deleteBatch, { isLoading: isLoadingDelete }] = useDeleteBatchMutation();
  const [open, setOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState({});

  const removeBatch = async (batchNumber) => {
    try {
      const res = await deleteBatch(batchNumber).unwrap();
      if (res.success) {
        message.success("Xóa lô hàng thành công");
        refetch();
      }
    } catch (error) {
      message.error(error?.data?.message || "Lỗi khi xóa lô hàng");
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter && sorter.field) {
      let newSortOrder;
      
      // If order is null (third click), cycle back to ascending
      if (!sorter.order) {
        newSortOrder = 'ascend';
      } else {
        newSortOrder = sorter.order;
      }
      
      // Pass the new sort parameters to parent component
      onSortChange(sorter.field, newSortOrder);
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "STT",
        key: "stt",
        width: 60,
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "Mã lô",
        dataIndex: "batchNumber",
        key: "batchNumber",
        sorter: true,
        sortOrder: sortBy === 'batchNumber' ? sortOrder : null,
        render: (text, record) => {
          const isExpired = dayjs(record.expiryDate).isBefore(dayjs());
          
          return (
            <div className="flex items-center gap-2">
              <span className={isExpired ? "text-red-600 font-semibold" : ""}>{text}</span>
              {isExpired && (
                <span className="text-xs text-red-500">⚠️</span>
              )}
            </div>
          );
        },
      },
      {
        title: "Sản phẩm",
        key: "product",
        dataIndex: ['productId', 'name'],
        sorter: true,
        sortOrder: sortBy === 'productId.name' ? sortOrder : null,
        render: (_, record) => (
          <Tooltip title={record.productId?.name || "N/A"}>
            <div className="max-w-64 break-words font-medium truncate-2-lines">
              {record.productId?.name || "N/A"}
            </div>
          </Tooltip>
        ),
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        sorter: true,
        sortOrder: sortBy === 'quantity' ? sortOrder : null,
      },
      {
        title: "Còn lại",
        dataIndex: "remainingQuantity",
        key: "remainingQuantity",
        sorter: true,
        sortOrder: sortBy === 'remainingQuantity' ? sortOrder : null,
        render: (text) => (
          <Tag color={text < 10 ? "red" : text < 30 ? "orange" : "green"}>
            {text}
          </Tag>
        ),
      },
      {
        title: "Giá nhập",
        dataIndex: "costPrice",
        key: "costPrice",
        sorter: true,
        sortOrder: sortBy === 'costPrice' ? sortOrder : null,
        render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
      },
      {
        title: "Ngày nhận",
        dataIndex: "receivedDate",
        key: "receivedDate",
        sorter: true,
        sortOrder: sortBy === 'receivedDate' ? sortOrder : null,
        render: (date) => dayjs(date).format("DD/MM/YYYY"),
      },
      {
        title: "Hạn sử dụng",
        dataIndex: "expiryDate",
        key: "expiryDate",
        sorter: true,
        sortOrder: sortBy === 'expiryDate' ? sortOrder : null,
        render: (date) => {
          const daysRemaining = dayjs(date).diff(dayjs(), 'days');
          const isNearExpiry = daysRemaining <= 90 && daysRemaining > 0;
          const isExpired = daysRemaining < 0;
          
          return (
            <div className="flex items-center gap-2">
              <Tag color={isExpired ? "red" : isNearExpiry ? "orange" : "green"}>
                {dayjs(date).format("DD/MM/YYYY")}
              </Tag>
              {isExpired ? (
                <span className="text-red-600 font-semibold text-xs bg-red-100 px-2 py-1 rounded-full border border-red-300">
                  HẾT HẠN
                </span>
              ) : (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  isNearExpiry 
                    ? "text-orange-600 bg-orange-100 border border-orange-300" 
                    : "text-green-600 bg-green-100 border border-green-300"
                }`}>
                  Còn {daysRemaining} ngày
                </span>
              )}
            </div>
          );
        },
      },
      {
        title: "Thao Tác",
        key: "action",
        width: 120,
        render: (_, record) => (
          <div className="flex gap-2 items-center text-[#00246a]">
            <Tooltip title="Sửa">
              <button
                onClick={() => {
                  setSelectedBatch(record);
                  setOpen(true);
                }}
                className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
              >
                <GrEdit />
              </button>
            </Tooltip>
            <Popconfirm
              className="max-w-40"
              placement="topLeft"
              title={"Xác nhận xóa lô hàng"}
              description={`Mã lô: ${record?.batchNumber}`}
              onConfirm={() => removeBatch(record.batchNumber)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{
                loading: isLoadingDelete,
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
    [page, pageSize, sortBy, sortOrder, isLoadingDelete]
  );

  return (
    <>
      <ModalInventoryAction
        {...{
          refetch,
          batch: selectedBatch,
          setBatch: setSelectedBatch,
          open,
          setOpen,
          products,
          isEdit: true,
        }}
      />
      <Table
        columns={columns}
        dataSource={batches}
        rowKey={(record) => record._id}
        pagination={false}
        loading={isLoading}
        scroll={{ x: true }}
        onChange={handleTableChange}
      />
      {batches?.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={setPaginate}
            showSizeChanger
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </div>
      )}
    </>
  );
};

export default React.memo(TableInventory);