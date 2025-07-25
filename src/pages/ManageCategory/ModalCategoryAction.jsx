import { Input, message, Modal, TreeSelect } from "antd";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import {
  createCategory,
  updateCategory,
} from "@redux/category/category.thunk";
import { validateCategoryActionSchema, validateForm } from "@validate/validate";
import ErrorMessage from "@components/Error/ErrorMessage";
import { useGetAllCategoryQuery } from "@/redux/category/category.query";

const ModalCategoryAction = ({
  open,
  setOpen,
  category = {},
  refetch,
  isFetch,
}) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    name: category.name || "",
    parent: category.parent || null,
  });
  const [validates, setValidates] = useState({});
  const {
    data: categories = [],
    isLoading,
    refetch: refetchCategories,
  } = useGetAllCategoryQuery();

  useEffect(() => {
    if (!open) refetchCategories();
  }, [open, isFetch]);

  useEffect(() => {
    if (open && !isEmpty(category)) {
      setInput((prev) => ({
        ...prev,
        name: category.name,
        parent: category.parent,
      }));
    }
  }, [category, open]);

  // Helper function to convert categories to TreeSelect format
  const convertToTreeData = (categories, excludeId = null) => {
    return categories
      .filter(category => category._id !== excludeId)
      .map(category => ({
        title: category.name,
        value: category._id,
        key: category._id,
        children: category.children && category.children.length > 0 
          ? convertToTreeData(category.children, excludeId) 
          : undefined,
      }));
  };

  const treeData = useMemo(() => {
    return convertToTreeData(categories, category._id);
  }, [categories, category._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    setValidates((prev) => ({ ...prev, [name]: "" }));
  };

  const handleParentChange = (value) => {
    setInput((prev) => ({ ...prev, parent: value }));
    setValidates((prev) => ({ ...prev, parent: "" }));
  };

  const clearInput = useCallback(() => {
    setInput({ name: "", parent: null });
    setValidates({});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = await validateForm({
      input: input,
      validateSchema: validateCategoryActionSchema,
    });

    if (Object.keys(validationErrors).length > 0) {
      setValidates(validationErrors);
      return;
    }

    let result;
    if (isEmpty(category)) {
      result = await dispatch(
        createCategory({
          name: input.name,
          parent: input.parent,
        })
      ).unwrap();
    } else {
      result = await dispatch(updateCategory({
        id: category._id,
        name: input.name,
        parent: input.parent,
      })
      ).unwrap();
    }

    if (result.success) {
      refetch();
      message.success(result.message);
      setOpen(false);
      clearInput();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    clearInput();
  };

  return (
    <Modal
      open={open}
      title={
        <div className="text-lg md:text-2xl font-bold text-center">
          {isEmpty(category) ? "Thêm mới danh mục" : "Cập nhật danh mục"}
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
          disabled={isLoading}
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out mx-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEmpty(category) ? "Thêm" : "Cập nhật"}
        </button>,
      ]}
      width={800}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="w-full">
          <label className="block text-sm font-medium text-[#14134f]">
            Tên danh mục
          </label>
          <Input
            name="name"
            value={input.name}
            onChange={handleInputChange}
            size="large"
            className="mt-1"
            placeholder="Nhập tên danh mục"
          />
          {validates.name && <ErrorMessage message={validates.name} />}
        </div>
        
        <div className="w-full">
          <label className="block text-sm font-medium text-[#14134f]">
            Danh mục cha (Tùy chọn)
          </label>
          <TreeSelect
            loading={isLoading}
            value={input.parent}
            onChange={handleParentChange}
            placeholder="Chọn danh mục cha (để trống nếu là danh mục gốc)"
            size="large"
            className="w-full mt-1"
            allowClear
            showSearch
            treeData={treeData}
            treeDefaultExpandAll={false}
            treeExpandAction="click"
            filterTreeNode={(search, node) =>
              node.title.toLowerCase().includes(search.toLowerCase())
            }
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          />
          {validates.parent && <ErrorMessage message={validates.parent} />}
          <div className="text-xs text-gray-500 mt-1">
            Để trống nếu muốn tạo danh mục gốc. Nhấp vào biểu tượng để mở rộng/thu gọn
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ModalCategoryAction;
