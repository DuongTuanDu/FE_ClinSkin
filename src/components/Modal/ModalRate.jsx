import React, { useState } from "react";
import { Drawer, Rate, Upload, message, notification, Form, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadFile, UPLOAD_CLINSKIN_PRESET } from "@helpers/uploadCloudinary";
import { useDispatch, useSelector } from "react-redux";
import { createReview } from "@redux/review/review.thunk";
import CustomButton from "../CustomButton";
import { setOpenModelAuth } from "@/redux/auth/auth.slice";

const ModalRate = ({
    product = {},
    order = "",
    open,
    setOpen,
    refetch,
    refetchProduct,
}) => {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { isLoading } = useSelector((state) => state.review);

    const [form] = Form.useForm();

    const openNotification = () => {
        notification.success({
            message: "Đánh giá sản phẩm thành công ✨",
            placement: "top",
            duration: 5,
        });
    };

    const handleRateSubmit = async (values) => {
        if (!isAuthenticated) {
            dispatch(setOpenModelAuth(true));
            return;
        }

        setUploading(true);

        try {
            // Upload từng ảnh và lấy URL
            const uploadedImages = await Promise.all(
                fileList.map((file) =>
                    uploadFile({
                        file: file.originFileObj,
                        type: UPLOAD_CLINSKIN_PRESET,
                    })
                )
            );

            // Chuẩn bị payload
            const updatedReview = {
                order: order,
                productId: product._id,
                rate: values.rate,
                comment: values.comment,
                images: uploadedImages.map((img) => ({
                    url: img.secure_url,
                    publicId: img.public_id,
                })),
            };

            // Gửi đánh giá
            dispatch(createReview(updatedReview)).then((res) => {
                if (res.payload.success) {
                    form.resetFields();
                    setFileList([]);
                    openNotification();
                    refetch();
                    setOpen(false);
                }
            });
            if (!order) {
                refetchProduct();
            }
        } catch (error) {
            console.log(error);
            message.error("Đã xảy ra lỗi khi gửi đánh giá.");
        } finally {
            setUploading(false);
        }
    };

    const handleCancelRate = () => {
        form.resetFields();
        setFileList([]);
        setOpen(false);
    };

    return (
        <Drawer
            open={open}
            onClose={handleCancelRate}
            title="Đánh giá sản phẩm"
            width={700}
        >
            <Form
                requiredMark={false}
                form={form}
                layout="vertical"
                onFinish={handleRateSubmit}
            >
                <div className="mb-4">
                    <div className="flex items-center space-x-4">
                        <img
                            className="rounded-lg w-24 h-24 object-cover"
                            src={order ? product?.image : product?.mainImage?.url}
                            alt="image-product"
                        />
                        <div className="text-sm font-medium">{product?.name}</div>
                    </div>
                </div>

                <Form.Item
                    name="rate"
                    rules={[
                        { required: true, message: "Vui lòng chọn mức độ hài lòng!" },
                    ]}
                    className="flex items-center justify-center"
                >
                    <Rate className="text-4xl text-[#a43a62]" />
                </Form.Item>

                <div className="mb-4">
                    <Upload
                        accept="image/*"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                        beforeUpload={(file) => {
                            const isImage = file.type.startsWith("image/");
                            if (!isImage) {
                                message.warning("Chỉ được phép tải lên file ảnh!");
                            }
                            const isLt2M = file.size / 1024 / 1024 < 2;
                            if (!isLt2M) {
                                message.warning("Kích thước ảnh phải nhỏ hơn 2MB!");
                            }
                            return false; // Ngăn upload tự động
                        }}
                        maxCount={4}
                    >
                        {fileList.length >= 4 ? null : (
                            <div className="upload-button">
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                            </div>
                        )}
                    </Upload>
                </div>

                <Form.Item
                    name="comment"
                    label="Nội dung đánh giá"
                    rules={[
                        { required: true, message: "Vui lòng nhập nội dung đánh giá!" },
                    ]}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    />
                </Form.Item>

                <div className="flex justify-end space-x-4">
                    <CustomButton className="!rounded-full" onClick={handleCancelRate}>
                        Hủy
                    </CustomButton>
                    <CustomButton
                        variant="primary"
                        type="submit"
                        loading={uploading || isLoading}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white !rounded-full hover:from-pink-600 hover:to-purple-600"
                    >
                        Gửi đánh giá
                    </CustomButton>
                </div>
            </Form>
        </Drawer>
    );
};

export default ModalRate;
