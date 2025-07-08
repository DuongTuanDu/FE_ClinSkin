import React, { useMemo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPromotion } from "@redux/promotion/promotion.thunk";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  Table,
  InputNumber,
  Form,
  Card,
  message,
  Image,
  Tooltip,
  Tag,
  Select,
  Upload,
} from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import { PiSpinnerBall } from "react-icons/pi";
import { formatPrice } from "@helpers/formatPrice";
import { formatDateReview } from "@helpers/formatDate";
import { useGetProductAddPromotionQuery } from "@/redux/product/product.query";
import { debounce } from "lodash";
import dayjs from "@utils/dayjsTz";
import { UPLOAD_CLINSKIN_PRESET, uploadFile } from "@/helpers/uploadCloudinary";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const SORT_OPTIONS = [
  { label: "Tăng dần", value: "asc" },
  { label: "Giảm dần", value: "desc" },
];

const CreatePromotion = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [filters, setFilters] = useState({ name: "", sort: "asc" });
  const { data, isLoading } = useGetProductAddPromotionQuery(filters);
  const { data: products = [] } = data || {};
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const formattedProducts = useMemo(() => {
    return products.map((item) => ({
      key: item._id,
      ...item,
    }));
  }, [products]);

  const debouncedSearch = useCallback(
    debounce((key, value) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }, 500),
    []
  );

  const columns = useMemo(
    () => [
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
            <Tooltip title={record.name}>
              <div className="text-sm truncate-2-lines">{record.name}</div>
            </Tooltip>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-bold mr-1">Hạn sử dụng:</span>
              {formatDateReview(record.expiry)}
            </div>
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
                    {formatDateReview(record.promotion.startDate)} -
                    {formatDateReview(record.promotion.endDate)}
                  </span>
                </div>
              </>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys: selectedProducts.map((p) => p.product),
      onChange: (selectedRowKeys, selectedRows) => {
        const updatedSelectedProducts = selectedRows.map((item) => ({
          image: item.mainImage.url,
          name: item.name,
          product: item._id,
          discountPercentage: 0,
          maxDiscountAmount: 0,
          maxQty: 0,
        }));
        setSelectedProducts(updatedSelectedProducts);
        form.setFieldsValue({
          products: updatedSelectedProducts.reduce((acc, product) => {
            acc[product.product] = {
              discountPercentage: 0,
              maxQty: 0,
              maxDiscountAmount: 0,
            };
            return acc;
          }, {}),
        });
      },
      getCheckboxProps: (record) => ({
        disabled: record.promotion !== null,
      }),
    }),
    [selectedProducts, form]
  );

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
          navigate("/admin/promotions");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSubmit(false);
      }
    },
    [dispatch, navigate, selectedProducts]
  );

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
            columns={columns}
            dataSource={formattedProducts}
            loading={isLoading}
            rowSelection={{ type: "checkbox", ...rowSelection }}
            pagination={false}
            scroll={{ x: true }}
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
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <h2 className="text-lg font-bold">Tạo mới thông tin khuyến mãi</h2>
            <div className="flex items-center gap-2">
              <Button
                loading={loadingSubmit}
                type="primary"
                htmlType="submit"
                className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
              >
                Tạo khuyến mãi
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
            rules={[{ required: true, message: "Vui lòng tải lên banner" }]}
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
            <h3 className="text-sm font-medium mb-2">Sản phẩm được chọn</h3>
            {selectedProducts.length === 0 ? (
              <Card size="small" className="text-center py-4">
                Chưa có sản phẩm nào được chọn
              </Card>
            ) : (
              selectedProducts.map((product) => (
                <Card
                  size="small"
                  className="shadow-md hover:shadow-lg transition-shadow duration-300 my-2"
                  key={product.product}
                  title={
                    <div className="text-sm font-normal truncate">
                      {product.name}
                    </div>
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
              ))
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreatePromotion;
