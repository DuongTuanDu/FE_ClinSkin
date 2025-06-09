import React, { useState, useCallback, useMemo } from "react";
import { Input, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import TableCategory from "@/pages/ManageCategory/TableCategory";
import debounce from "lodash/debounce";
import MOCK_DATA from "./MockData";

const ManageCategory = () => {
    const [paginate, setPaginate] = useState({
        page: 1,
        pageSize: 10,
    });
    const [filter, setFilter] = useState({
        name: "",
    });

    const [isFetch, setIsfetch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const processedData = useMemo(() => {
        const allCategories = MOCK_DATA.data;
        
        // Filter theo tên nếu có
        const filteredCategories = allCategories.filter(category => {
            if (!filter.name) return true;
            return category.name.toLowerCase().includes(filter.name.toLowerCase());
        });

        // Phân trang
        const startIndex = (paginate.page - 1) * paginate.pageSize;
        const endIndex = startIndex + paginate.pageSize;
        const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

        return {
            data: paginatedCategories,
            pagination: {
                page: paginate.page,
                pageSize: paginate.pageSize,
                totalItems: filteredCategories.length,
                totalPage: Math.ceil(filteredCategories.length / paginate.pageSize)
            }
        };
    }, [paginate, filter]);

    const debouncedFilter = useCallback(
        debounce((value) => {
            setFilter({ name: value });
            setPaginate((prev) => ({ ...prev, page: 1 }));
        }, 1000),
        []
    );

    const handleFilterChange = (e) => {
        debouncedFilter(e.target.value);
    };

    const handlePageChange = (newPage, newPageSize) => {
        setPaginate({ page: newPage, pageSize: newPageSize });
    };

    const refetch = () => {
        setIsfetch(!isFetch);
    };

    return (
        <div className="mt-4">
            <div className="mb-4 bg-white p-4 rounded-md shadow-lg flex gap-4 items-center">
                <Input
                    size="middle"
                    placeholder="Tìm kiếm danh mục..."
                    prefix={<SearchOutlined />}
                    onChange={handleFilterChange}
                    allowClear
                />
                <Button
                    size="middle"
                    onClick={() => setOpen(true)}
                    type="primary"
                    icon={<PlusOutlined />}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    Thêm danh mục
                </Button>
            </div>

            <TableCategory
                categories={processedData.data}
                isLoading={isLoading}
                page={processedData.pagination.page}
                pageSize={processedData.pagination.pageSize}
                totalItems={processedData.pagination.totalItems}
                setPaginate={handlePageChange}
                refetch={refetch}
                setIsfetch={setIsfetch}
            />
        </div>
    );
};

export default ManageCategory;
