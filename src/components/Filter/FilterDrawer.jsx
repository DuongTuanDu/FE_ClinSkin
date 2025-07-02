import React, { memo } from "react";
import { Drawer, Button } from "antd";
import { IoClose } from "react-icons/io5";
import FilterPanelProduct from "@/components/Filter/FilterPanelProduct";

const FilterDrawer = memo(
  ({
    open,
    onClose,
    hasActiveFilters,
    handleClearFilters,
    filterOptions,
    isLoading,
    selectedFilters,
    setSelectedFilters,
  }) => {
    return (
      <Drawer
        open={open}
        onClose={onClose}
        title={
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Bộ lọc</span>
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
          </div>
        }
        placement="right"
        width={300}
      >
        <FilterPanelProduct
          filterOptions={filterOptions}
          isLoading={isLoading}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      </Drawer>
    );
  }
);

export default FilterDrawer;
