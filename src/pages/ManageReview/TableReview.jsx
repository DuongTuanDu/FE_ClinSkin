import React, { useMemo, useState } from "react";
import {
  Table,
  Tooltip,
  Pagination,
  Tag,
  Popconfirm,
  message,
  Switch,
  Input,
  Button,
} from "antd";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { BiMessageAltEdit } from "react-icons/bi";
import {
  useDeleteReviewMutation,
  useToggleDisplayMutation,
  useReplyReviewMutation,
} from "@/redux/review/review.query";

const TableReview = ({
  reviews = [],
  isLoading = false,
  page = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  refetch,
}) => {
  const [deleteReview] = useDeleteReviewMutation();
  const [toggleDisplay] = useToggleDisplayMutation();
  const [replyReview] = useReplyReviewMutation();

  const [editingId, setEditingId] = useState(null);
  const [replyValue, setReplyValue] = useState("");

  const handleDelete = async (id) => {
    try {
      const res = await deleteReview(id).unwrap();
      message.success(res.message || "Xoá thành công");
      refetch?.();
    } catch {
      message.error("Xoá review thất bại");
    }
  };

  const handleToggleDisplay = async (id) => {
    try {
      await toggleDisplay(id).unwrap();
      refetch?.();
    } catch {
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleReply = async (id) => {
    if (!replyValue.trim()) return message.warning("Phản hồi không được để trống");

    try {
      await replyReview({ id, reply: replyValue }).unwrap();
      message.success("Phản hồi thành công");
      setEditingId(null);
      setReplyValue("");
      refetch?.();
    } catch {
      message.error("Gửi phản hồi thất bại");
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "STT",
        key: "index",
        width: 60,
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
      },
 {
  title: "Người dùng",
  key: "user",
  dataIndex: "userId",
  render: (user) => user?.name ,
},
{
  title: "Sản phẩm",
  key: "product",
  dataIndex: "productId",
  render: (product) => product?.name ,
},



      {
        title: "Nội dung",
        dataIndex: "comment",
        key: "comment",
        render: (text) => (
          <Tooltip title={text}>
            <div className="max-w-64 truncate">{text}</div>
          </Tooltip>
        ),
      },
          {
      title: "Ngày đánh giá",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },

      {
        title: "Số sao",
        dataIndex: "rate",
        key: "rate",
        render: (rate) => <Tag color="gold">{rate} ★</Tag>,
      },
      {
        title: "Trạng thái",
        dataIndex: "display",
        key: "display",
        render: (display, record) => (
          <Switch
            checked={display}
            onChange={() => handleToggleDisplay(record._id)}
          />
        ),
      },
      {
        title: "Phản hồi",
        key: "reply",
        render: (_, record) =>
          editingId === record._id ? (
            <div className="flex gap-2 items-center">
              <Input
                value={replyValue}
                onChange={(e) => setReplyValue(e.target.value)}
                placeholder="Nhập phản hồi..."
                onPressEnter={() => handleReply(record._id)}
              />
              <Button type="primary" size="small" onClick={() => handleReply(record._id)}>
                Gửi
              </Button>
              <Button size="small" onClick={() => setEditingId(null)}>
                Huỷ
              </Button>
            </div>
          ) : record.reply ? (
            <div>
              <div>{record.reply}</div>
              <Button
                type="link"
                icon={<BiMessageAltEdit />}
                onClick={() => {
                  setEditingId(record._id);
                  setReplyValue(record.reply);
                }}
              >
                
              </Button>
            </div>
          ) : (
            <Button
              size="medium"
              icon={<BiMessageAltEdit />}
              onClick={() => {
                setEditingId(record._id);
                setReplyValue("");
              }}
            >
              Phản hồi
            </Button>
          ),
      },
      {
        title: "Thao tác",
        key: "action",
        render: (_, record) => (
          <Popconfirm
            title="Xác nhận xoá review?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Tooltip title="Xoá">
              <button className="p-2 border rounded-md hover:bg-red-100 transition-colors">
                <MdOutlineDeleteOutline className="text-red-600" />
              </button>
            </Tooltip>
          </Popconfirm>
        ),
      },
    ],
    [page, pageSize, editingId, replyValue]
  );

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
            onChange={(newPage, newSize) => onPageChange?.(newPage, newSize)}
            showSizeChanger
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </div>
      )}
    </>
  );
};

export default React.memo(TableReview);
