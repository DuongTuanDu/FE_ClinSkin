import { Input, message, Modal, Select } from "antd";
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
    level: category.level || 0,
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
        level: category.level,
      }));
    }
  }, [category, open]);

  const flattenCategories = useCallback(
    (categories, level = 0, prefix = "", excludeId = null) => {
      return categories.reduce((acc, category) => {
        if (category._id !== excludeId) {
          acc.push({
            value: category._id,
            label: `${prefix}${category.name}`,
            level: level,
          });
          if (category.children && category.children.length > 0) {
            acc.push(
              ...flattenCategories(
                category.children,
                level + 1,
                `${prefix}  `,
                excludeId
              )
            );
          }
        }
        return acc;
      }, []);
    },
    []
  );

  const parentOptions = useMemo(() => {
    const flattened = flattenCategories(categories, 0, "", category._id);
    if (input.level === 1) {
      return flattened.filter((cat) => cat.level === 0);
    } else if (input.level === 2) {
      return flattened.filter((cat) => cat.level === 1);
    }
    return [];
  }, [categories, input.level, category._id, flattenCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    setValidates((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLevelChange = (value) => {
    setInput((prev) => ({ ...prev, level: value, parent: null }));
    setValidates((prev) => ({ ...prev, level: "", parent: "" }));
  };

  const handleParentChange = (value) => {
    setInput((prev) => ({ ...prev, parent: value }));
    setValidates((prev) => ({ ...prev, parent: "" }));
  };

  const clearInput = useCallback(() => {
    setInput({ name: "", level: 0, parent: null });
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

    if (input.level > 0 && !input.parent) {
      setValidates((prev) => ({
        ...prev,
        parent: "Vui lòng chọn danh mục cha",
      }));
      return;
    }

    let result;
    if (isEmpty(category)) {
      result = await dispatch(
        createCategory({
          name: input.name,
          parent: input.parent,
          level: input.level,
        })
      ).unwrap();
    } else {
      result = await dispatch(updateCategory({
        id: category._id,
        name: input.name,
        parent: input.parent,
        level: input.level,
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
          />
          {validates.name && <ErrorMessage message={validates.name} />}
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-[#14134f]">
            Level
          </label>
          <Select
            name="level"
            value={input.level}
            onChange={handleLevelChange}
            placeholder={<div className="text-sm">Chọn cấp độ danh mục</div>}
            size="large"
            className="w-full mt-1"
          >
            <Select.Option value={0}>Danh mục (0)</Select.Option>
            <Select.Option value={1}>Danh mục (1)</Select.Option>
            <Select.Option value={2}>Danh mục (2)</Select.Option>
          </Select>
          {validates.level && <ErrorMessage message={validates.level} />}
        </div>
        {input.level > 0 && (
          <div className="w-full">
            <label className="block text-sm font-medium text-[#14134f]">
              Danh mục cha
            </label>
            <Select
              loading={isLoading}
              name="parent"
              value={input.parent}
              onChange={handleParentChange}
              placeholder={
                <div className="text-sm">Danh sách danh mục cha</div>
              }
              size="large"
              className="w-full mt-1"
              allowClear
            >
              {parentOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
            {validates.parent && <ErrorMessage message={validates.parent} />}
          </div>
        )}
      </form>
    </Modal>
  );
};

export default ModalCategoryAction;
