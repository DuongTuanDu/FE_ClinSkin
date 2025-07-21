import React, { useMemo } from "react";
import { Table, Rate, Image, Tooltip, Pagination, Popconfirm, Switch, message } from "antd";
import { createIcon } from "@utils/createIcon";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteReview, updateReview } from "@redux/review/review.thunk";
import { deleteFile } from "@helpers/uploadCloudinary";

const TableReview = ({
  reviews = [],
  isLoading = false,
  page,
  pageSize,
  totalItems,
  setPaginate,
  refetch,
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        title: "STT",
        key: "index",
        width: 60,
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "Sản phẩm",
        dataIndex: "product",
        key: "product",
        render: (product) => (
          <div className="flex items-center gap-2">
            <Image
              src={product.mainImage.url}
              alt={product.name}
              width={50}
              height={50}
              className="object-cover mr-2 rounded-md"
            />
            <Tooltip title={product.name}>
              <span className="truncate-2-lines max-w-[150px] text-sm">
                {product.name}
              </span>
            </Tooltip>
          </div>
        ),
      },
      {
        title: "Khách hàng",
        dataIndex: "user",
        key: "user",
        render: (user) => user.name,
      },
      {
        title: "Đánh giá",
        dataIndex: "rate",
        key: "rate",
        render: (rate) => (
          <Rate
            disabled
            value={rate}
            character={({ index }) =>
              createIcon({
                index: index + 1,
                rate: rate,
                hoverValue: rate,
                width: "12px",
                height: "12px",
              })
            }
            className="mt-1"
          />
        ),
      },
      {
        title: "Bình luận",
        dataIndex: "comment",
        key: "comment",
        render: (_, record) => (
          <div>
            <Tooltip title={record.comment}>
              <span className="truncate max-w-[200px] block">
                {record.comment}
              </span>
            </Tooltip>
            {record.images && record.images.length > 0 && (
              <div className="mt-2">
                <Image.PreviewGroup>
                  {record.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image.url}
                      alt={`Review image ${index + 1}`}
                      width={50}
                      height={50}
                      className="mr-2 object-cover rounded"
                    />
                  ))}
                </Image.PreviewGroup>
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Ngày đánh giá",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => new Date(date).toLocaleDateString(),
      },
      {
        title: "Thao tác",
        key: "action",
        render: (_, record) => (
          <div className="flex space-x-4 items-center">
            <Tooltip title={record.display ? "Ẩn đánh giá" : "Hiển thị"}>
              <Switch
                checked={record.display}
                onChange={(checked) => handleToggleStatus(record._id, checked)}
              />
            </Tooltip>
            <Popconfirm
              className="max-w-40"
              placement="topLeft"
              title={"Xác nhận xóa đánh giá"}
              onConfirm={() => removeReview(record._id, record)}
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

  const handleToggleStatus = async (id, display) => {
    const res = await dispatch(
      updateReview({
        id,
        payload: {
          display,
        },
      })
    ).unwrap();
    if (res.success) {
      message.success(res.message);
      refetch();
    }
  };

  const removeReview = async (id, review) => {
    const res = await dispatch(deleteReview(id)).unwrap();
    if (res.success) {
      if (review.images && review.images.length > 0) {
        await Promise.all(
          review.images.map(async (image) => await deleteFile(image.publicId))
        );
      }
      message.success(res.message);
      refetch();
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey={(record) => record._id}
        pagination={false}
        loading={isLoading}
        scroll={{ x: true }}
      />
      {reviews.length > 0 && (
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

export default React.memo(TableReview);
