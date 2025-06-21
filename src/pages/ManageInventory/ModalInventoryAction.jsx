import { DatePicker, Input, InputNumber, message, Modal } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import dayjs  from "dayjs";
import {
  createInventoryBatch,
  updateInventoryBatch,
} from "@/redux/inventory/inventoryBatch.thunk";
import ErrorMessage from "@/components/Error/ErrorMessage";
import SelectProductsAsyncInfinite from "@/components/CustomSelect/SelectProductsAsyncInfinite";
import { validateForm } from "@/validate/validate";
import { validateInventoryBatchActionSchema } from "@/validate/validate";

const ModalInventoryAction = ({
  open,
  setOpen,
  batch = {},
  refetch,
}) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    productId: "",
    quantity: 1,
    costPrice: 0,
    expiryDate: null,
    receivedDate: dayjs(),
  });
  const [validates, setValidates] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (open && !isEmpty(batch)) {
      setInput({
        productId: batch.productId?._id || "",
        quantity: batch.quantity || 1,
        costPrice: batch.costPrice || 0,
        expiryDate: batch.expiryDate ? dayjs(batch.expiryDate) : null,
        receivedDate: batch.receivedDate ? dayjs(batch.receivedDate) : dayjs(),
      });

      if (batch.productId) {
        setSelectedProduct({
          _id: batch.productId._id,
          name: batch.productId.name,
        });
      }
    }
  }, [batch, open]);

  const handleInputChange = (name, value) => {
    setInput((prev) => ({ ...prev, [name]: value }));
    setValidates((prev) => ({ ...prev, [name]: "" }));
  };

  const handleProductChange = (selectedOption) => {
    if (selectedOption) {
      setInput((prev) => ({ ...prev, productId: selectedOption.value }));
      setValidates((prev) => ({ ...prev, productId: "" }));
    } else {
      setInput((prev) => ({ ...prev, productId: "" }));
    }
  };

  const clearInput = () => {
    setInput({
      productId: "",
      quantity: 1,
      costPrice: 0,
      expiryDate: null,
      receivedDate: dayjs(),
    });
    setSelectedProduct(null);
    setValidates({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert dates to ISO strings for validation
    const formInput = {
      ...input,
      expiryDate: input.expiryDate ? input.expiryDate.toISOString() : null,
      receivedDate: input.receivedDate ? input.receivedDate.toISOString() : null,
    };

    const validationErrors = await validateForm({
      input: formInput,
      validateSchema: validateInventoryBatchActionSchema,
    });

    if (Object.keys(validationErrors).length > 0) {
      setValidates(validationErrors);
      return;
    }

    let result;
    if (isEmpty(batch)) {
      result = await dispatch(
        createInventoryBatch({
          productId: input.productId,
          quantity: input.quantity,
          costPrice: input.costPrice,
          expiryDate: input.expiryDate ? input.expiryDate.toISOString() : null,
          receivedDate: input.receivedDate ? input.receivedDate.toISOString() : null,
        })
      ).unwrap();
    } else {
      result = await dispatch(
        updateInventoryBatch({
          batchNumber: batch.batchNumber,
          newQuantity: input.quantity,
          costPrice: input.costPrice,
          expiryDate: input.expiryDate ? input.expiryDate.toISOString() : null,
        })
      ).unwrap();
    }

    if (result && result.success) {
      refetch();
      message.success(result.message || "Thao tác thành công!");
      setOpen(false);
      clearInput();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    clearInput();
  };

  const disabledDate = (current) => {
    // Can't select days before today
    return current && current < dayjs().startOf('day');
  };

  return (
    <Modal
      open={open}
      title={
        <div className="text-lg md:text-2xl font-bold text-center">
          {isEmpty(batch) ? "Thêm mới lô hàng" : "Cập nhật lô hàng"}
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
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out mx-2"
        >
          {isEmpty(batch) ? "Thêm" : "Cập nhật"}
        </button>,
      ]}
      width={800}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="w-full">
          <label className="block text-sm font-medium text-[#14134f]">
            Sản phẩm <span className="text-red-500">*</span>
          </label>
          <SelectProductsAsyncInfinite 
            defaultProduct={selectedProduct}
            onSelectChange={handleProductChange}
          />
          {validates.productId && <ErrorMessage message={validates.productId} />}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#14134f]">
              Số lượng <span className="text-red-500">*</span>
            </label>
            <InputNumber
              value={input.quantity}
              onChange={(value) => handleInputChange("quantity", value)}
              min={1}
              size="large"
              className="w-full mt-1"
            />
            {validates.quantity && <ErrorMessage message={validates.quantity} />}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#14134f]">
              Giá nhập <span className="text-red-500">*</span>
            </label>
            <InputNumber
              value={input.costPrice}
              onChange={(value) => handleInputChange("costPrice", value)}
              min={0}
              size="large"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              className="w-full mt-1"
            />
            {validates.costPrice && <ErrorMessage message={validates.costPrice} />}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#14134f]">
              Ngày hết hạn <span className="text-red-500">*</span>
            </label>
            <DatePicker
              value={input.expiryDate}
              onChange={(date) => handleInputChange("expiryDate", date)}
              disabledDate={disabledDate}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày hết hạn"
              size="large"
              className="w-full mt-1"
            />
            {validates.expiryDate && <ErrorMessage message={validates.expiryDate} />}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#14134f]">
              Ngày nhận
            </label>
            <DatePicker
              value={input.receivedDate}
              onChange={(date) => handleInputChange("receivedDate", date)}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày nhận"
              size="large"
              className="w-full mt-1"
            />
            {validates.receivedDate && <ErrorMessage message={validates.receivedDate} />}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ModalInventoryAction;
