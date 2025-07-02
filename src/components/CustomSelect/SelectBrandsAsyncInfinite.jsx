import { useEffect, useState, useCallback } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { useDispatch } from "react-redux";
import { brandApi } from "@/redux/brand/brand.query";

const SelectBrandsAsyncInfinite = ({ defaultBrand, onSelectChange }) => {
  const [selected, setSelected] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (defaultBrand?._id && defaultBrand?.name) {
      setSelected({
        label: defaultBrand.name,
        value: defaultBrand._id,
      });
    }
  }, [defaultBrand]);

  const loadOptions = useCallback(
    async (search, loadedOptions, { page }) => {
      try {
        const result = await dispatch(
          brandApi.endpoints.getBrandList.initiate({
            page,
            pageSize: 10,
            name: search,
          })
        );

        if ("data" in result) {
          return {
            options: result.data.data.map((b) => ({
              label: b.name,
              value: b._id,
            })),
            hasMore: result.data.pagination?.hasMore ?? false,
            additional: {
              page: page + 1,
            },
          };
        }

        return { options: [], hasMore: false, additional: { page } };
      } catch (e) {
        console.error("Error loading options:", e);
        return { options: [], hasMore: false, additional: { page } };
      }
    },
    [dispatch]
  );

  const handleChange = (selectedOption) => {
    setSelected(selectedOption);
    if (onSelectChange && selectedOption) {
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
      placeholder="Chọn thương hiệu..."
    />
  );
};

export default SelectBrandsAsyncInfinite;
