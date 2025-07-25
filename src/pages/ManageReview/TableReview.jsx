import React, { useMemo, useState } from "react";
import { Table, Rate, Image, Tooltip, Pagination, Popconfirm, Switch, message, Button, Tag } from "antd";
import { createIcon } from "@utils/createIcon";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { BiReply } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { deleteReview, updateReview } from "@redux/review/review.thunk";
import { useReplyReviewMutation } from "@/redux/review/review.query";
import { deleteFile } from "@helpers/uploadCloudinary";
import ReplyModal from "./ReplyModal";

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

  // 🔥 State và API cho reply
  const [replyModal, setReplyModal] = useState({
    visible: false,
    review: null,
  });
  const [replyReview, { isLoading: isReplying }] = useReplyReviewMutation();

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
        width: 200,
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
        width: 120,
        render: (user) => (
          <div>
            <p className="font-medium">{user.name}</p>
          </div>
        ),
      },
      {
        title: "Đánh giá",
        dataIndex: "rate",
        key: "rate",
        width: 120,
        render: (rate) => (
          <div className="flex items-center gap-2">
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
          </div>
        ),
      },
      {
        title: "Bình luận & Phản hồi",
        dataIndex: "comment",
        key: "comment",
        width: 200,
        render: (_, record) => (
          <div className="space-y-3">
            {/* Comment của user */}
            <div>
              <Tooltip title={record.comment}>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {record.comment}
                </p>
              </Tooltip>

              {/* Hình ảnh đánh giá */}
              {record.images && record.images.length > 0 && (
                <div className="mt-2">
                  <Image.PreviewGroup>
                    {record.images.slice(0, 3).map((image, index) => (
                      <Image
                        key={index}
                        src={image.url}
                        alt={`Review image ${index + 1}`}
                        width={40}
                        height={40}
                        className="mr-1 object-cover rounded"
                      />
                    ))}
                    {record.images.length > 3 && (
                      <span className="text-xs text-gray-500 ml-1">
                        +{record.images.length - 3} ảnh
                      </span>
                    )}
                  </Image.PreviewGroup>
                </div>
              )}
            </div>

            {/* Phản hồi của admin */}
            {record.reply && (
              <div className="bg-blue-50 p-2 rounded border-l-2 border-blue-400">
                <div className="flex items-center gap-2 mb-1">
                  <Tag size="small" color="blue">Admin phản hồi</Tag>
                  {record.repliedAt && (
                    <span className="text-xs text-gray-500">
                      {new Date(record.repliedAt).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </div>
                <Tooltip title={record.reply}>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {record.reply}
                  </p>
                </Tooltip>
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Ngày đánh giá",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 100,
        render: (date) => (
          <div className="text-sm">
            <div>{new Date(date).toLocaleDateString('vi-VN')}</div>
          </div>
        ),
      },
      {
        title: "Thao tác",
        key: "action",
        width: 180,
        fixed: 'right',
        render: (_, record) => (
          <div className="flex items-center gap-2">
            {/* Nút Reply */}
            <Button
              type="text"
              size="small"
              icon={<BiReply />}
              onClick={() => handleOpenReplyModal(record)}
              className={`flex items-center gap-1 ${record.reply
                ? 'text-blue-600 hover:bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {record.reply ? 'Sửa phản hồi' : 'Phản hồi'}
            </Button>

            {/* Switch hiển thị */}
            <div className="flex items-center gap-2">
              <Tooltip title={record.display ? "Ẩn đánh giá" : "Hiển thị"}>
                <Switch
                  checked={record.display}
                  onChange={(checked) => handleToggleStatus(record._id, checked)}
                />
              </Tooltip>
            </div>

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
    [page, pageSize, isLoading]
  );

  const handleOpenReplyModal = (review) => {
    setReplyModal({
      visible: true,
      review: review,
    });
  };

  const handleCloseReplyModal = () => {
    setReplyModal({
      visible: false,
      review: null,
    });
  };

  const handleReply = async (reviewId, replyContent) => {
    try {
      const result = await replyReview({
        id: reviewId,
        reply: replyContent,
      }).unwrap();

      if (result.success) {
        message.success(result.message || "Phản hồi thành công!");
        refetch(); // Refresh data
      }
    } catch (error) {
      console.error("Reply error:", error);
      message.error(error?.data?.message || "Có lỗi xảy ra khi phản hồi!");
      throw error; // Re-throw để ReplyModal có thể handle
    }
  };

  const handleToggleStatus = async (id, display) => {
    try {
      const res = await dispatch(
        updateReview({
          id,
          payload: { display },
        })
      ).unwrap();

      if (res.success) {
        message.success(res.message);
        refetch();
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const removeReview = async (id, review) => {
    try {
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
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa đánh giá");
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
        scroll={{ x: 1200 }}
        size="middle"
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
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} đánh giá`
            }
          />
        </div>
      )}

      {/* 🔥 Modal reply */}
      <ReplyModal
        visible={replyModal.visible}
        onCancel={handleCloseReplyModal}
        review={replyModal.review}
        onReply={handleReply}
        loading={isReplying}
      />
    </>
  );
};

export default React.memo(TableReview);