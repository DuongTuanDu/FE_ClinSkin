import React, { useEffect } from "react";
import { Modal, Form, Input, Rate, Image, message } from "antd";
import { createIcon } from "@utils/createIcon";

const { TextArea } = Input;

const ReplyModal = ({
    visible,
    onCancel,
    review,
    onReply,
    loading = false
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && review) {
            form.setFieldsValue({
                reply: review.reply || '',
            });
        }
    }, [visible, review, form]);

    const handleSubmit = async (values) => {
        try {
            await onReply(review._id, values.reply);
            form.resetFields();
            onCancel();
        } catch (error) {
            console.error("Reply error:", error);
        }
    };

    if (!review) return null;

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <span>Phản hồi đánh giá khách hàng</span>
                    {review.reply && (
                        <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            Đã phản hồi
                        </span>
                    )}
                </div>
            }
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={review.reply ? "Cập nhật phản hồi" : "Gửi phản hồi"}
            cancelText="Hủy"
            width={700}
            destroyOnClose
        >
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                {/* Thông tin sản phẩm */}
                <div className="flex items-start gap-3 mb-4">
                    <Image
                        src={review.product?.mainImage?.url}
                        alt={review.product?.name}
                        width={60}
                        height={60}
                        className="object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-2 line-clamp-2">
                            {review.product?.name}
                        </h4>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>
                                Khách hàng: <span className="font-medium text-gray-800">{review.user?.name}</span>
                            </span>
                            <span>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>
                </div>

                {/* Đánh giá của khách hàng */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Rate
                            disabled
                            value={review.rate}
                            character={({ index }) =>
                                createIcon({
                                    index: index + 1,
                                    rate: review.rate,
                                    hoverValue: review.rate,
                                    width: "16px",
                                    height: "16px",
                                })
                            }
                        />
                        <span className="text-sm font-medium">
                            {review.rate}/5 sao
                        </span>
                    </div>

                    <div className="bg-white p-3 rounded border-l-4 border-gray-300">
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>

                    {/* Hình ảnh đánh giá */}
                    {review.images && review.images.length > 0 && (
                        <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-2">Hình ảnh đính kèm:</p>
                            <div className="flex gap-2 flex-wrap">
                                <Image.PreviewGroup>
                                    {review.images.map((image, index) => (
                                        <Image
                                            key={index}
                                            src={image.url}
                                            alt={`Review image ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="object-cover rounded border hover:opacity-80 transition-opacity"
                                        />
                                    ))}
                                </Image.PreviewGroup>
                            </div>
                        </div>
                    )}
                </div>

                {/* Hiển thị reply cũ nếu có */}
                {review.reply && (
                    <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-blue-700">Phản hồi hiện tại:</p>
                            {review.repliedAt && (
                                <span className="text-xs text-blue-600">
                                    {new Date(review.repliedAt).toLocaleDateString('vi-VN')} {new Date(review.repliedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.reply}</p>
                    </div>
                )}
            </div>

            {/* Form phản hồi */}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="reply"
                    label={review.reply ? "Cập nhật phản hồi" : "Nội dung phản hồi"}
                    rules={[
                        { required: true, message: "Vui lòng nhập nội dung phản hồi" },
                        { min: 10, message: "Phản hồi phải có ít nhất 10 ký tự" },
                        { max: 1000, message: "Phản hồi không được quá 1000 ký tự" },
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Nhập phản hồi của bạn... (Ví dụ: Cảm ơn bạn đã đánh giá sản phẩm. Chúng tôi sẽ cải thiện chất lượng dịch vụ tốt hơn.)"
                        showCount
                        maxLength={1000}
                    />
                </Form.Item>

                <div className="text-xs text-gray-500 mt-2">
                    <strong>Lưu ý:</strong> Phản hồi này sẽ hiển thị công khai cho tất cả khách hàng có thể xem.
                </div>
            </Form>
        </Modal>
    );
};

export default ReplyModal;