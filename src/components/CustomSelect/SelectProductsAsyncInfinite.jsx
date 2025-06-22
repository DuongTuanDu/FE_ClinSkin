import { useEffect, useState, useCallback } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { useDispatch } from "react-redux";
import { productApi } from "@/redux/product/product.query";

const SelectProductsAsyncInfinite = ({ defaultProduct, onSelectChange }) => {
  const [selected, setSelected] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (defaultProduct?._id && defaultProduct?.name) {
      setSelected({
        label: defaultProduct.name,
        value: defaultProduct._id,
      });
    }
  }, [defaultProduct]);

  const loadOptions = useCallback(
    async (search, loadedOptions, { page }) => {
      try {
        const result = await dispatch(
          productApi.endpoints.getProductList.initiate({
            page,
            pageSize: 10,
            name: search,
          })
        );

        if ("data" in result) {
          return {
            options: result.data.data.map((product) => ({
              label: product.name,
              value: product._id,
            })),
            hasMore: result.data.pagination?.hasMore ?? false,
            additional: {
              page: page + 1,
            },
          };
        }

        return { options: [], hasMore: false, additional: { page } };
      } catch (e) {
        console.error("Error loading product options:", e);
        return { options: [], hasMore: false, additional: { page } };
      }
    },
    [dispatch]
  );

  const handleChange = (selectedOption) => {
    setSelected(selectedOption);
    if (onSelectChange) {
      onSelectChange(selectedOption);
    }
  };

  return (
    <AsyncPaginate
      value={selected}
      loadOptions={loadOptions}
      onChange={handleChange}
      additional={{ page: 1 }}
      debounceTimeout={500}
      placeholder="Chọn sản phẩm..."
      isClearable={true}
      noOptionsMessage={() => "Không tìm thấy sản phẩm"}
    />
  );
};

export default SelectProductsAsyncInfinite;
