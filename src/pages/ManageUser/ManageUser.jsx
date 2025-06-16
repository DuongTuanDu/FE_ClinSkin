import React, { useState, useEffect, useCallback } from "react";
import { Input, Select, Card, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import TableUser from "@/pages/ManageUser/TableUser";
import { getUserList } from "@redux/user/user.thunk";

const ManageUser = () => {
  const dispatch = useDispatch();
  const { users, pagination, isLoading } = useSelector((state) => state.user);

  const [paginate, setPaginate] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 0,
    totalItems: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  useEffect(() => {
    dispatch(getUserList({ ...paginate, ...filters }));
  }, [dispatch, paginate.page, paginate.pageSize, filters]);

  useEffect(() => {
    if (pagination) {
      setPaginate((prev) => ({
        ...prev,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPage: pagination.totalPage,
        totalItems: pagination.totalUsers,
      }));
    }
  }, [pagination]);

  const debouncedFilter = useCallback(
    debounce((name, value) => {
      setFilters((prev) => ({ ...prev, [name]: value }));
      setPaginate((prev) => ({ ...prev, page: 1 }));
    }, 1000),
    []
  );

  const handleFilterChange = (name, value) => {
    debouncedFilter(name, value);
  };

  return (
    <div className="mt-4">
      <Card className="mb-4 shadow-lg">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12}>
            <Input
              placeholder="Tìm kiếm theo tên hoặc email"
              prefix={<SearchOutlined />}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Select
              allowClear
              placeholder="Trạng thái"
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("status", value)}
            >
              <Select.Option value="">Tất cả</Select.Option>
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Không hoạt động</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <TableUser
        users={users}
        isLoading={isLoading}
        page={paginate.page}
        pageSize={paginate.pageSize}
        totalItems={paginate.totalItems}
        setPaginate={setPaginate}
      />
    </div>
  );
};

export default ManageUser;
