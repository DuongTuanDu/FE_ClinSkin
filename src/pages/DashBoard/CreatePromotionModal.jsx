import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createPromotion } from "@redux/promotion/promotion.thunk";
import { PlusOutlined } from "@ant-design/icons";
import {
    Button,
    DatePicker,
    Input,
    InputNumber,
    Form,
    Card,
    message,
    Image,
    Upload,
    Modal,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import dayjs from "@utils/dayjsTz";
import { UPLOAD_CLINSKIN_PRESET, uploadFile } from "@/helpers/uploadCloudinary";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CreatePromotionModal = ({
    visible,
    onCancel,
    preSelectedProducts = [],
    onSuccess
}) => {
    console.log("preSelectedProducts", preSelectedProducts);
    
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Auto-select preselected products when modal opens
    useEffect(() => {
        if (visible && preSelectedProducts.length > 0) {
            const formattedPreSelected = preSelectedProducts.map((product) => ({
                image: product.image,
                name: product.name,
                product: product.productId || product._id, // Handle different ID formats
                discountPercentage: 0,
                maxDiscountAmount: 0,
                maxQty: 0,
            }));

            setSelectedProducts(formattedPreSelected);

            // Set form values for preselected products
            const initialFormValues = formattedPreSelected.reduce((acc, product) => {
                acc[product.product] = {
                    discountPercentage: 0,
                    maxQty: 0,
                    maxDiscountAmount: 0,
                };
                return acc;
            }, {});

            form.setFieldsValue({
                products: initialFormValues,
            });
        }
    }, [visible, preSelectedProducts, form]);

    // Reset form when modal closes
    useEffect(() => {
        if (!visible) {
            form.resetFields();
            setSelectedProducts([]);
            setUploadedImage(null);
        }
    }, [visible, form]);

    const handleSubmit = useCallback(
        async (values) => {
            try {
                setLoadingSubmit(true);
                if (selectedProducts.length === 0) {
                    message.warning("Vui lòng chọn sản phẩm khuyến mãi");
                    return;
                }

                let banner = null;
                if (uploadedImage?.originFileObj) {
                    const result = await uploadFile({
                        file: uploadedImage.originFileObj,
                        type: UPLOAD_CLINSKIN_PRESET,
                    });
                    banner = {
                        url: result.secure_url,
                        publicId: result.public_id,
                    };
                }

                const formattedValues = {
                    ...values,
                    banner,
                    products: selectedProducts.map((product) => ({
                        product: product.product,
                        discountPercentage:
                            values.products[product.product].discountPercentage,
                        maxQty: values.products[product.product].maxQty,
                        maxDiscountAmount:
                            values.products[product.product].maxDiscountAmount,
                    })),
                    startDate: values.date[0].format("YYYY-MM-DD"),
                    endDate: values.date[1].format("YYYY-MM-DD"),
                };
                delete formattedValues.date;

                const res = await dispatch(createPromotion(formattedValues)).unwrap();
                if (res.success) {
                    message.success(res.message);
                    onSuccess?.();
                    onCancel();
                }
            } catch (error) {
                console.error(error);
                message.error("Có lỗi xảy ra khi tạo khuyến mãi");
            } finally {
                setLoadingSubmit(false);
            }
        },
        [dispatch, selectedProducts, uploadedImage, onSuccess, onCancel]
    );

    return (
        <Modal
            title="Tạo khuyến mãi cho sản phẩm sắp hết hạn"
            open={visible}
            onCancel={onCancel}
            width="800px"
            footer={null}
            destroyOnClose
        >
            <div>
                <Form
                    requiredMark={false}
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    className="space-y-4"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                        <h3 className="text-lg font-bold">Thông tin khuyến mãi</h3>
                        <div className="flex items-center gap-2">
                            <Button
                                loading={loadingSubmit}
                                type="primary"
                                htmlType="submit"
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                Tạo khuyến mãi
                            </Button>
                            <Button onClick={onCancel} type="default">
                                Hủy
                            </Button>
                        </div>
                    </div>

                    <Form.Item
                        name="name"
                        label="Tên khuyến mãi"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên khuyến mãi" },
                        ]}
                    >
                        <Input size="middle" placeholder="Nhập tên khuyến mãi..." />
                    </Form.Item>

                    <Form.Item
                        label="Banner khuyến mãi"
                        name="banner"
                    >
                        <Upload
                            accept="image/*"
                            listType="picture-card"
                            maxCount={1}
                            beforeUpload={() => false}
                            fileList={uploadedImage ? [uploadedImage] : []}
                            onChange={({ fileList }) => setUploadedImage(fileList[0])}
                        >
                            <div>
                                <PlusOutlined />
                                <div className="mt-2">Tải lên</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                    >
                        <TextArea rows={4} placeholder="Nhập mô tả..." />
                    </Form.Item>

                    <Form.Item
                        name="date"
                        label="Thời gian áp dụng"
                        rules={[
                            { required: true, message: "Vui lòng chọn thời gian áp dụng" },
                        ]}
                    >
                        <RangePicker
                            size="middle"
                            locale={locale}
                            className="w-full"
                            disabledDate={(current) =>
                                current && current < dayjs().startOf("day")
                            }
                        />
                    </Form.Item>

                    <div>
                        <h4 className="text-sm font-medium mb-2">
                            Sản phẩm được chọn ({selectedProducts.length})
                        </h4>
                        <div className="max-h-[400px] overflow-y-auto space-y-2">
                            {selectedProducts.length === 0 ? (
                                <Card size="small" className="text-center py-4">
                                    Chưa có sản phẩm nào được chọn
                                </Card>
                            ) : (
                                selectedProducts.map((product) => (
                                    <Card
                                        size="small"
                                        className="shadow-md hover:shadow-lg transition-shadow duration-300"
                                        key={product.product}
                                        title={
                                            <div className="text-sm font-normal truncate">
                                                {product.name}
                                            </div>
                                        }
                                    >
                                        <div className="flex flex-col sm:flex-row sm:space-y-0 sm:space-x-2">
                                            <Image
                                                src={product.image}
                                                width={80}
                                                height={80}
                                                className="rounded-md object-cover"
                                            />
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                <Form.Item
                                                    name={[
                                                        "products",
                                                        product.product,
                                                        "discountPercentage",
                                                    ]}
                                                    label="Giảm giá (%)"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng nhập giảm giá",
                                                        },
                                                    ]}
                                                    className="mb-2"
                                                >
                                                    <InputNumber
                                                        placeholder="% giảm giá"
                                                        min={1}
                                                        max={100}
                                                        className="w-full"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    name={["products", product.product, "maxQty"]}
                                                    label="Số lượng"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng nhập số lượng tối đa",
                                                        },
                                                    ]}
                                                    className="mb-2"
                                                >
                                                    <InputNumber
                                                        placeholder="Số lượng tối đa"
                                                        min={1}
                                                        className="w-full"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    name={[
                                                        "products",
                                                        product.product,
                                                        "maxDiscountAmount",
                                                    ]}
                                                    label="Giảm giá tối đa"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng nhập giảm giá tối đa",
                                                        },
                                                    ]}
                                                    className="mb-2"
                                                >
                                                    <InputNumber
                                                        placeholder="Giảm giá tối đa"
                                                        className="w-full"
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default CreatePromotionModal;