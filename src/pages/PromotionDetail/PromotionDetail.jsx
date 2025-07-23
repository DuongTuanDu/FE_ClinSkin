import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPromotionDetail,
  updatePromotion,
} from "@redux/promotion/promotion.thunk";
import {
  Empty,
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Table,
  Card,
  message,
  Image,
  Tag,
  Tooltip,
  Checkbox,
  Select,
  Upload,
} from "antd";
import { debounce, isEmpty } from "lodash";
import moment from "moment";
import locale from "antd/es/date-picker/locale/vi_VN";
import { PiSpinnerBall } from "react-icons/pi";
import { formatPrice } from "@helpers/formatPrice";
import { formatDateReview } from "@helpers/formatDate";
import { useGetProductAddPromotionQuery } from "@/redux/product/product.query";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Loading from "@/components/Loading/Loading";
import {
  deleteFile,
  UPLOAD_CLINSKIN_PRESET,
  uploadFile,
} from "@/helpers/uploadCloudinary";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const SORT_OPTIONS = [
  { label: "Tăng dần", value: "asc" },
  { label: "Giảm dần", value: "desc" },
];

const PromotionDetail = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { promotion: promotionDetail, isLoading: promotionLoading } =
    useSelector((state) => state.promotion);
  const { id } = useParams();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filters, setFilters] = useState({ name: "", sort: "asc" });
  const { data, isLoading: productsLoading } =
    useGetProductAddPromotionQuery(filters);
  const { data: products = [] } = data || [];
  const [promotion, setPromotion] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  // Fetch promotion details
  useEffect(() => {
    if (id) {
      dispatch(getPromotionDetail(id));
    }
  }, [id, dispatch]);

  // Set the promotion and selected products once promotion data is fetched
  useEffect(() => {
    if (!isEmpty(promotionDetail)) {
      const newData = promotionDetail.products.map((item) => ({
        image: item.product.mainImage.url,
        product: item.product._id,
        name: item.product.name,
        discountPercentage: item.discountPercentage,
        maxQty: item.maxQty,
        maxDiscountAmount: item.maxDiscountAmount,
      }));
      
      if (promotionDetail.banner) {
        setUploadedImage({
          uid: "-1",
          name: "banner.png",
          status: "done",
          url: promotionDetail.banner.url,
        });
      }
      setSelectedProducts(newData);
      setPromotion(promotionDetail);
    }
  }, [promotionDetail]);

  // Update form values dynamically when data changes
  useEffect(() => {
    if (promotion && selectedProducts.length > 0) {
      form.setFieldsValue({
        products: selectedProducts.reduce((acc, product) => {
          acc[product.product] = {
            discountPercentage: product.discountPercentage,
            maxQty: product.maxQty,
            maxDiscountAmount: product.maxDiscountAmount,
          };
          return acc;
        }, {}),
        name: promotion.name,
        description: promotion.description,
        date: [moment(promotion.startDate), moment(promotion.endDate)],
        isActive: promotion.isActive,
      });
    }
  }, [promotion, selectedProducts, form]);

  // Memoize product data with promotion info
  const productsWithPromoInfo = useMemo(() => {
    if (isEmpty(promotion) || isEmpty(products)) return [];
    return products.map((product) => ({
      ...product,
      isInCurrentPromotion: promotion.products.some(
        (p) => p._id === product.product
      ),
      promotionInfo: product.promotion,
    }));
  }, [promotion, products]);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoadingSubmit(true);

      let banner = promotionDetail?.banner || null;
      if (uploadedImage?.originFileObj) {
        const result = await uploadFile({
          file: uploadedImage.originFileObj,
          type: UPLOAD_CLINSKIN_PRESET,
        });
        banner = {
          url: result.secure_url,
          publicId: result.public_id,
        };
        await deleteFile(promotionDetail?.banner?.publicId);
      }

      const formattedProducts = selectedProducts.map((product) => ({
        product: product.product,
        discountPercentage: form.getFieldValue([
          "products",
          product.product,
          "discountPercentage",
        ]),
        maxQty: form.getFieldValue(["products", product.product, "maxQty"]),
        maxDiscountAmount: form.getFieldValue([
          "products",
          product.product,
          "maxDiscountAmount",
        ]),
      }));

      const formattedValues = {
        ...values,
        banner,
        products: formattedProducts,
        startDate: values.date[0].format("YYYY-MM-DD HH:mm:ss"),
        endDate: values.date[1].format("YYYY-MM-DD HH:mm:ss"),
      };
      delete formattedValues.date;

      const res = await dispatch(
        updatePromotion({ id, data: formattedValues })
      ).unwrap();
      if (res.success) {
        message.success(res.message);
        navigate("/admin/promotions");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((key, value) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }, 500),
    []
  );

  // Table columns for product list
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "mainImage",
      key: "mainImage",
      width: 100,
      render: (mainImage) => (
        <Image
          className="rounded-md"
          src={mainImage.url}
          alt="Product"
          width={80}
          height={80}
          placeholder={<PiSpinnerBall className="animate-spin" />}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="text-sm truncate-2-lines">{record.name}</div>
          <div className="text-sm truncate-2-lines">
            <span className="font-bold mr-1">Giá:</span>
            <span>{formatPrice(record.price)} đ</span>
          </div>
          {record.promotion && (
            <>
              <div className="text-sm truncate-2-lines">
                <span className="font-bold mr-1">Khuyến mãi:</span>
                <span className="italic">
                  {record.promotion.name}{" "}
                  <Tag color="#fc541e">
                    - {record.promotion.discountPercentage} %
                  </Tag>
                </span>
              </div>
              <div className="text-sm truncate-2-lines">
                <span className="font-bold mr-1">Thời gian:</span>
                <span className="italic">
                  {formatDateReview(record.promotion.startDate)} -{" "}
                  {formatDateReview(record.promotion.endDate)}
                </span>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  // Row selection for table
  const rowSelection = {
    selectedRowKeys: selectedProducts.map((p) => p.product),
    onChange: (_, selectedRows) => {
      const currentPageProducts = products.map((p) => p._id);
      const productsFromOtherPages = selectedProducts.filter(
        (p) => !currentPageProducts.includes(p.product)
      );

      const updatedCurrentPageProducts = selectedRows.map((row) => {
        const existingProduct = selectedProducts.find(
          (p) => p.product === row._id
        );
        return {
          image: row.mainImage.url,
          product: row._id,
          name: row.name,
          discountPercentage: existingProduct
            ? existingProduct.discountPercentage
            : 0,
          maxQty: existingProduct ? existingProduct.maxQty : 0,
          maxDiscountAmount: existingProduct
            ? existingProduct.maxDiscountAmount
            : 0,
        };
      });

      setSelectedProducts([
        ...productsFromOtherPages,
        ...updatedCurrentPageProducts,
      ]);
    },
    getCheckboxProps: (record) => ({
      disabled: record.promotion && record.promotion.id !== id,
    }),
  };

  // Loading and Empty States
  if (promotionLoading || productsLoading) {
    return <Loading />;
  }

  if (isEmpty(promotion)) return <Empty className="mt-24" />;

  return (
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
      <div className="w-full lg:w-1/2 space-y-4">
        <h2 className="text-lg font-bold">Danh sách sản phẩm</h2>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            prefix={<SearchOutlined className="text-gray-400" />}
            allowClear
            onChange={(e) => debouncedSearch("name", e.target.value)}
          />
          <Select
            className="w-40"
            value={filters.sort}
            onChange={(value) => debouncedSearch("sort", value)}
            placeholder="Sắp xếp"
            options={SORT_OPTIONS}
          />
        </div>
        <div className="max-h-[800px] overflow-y-scroll">
          <Table
            loading={productsLoading}
            columns={columns}
            dataSource={productsWithPromoInfo}
            rowSelection={rowSelection}
            rowKey="_id"
            pagination={false}
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2">
        <Form
          requiredMark={false}
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="space-y-4"
          initialValues={{
            products: selectedProducts.reduce((acc, product) => {
              acc[product.product] = {
                discountPercentage: product.discountPercentage,
                maxQty: product.maxQty,
                maxDiscountAmount: product.maxDiscountAmount,
              };
              return acc;
            }, {}),
            name: promotion.name,
            description: promotion.description,
            date: [moment(promotion.startDate), moment(promotion.endDate)],
            isActive: promotion.isActive,
          }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <h2 className="text-lg font-bold">Cập nhật thông tin khuyến mãi</h2>
            <div className="flex items-center gap-2">
              <Button
                loading={loadingSubmit}
                type="primary"
                htmlType="submit"
                className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
              >
                Cập nhật khuyến mãi
              </Button>
              <Button
                onClick={() => navigate("/admin/promotions")}
                type="default"
              >
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
            className="col-span-2"
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
            <RangePicker size="middle" locale={locale} className="w-full" />
          </Form.Item>
          <Form.Item name="isActive" valuePropName="checked">
            <Checkbox>Kích hoạt khuyến mãi</Checkbox>
          </Form.Item>

          <div>
            <h3 className="text-sm font-medium mb-2">Sản phẩm được chọn</h3>
            {selectedProducts.length === 0 && <Empty />}
            {selectedProducts.map((product) => (
              <Card
                size="small"
                className="shadow-md hover:shadow-lg transition-shadow duration-300 my-2"
                key={product.product}
                title={
                  <Tooltip
                    title={product.name}
                    className="text-sm font-normal truncate"
                  >
                    {product.name}
                  </Tooltip>
                }
              >
                <div className="flex flex-col sm:flex-row sm:space-y-0 sm:space-x-2 mb-2">
                  <Image
                    src={product.image}
                    width={100}
                    className="rounded-md"
                  />
                  <Form.Item
                    name={["products", product.product, "discountPercentage"]}
                    label="Giảm giá (%)"
                    rules={[
                      { required: true, message: "Vui lòng nhập giảm giá" },
                    ]}
                    className="w-full sm:w-1/2"
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
                    className="w-full sm:w-1/2"
                  >
                    <InputNumber
                      placeholder="Số lượng tối đa"
                      min={1}
                      className="w-full"
                    />
                  </Form.Item>
                  <Form.Item
                    name={["products", product.product, "maxDiscountAmount"]}
                    label="Giảm giá tối đa"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập giảm giá tối đa",
                      },
                    ]}
                    className="w-full sm:w-1/2"
                  >
                    <InputNumber
                      placeholder="Giảm giá tối đa"
                      className="w-full"
                    />
                  </Form.Item>
                </div>
              </Card>
            ))}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PromotionDetail;
