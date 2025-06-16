import React from "react";
import { Input, Popover } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchHeader = () => {

    return (
        <Popover
            trigger="click"
            overlayClassName="w-full md:w-[600px]"
            overlayStyle={{ maxWidth: "90vw" }}
            placement="bottomRight"
        >
            <Input
                placeholder="Tìm kiếm..."
                prefix={<SearchOutlined />}
                size="large"
                className="rounded-full"
            />
        </Popover>
    );
};

export default SearchHeader;
