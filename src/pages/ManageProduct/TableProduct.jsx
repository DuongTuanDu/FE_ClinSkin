import React, { useMemo } from "react";
import { Table, Tooltip, Pagination, Tag, Popconfirm, message, Image } from "antd";
import { GrEdit } from "react-icons/gr";
import { MdOutlineDeleteOutline } from "react-icons/md";
// Replace with actual query when implemented
// import { useDeleteProductMutation } from "@/redux/product/product.query";

const TableProduct = ({
  products = [],
  isLoading = false,
  page,
  pageSize,
  totalItems,
  setPaginate,
  refetch,
  onEdit
}) => {
  // Mock delete function - replace with actual mutation when ready
  const deleteProduct = async (id) => {
    console.log("Deleting product:", id);
    message.success("Sản phẩm đã được xóa thành công");
    refetch();
  };
  
  // Uncomment this when you have the actual API mutation
  /*
  const [deleteProduct, { isLoading: isLoadingDelete }] = useDeleteProductMutation();
  const removeProduct = async (id) => {
    try {
      const res = await deleteProduct(id);
      if (res.data.success) {
        message.success(res.data.message);
        refetch();
      }
    } catch (error) {
      console.log(error);
      message.error("Không thể xóa sản phẩm");
    }
  };
  */

  const columns = useMemo(
    () => [
      {
        title: "STT",
        key: "stt",
        width: 60,
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "Hình ảnh",
        dataIndex: "mainImage",
        key: "mainImage",
        width: 100,
        render: (mainImage) => (
          <Image 
            src={mainImage?.url || "https://placehold.co/100x100?text=No+Image"} 
            alt="Product Image"
            width={60}
            height={60}
            className="object-cover rounded"
            fallback="https://placehold.co/100x100?text=Error"
          />
        ),
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        render: (text) => (
          <Tooltip title={text}>
            <div className="max-w-64 break-words font-medium truncate-2-lines">
              {text}
            </div>
          </Tooltip>
        ),
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        render: (price) => (
          <div>{price.toLocaleString('vi-VN')} đ</div>
        ),
      },
      {
        title: "Tồn kho",
        dataIndex: "currentStock",
        key: "currentStock",
        width: 100,
        render: (stock) => (
          <Tag color={stock > 10 ? "green" : stock > 0 ? "orange" : "red"}>
            {stock}
          </Tag>
        ),
      },
      {
        title: "Danh mục",
        dataIndex: "categories",
        key: "categories",
        render: (categories) => (
          <div className="flex flex-wrap gap-1">
            {categories && categories.length > 0 ? (
              categories.slice(0, 2).map((category, index) => (
                <Tag key={index} className="text-sm" color="#65bebc">
                  {category.name}
                </Tag>
              ))
            ) : (
              <Tag className="text-sm" color="#99a7bc">
                Không có
              </Tag>
            )}
            {categories && categories.length > 2 && (
              <Tooltip 
                title={categories.slice(2).map(cat => cat.name).join(", ")}
              >
                <Tag className="text-sm" color="#65bebc">+{categories.length - 2}</Tag>
              </Tooltip>
            )}
          </div>
        ),
      },
      {
        title: "Thương hiệu",
        dataIndex: "brandId",
        key: "brandId",
        render: (brandId) => (
          <div>{brandId?.name || "Không có"}</div>
        ),
      },
      {
        title: "Thao Tác",
        key: "action",
        width: 120,
        render: (_, record) => (
          <div className="flex gap-2 items-center text-[#00246a]">
            <Tooltip title="Sửa">
              <button
                onClick={() => onEdit(record)}
                className="p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
              >
                <GrEdit />
              </button>
            </Tooltip>
            <Popconfirm
              className="max-w-40"
              placement="topLeft"
              title={"Xác nhận xóa thông tin sản phẩm"}
              description={record?.name}
              onConfirm={() => deleteProduct(record._id)}
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
      <Table
        columns={columns}
        dataSource={products}
        rowKey={(record) => record._id}
        pagination={false}
        loading={isLoading}
        scroll={{ x: true }}
      />
      {products?.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalItems}
            onChange={(newPage, newPageSize) =>
              setPaginate(newPage, newPageSize)
            }
            showSizeChanger
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </div>
      )}
    </>
  );
};

export default React.memo(TableProduct);
