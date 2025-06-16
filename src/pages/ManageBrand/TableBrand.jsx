import React, { useMemo, useState } from "react";
import { Table, Tooltip, Pagination, Popconfirm, message } from "antd";
import { GrEdit } from "react-icons/gr";
import { MdOutlineDeleteOutline } from "react-icons/md";
import ModalBrandAction from "@/pages/ManageBrand/ModalBrandAction";
import { useDispatch } from "react-redux";
import { deleteBrand } from "@redux/brand/brand.thunk";

const TableBrand = ({
  brands = [],
  isLoading = false,
  page,
  pageSize,
  totalItems,
  setPaginate,
  refetch,
}) => {
  const dispatch = useDispatch();
  const [brand, setBrand] = useState({});
  const [open, setOpen] = useState(false);

  const removeBrand = async (id) => {
    const res = await dispatch(deleteBrand(id)).unwrap();
    if (res.success) {
      refetch();
      message.success(res.message);
      return;
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
        title: "Tên",
        dataIndex: "name",
        key: "name",
        render: (text) => (
          <Tooltip title={text}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-extrabold text-sm text-center uppercase">
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: "Slug",
        dataIndex: "slug",
        key: "slug",
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
                  setBrand(record);
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
              title={"Xác nhận xóa thương hiệu"}
              description={record?.name}
              onConfirm={() => removeBrand(record._id)}
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

  return (
    <>
      <ModalBrandAction
        {...{
          refetch,
          open,
          setOpen,
          brand,
        }}
      />
      <Table
        columns={columns}
        dataSource={brands}
        rowKey={(record) => record._id}
        pagination={false}
        loading={isLoading}
        scroll={{ x: true }}
      />
      {brands?.length > 0 && (
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
          />
        </div>
      )}
    </>
  );
};

export default React.memo(TableBrand);
