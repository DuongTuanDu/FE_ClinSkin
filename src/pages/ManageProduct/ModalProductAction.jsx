import { Input, message, Modal, Select, InputNumber, Upload, Form } from "antd";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { PlusOutlined } from "@ant-design/icons";
import ErrorMessage from "@components/Error/ErrorMessage";
// Replace with actual API queries when implemented
// import { useGetAllCategoryQuery } from "@/redux/category/category.query";
// import { useGetAllBrandsQuery } from "@/redux/brand/brand.query";
// import { createProduct, updateProduct } from "@redux/product/product.thunk";

const { TextArea } = Input;
const { Option } = Select;

const ModalProductAction = ({
  open,
  setOpen,
  product = {},
  refetch,
  isFetch,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  
  // Mock data for categories and brands - replace with actual API queries
  const categories = [
    { _id: "1", name: "Chăm sóc da" },
    { _id: "2", name: "Trang điểm" },
    { _id: "3", name: "Chăm sóc cơ thể" },
  ];
  const isLoadingCategories = false;
  
  const brands = [
    { _id: "1", name: "La Roche-Posay" },
    { _id: "2", name: "Nivea" },
    { _id: "3", name: "L'Oreal" },
  ];
  const isLoadingBrands = false;
  
  // Uncomment when you have actual API queries
  /*
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
  } = useGetAllCategoryQuery();
  
  const {
    data: brands = [],
    isLoading: isLoadingBrands,
  } = useGetAllBrandsQuery();
  */

  useEffect(() => {
    if (open && !isEmpty(product)) {
      form.setFieldsValue({
        name: product.name,
        price: product.price,
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
      }
    } else {
      form.resetFields();
      setMainImage(null);
      setFileList([]);
    }
  }, [product, open, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // Process tags (convert comma-separated string to array)
      const tags = values.tags ? values.tags.split(",").map(tag => tag.trim()).filter(tag => tag) : [];
      
      // Validate main image
      if (!mainImage && isEmpty(product)) {
        message.error("Vui lòng tải lên hình ảnh chính của sản phẩm");
        setLoading(false);
        return;
      }
      
      const productData = {
        ...values,
        tags,
        // We keep the existing currentStock if updating a product
        currentStock: product.currentStock || 0, // Default to 0 for new products
        // In a real app, you would upload images and get URLs/IDs
        mainImage: mainImage ? { 
          url: mainImage.url || "https://via.placeholder.com/500", 
          public_id: mainImage.uid 
        } : product.mainImage,
        images: fileList.map(file => ({ 
          url: file.url || "https://via.placeholder.com/500", 
          public_id: file.uid 
        }))
      };
      
      // This is a mock implementation - replace with actual API calls
      console.log("Submitting product data:", productData);
      
      if (isEmpty(product)) {
        // Create new product
        // const result = await dispatch(createProduct(productData)).unwrap();
        message.success("Sản phẩm đã được tạo thành công!");
      } else {
        // Update existing product
        // const result = await dispatch(updateProduct({ id: product._id, data: productData })).unwrap();
        message.success("Sản phẩm đã được cập nhật thành công!");
      }
      
      refetch();
      setOpen(false);
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setMainImage(null);
    setFileList([]);
  };

  const mainImageUploadProps = {
    listType: "picture-card",
    maxCount: 1,
    fileList: mainImage ? [mainImage] : [],
    onChange({ fileList }) {
      if (fileList.length > 0) {
        setMainImage(fileList[0]);
      } else {
        setMainImage(null);
      }
    },
    onPreview: async (file) => {
      let src = file.url;
      if (!src) {
        src = await new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
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
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    onPreview: async (file) => {
      let src = file.url;
      if (!src) {
        src = await new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
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
          {isEmpty(product) ? "Thêm mới sản phẩm" : "Cập nhật sản phẩm"}
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
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input size="large" />
          </Form.Item>
          
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
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
          rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
        >
          <Select 
            size="large"
            placeholder="Chọn thương hiệu"
            loading={isLoadingBrands}
          >
            {brands.map(brand => (
              <Option key={brand._id} value={brand._id}>{brand.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="categories"
          label="Danh mục"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất một danh mục!' }]}
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
        
        <Form.Item
          name="tags"
          label="Tags"
          help="Nhập các tags cách nhau bởi dấu phẩy (vd: mỹ phẩm, kem dưỡng, spa)"
        >
          <Input size="large" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Mô tả sản phẩm"
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
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình ảnh bổ sung
          </label>
          <Upload {...additionalImagesUploadProps}>
            {fileList.length < 5 && uploadButton}
          </Upload>
          <div className="text-xs text-gray-500 mt-1">Tối đa 5 hình ảnh</div>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalProductAction;
