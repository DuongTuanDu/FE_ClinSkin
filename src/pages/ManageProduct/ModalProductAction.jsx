import { Input, message, Modal, Select, InputNumber, Upload, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { PlusOutlined } from "@ant-design/icons";
import ErrorMessage from "@components/Error/ErrorMessage";
import { useGetAllCategoryQuery } from "@redux/category/category.query";
import { useGetAllBrandsQuery } from "@redux/brand/brand.query";
import { updateProduct, createProduct } from "@redux/product/product.thunk";
import { validateForm, validateProductActionSchema } from "@validate/validate";
import SelectBrandsAsyncInfinite from "@/components/CustomSelect/SelectBrandsAsyncInfinite";
import { tags } from "@/const/tags";

const { TextArea } = Input;
const { Option } = Select;

const ModalProductAction = ({ open, setOpen, product = {}, refetch }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [errors, setErrors] = useState({});

  // Use actual API queries
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
  } = useGetAllCategoryQuery();

  const {
    data: brandsData,
    isLoading: isLoadingBrands,
  } = useGetAllBrandsQuery();

  const categories = categoriesData || [];
  const brands = brandsData || [];

  useEffect(() => {

    if (open) {
      if (!isEmpty(product)) {
        form.setFieldsValue({
          name: product.name,
          price: product.price,
          currentStock: product.currentStock,
          categories: product.categories?.map(cat => cat._id || cat),
          brandId: product.brandId?._id || product.brandId,
          description: product.description,
          tags: product.tags?.join(", ")
        });

        // Set main image
        if (product.mainImage?.url) {
          setMainImage({
            uid: '-1',
            name: 'main-image.png',
            status: 'done',
            url: product.mainImage.url,
            thumbUrl: product.mainImage.url,
          });
        } else {
          setMainImage(null);
        }

        // Set additional images
        if (product.images && product.images.length > 0) {
          setFileList(
            product.images.map((img, index) => ({
              uid: `-${index + 2}`,
              name: `image-${index}.png`,
              status: 'done',
              url: img.url,
              thumbUrl: img.url,
            }))
          );
        } else {
          setFileList([]);
        }
      } else {
        // Clear form for new product creation
        form.resetFields();
        setMainImage(null);
        setFileList([]);
      }

      setErrors({});
    }
  }, [product, open, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      let tags = [];
      if (values.tags) {
        if (Array.isArray(values.tags)) {
          // Nếu là mảng (từ Select mode="tags")
          tags = values.tags.filter(tag => tag && tag.trim());
        } else if (typeof values.tags === 'string') {
          // Nếu là string (trường hợp nhập thủ công)
          tags = values.tags.split(",").map(tag => tag.trim()).filter(tag => tag);
        }
      }

      // Add processed tags back to values for validation
      const processedValues = {
        ...values,
        tags: tags
      };

      // Validate form with our schema
      const formErrors = await validateForm({
        input: processedValues,
        validateSchema: validateProductActionSchema,
        context: { isNewProduct: isEmpty(product) }
      });

      if (Object.keys(formErrors).length > 0) {
        console.log("Validation errors:", formErrors);
        setErrors(formErrors);
        setLoading(false);
        return;
      }

      // Prepare form data
      const productData = {
        ...values,
        tags,
      };

      // Handle main image
      if (mainImage?.originFileObj) {
        productData.mainImageBase64 = await getBase64(mainImage.originFileObj);
      } else if (mainImage?.url) {
        // For update with existing image
        productData.mainImageUrl = mainImage.url;
      }

      // Handle additional images
      const additionalImagesBase64 = await Promise.all(
        fileList.filter(file => file.originFileObj)
          .map(file => getBase64(file.originFileObj))
      );

      if (additionalImagesBase64.length > 0) {
        productData.additionalImagesBase64 = additionalImagesBase64;
      }

      // Keep track of existing images that weren't changed
      productData.existingImages = fileList
        .filter(file => file.url && !file.originFileObj)
        .map(file => file.url);

      // Either create or update based on whether product exists
      let result;
      if (isEmpty(product)) {
        result = await dispatch(createProduct(productData)).unwrap();
      } else {
        result = await dispatch(updateProduct({
          id: product._id,
          ...productData
        })).unwrap();
      }

      refetch();
      setOpen(false);
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert file to base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCancel = () => {
    setOpen(false);
    setErrors({});
  };

  const mainImageUploadProps = {
    listType: "picture-card",
    maxCount: 1,
    fileList: mainImage ? [mainImage] : [],
    beforeUpload: (file) => {
      // Return false to prevent auto-upload
      return false;
    },
    onChange({ fileList }) {
      if (fileList.length > 0) {
        setMainImage(fileList[0]);
      } else {
        setMainImage(null);
      }
    },
    onPreview: async (file) => {
      let src = file.url;
      if (!src && file.originFileObj) {
        src = await getBase64(file.originFileObj);
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow?.document.write(image.outerHTML);
    },
  };

  const additionalImagesUploadProps = {
    listType: "picture-card",
    fileList,
    beforeUpload: (file) => {
      // Return false to prevent auto-upload
      return false;
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    onPreview: async (file) => {
      let src = file.url;
      if (!src && file.originFileObj) {
        src = await getBase64(file.originFileObj);
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow?.document.write(image.outerHTML);
    },
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  return (
    <Modal
      open={open}
      title={
        <div className="text-lg md:text-2xl font-bold text-center">
          {isEmpty(product) ? "Thêm sản phẩm mới" : "Cập nhật sản phẩm"}
        </div>
      }
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <button
          key="cancel"
          onClick={handleCancel}
          className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 border px-6 py-2 rounded-full transition duration-300 ease-in-out"
        >
          Hủy
        </button>,
        <button
          key="submit"
          disabled={loading}
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out mx-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEmpty(product) ? "Thêm" : "Cập nhật"}
        </button>,
      ]}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        preserve={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name ? <ErrorMessage message={errors.name} /> : ""}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            validateStatus={errors.price ? "error" : ""}
            help={errors.price ? <ErrorMessage message={errors.price} /> : ""}
          >
            <InputNumber
              size="large"
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              addonAfter="VND"
              className="w-full"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="brandId"
          label="Thương hiệu"
          validateStatus={errors.brandId ? "error" : ""}
          help={errors.brandId ? <ErrorMessage message={errors.brandId} /> : ""}
        >
          <SelectBrandsAsyncInfinite
            defaultBrand={product?.brandId}
            onSelectChange={(option) => {
              form.setFieldsValue({ brandId: option?.value });
            }}
          />
        </Form.Item>

        <Form.Item
          name="categories"
          label="Danh mục"
          validateStatus={errors.categories ? "error" : ""}
          help={errors.categories ? <ErrorMessage message={errors.categories} /> : ""}
        >
          <Select
            mode="multiple"
            size="large"
            placeholder="Chọn danh mục"
            loading={isLoadingCategories}
          >
            {categories.map(category => (
              <Option key={category._id} value={category._id}>{category.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Tags" name="tags">
          <Select placeholder="Chọn tags" size="middle" mode="tags">
            {tags?.map((item) => (
              <Select.Option key={item.key} value={item.value}>
                {item.value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả sản phẩm"
          validateStatus={errors.description ? "error" : ""}
          help={errors.description ? <ErrorMessage message={errors.description} /> : ""}
        >
          <TextArea rows={4} />
        </Form.Item>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình ảnh chính <span className="text-red-600">*</span>
          </label>
          <Upload {...mainImageUploadProps}>
            {!mainImage && uploadButton}
          </Upload>
          {errors.mainImageBase64 && <ErrorMessage message={errors.mainImageBase64} />}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình ảnh bổ sung
          </label>
          <Upload {...additionalImagesUploadProps}>
            {fileList.length < 5 && uploadButton}
          </Upload>
          <div className="text-xs text-gray-500 mt-1">Tối đa 5 hình ảnh</div>
          {errors.additionalImagesBase64 && <ErrorMessage message={errors.additionalImagesBase64} />}
        </div>
      </Form>
    </Modal>
  );
};

export default ModalProductAction;