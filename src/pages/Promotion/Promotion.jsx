import React, { useState, useCallback, useMemo, Suspense } from "react";
import { Breadcrumb, Button, Skeleton } from "antd";
import debounce from "lodash/debounce";

import {
  useGetFilterOptionsQuery,
  useGetProductPromtionQuery,
} from "@/redux/product/product.query";
import FilterPanelProduct from "@/components/Filter/FilterPanelProduct";
import ProductHeader from "@/components/Filter/ProductHeader";
import FilterDrawer from "@/components/Filter/FilterDrawer";
import Banner from "./Banner";
import { IoClose } from "react-icons/io5";
import Loading from "@/components/Loading/Loading";

const ProductList = React.lazy(() =>
  import("@/components/Product/ProductList")
);
const ListSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(8)].map((_, idx) => (
      <Skeleton key={idx} active className="h-[300px]" />
    ))}
  </div>
);

const Promotion = () => {
  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 12,
  });

  const [filters, setFilters] = useState({
    priceRange: "",
    brands: [],
    rating: "",
    categories: [],
    tags: [],
    sortOrder: "asc",
  });

  const [openFilter, setOpenFilter] = useState(false);

  const debouncedSetFilters = useCallback(
    debounce((newFilters) => {
      setFilters(newFilters);
      setPaginate((prev) => ({ ...prev, page: 1 }));
    }, 300),
    []
  );

  const { data: productData, isLoading: isLoadingProducts } =
    useGetProductPromtionQuery(
      { ...paginate, ...filters },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  const { data: filterOptions, isLoading: isLoadingFilterOptions } =
    useGetFilterOptionsQuery();

  const { products = [], pagination = {} } = useMemo(
    () => productData || {},
    [productData]
  );

  const hasActiveFilters = useMemo(
    () =>
      Object.entries(filters).some(([key, value]) => {
        if (key === "sortOrder") return false;
        if (Array.isArray(value)) return value.length > 0;
        return value !== "";
      }),
    [filters]
  );

  const handleClearFilters = useCallback(() => {
    setFilters({
      priceRange: "",
      brands: [],
      rating: "",
      categories: [],
      tags: [],
      sortOrder: "asc",
    });
    setPaginate((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleSortChange = useCallback((value) => {
    setFilters((prev) => ({ ...prev, sortOrder: value }));
  }, []);

  if (isLoadingProducts || isLoadingFilterOptions) return <Loading />;

  const discountPercentage =
    products.length > 0 ? products[0]?.promotion?.discountPercentage : 0;

  return (
    <div className="space-y-6">
      <div className="mt-6">
        <Breadcrumb
          items={[
            { title: "Trang chủ", href: "/" },
            { title: "Khuyến mãi hot", href: "/promtions" },
          ]}
        />
      </div>
      <Banner {...{ discountPercentage }} />
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Desktop Filter */}
        <div className="hidden lg:block lg:w-[350px]">
          <div className="bg-white rounded-lg sticky">
            {hasActiveFilters && (
              <Button
                type="text"
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
              >
                <IoClose className="text-lg" />
                Xóa bộ lọc
              </Button>
            )}
            <FilterPanelProduct
              filterOptions={filterOptions}
              isLoading={isLoadingFilterOptions}
              selectedFilters={filters}
              setSelectedFilters={debouncedSetFilters}
              handleClearFilters={handleClearFilters}
            />
          </div>
        </div>

        <div className="flex-1">
          <ProductHeader
            totalItems={pagination?.totalItems}
            sortOrder={filters.sortOrder}
            onSortChange={handleSortChange}
            onOpenFilter={() => setOpenFilter(true)}
          />

          <Suspense fallback={<ListSkeleton />}>
            <ProductList
              products={products}
              isLoading={isLoadingProducts}
              paginate={{
                page: pagination?.page,
                pageSize: pagination?.pageSize,
                totalItems: pagination?.totalItems,
                totalPage: pagination?.totalPage,
              }}
              setPaginate={setPaginate}
            />
          </Suspense>
        </div>

        {/* Mobile Filter Drawer */}
        <FilterDrawer
          open={openFilter}
          onClose={() => setOpenFilter(false)}
          hasActiveFilters={hasActiveFilters}
          handleClearFilters={handleClearFilters}
          filterOptions={filterOptions}
          isLoading={isLoadingFilterOptions}
          selectedFilters={filters}
          setSelectedFilters={debouncedSetFilters}
        />
      </div>
    </div>
  );
};

export default Promotion;
