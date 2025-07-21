import React, { useCallback, useState, useMemo } from "react";
import { Input, Popover, Spin, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import { formatPrice } from "@helpers/formatPrice";
import { getProductSearch } from "@redux/product/product.thunk";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SearchHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchTerm) => {
        if (!searchTerm.trim()) {
          setSearchResults([]);
          setIsLoading(false);
          return;
        }
        setIsLoading(true);
        try {
          const res = await dispatch(getProductSearch(searchTerm)).unwrap();
          setSearchResults(res.data);
        } catch (error) {
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 500),
    [dispatch]
  );
// console.log(searchResults);
  const handleSearch = useCallback(
    (value) => {
      setSearch(value);
      setShowPopover(true);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );
  // handle click
  const handleProductClick = useCallback(
    (slug) => {
      setSearch("");
      setShowPopover(false);
      navigate(`/detail/${slug}`);
    },
    [navigate]
  );

  // render
  const searchContent = useMemo(
    () => (
      <div className="w-full max-h-[70vh] overflow-y-auto overflow-x-hidden">
        {isLoading ? (
          <div className="p-4 text-center">
            <Spin />
            <div className="mt-2">Đang tìm kiếm...</div>
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map((product) => (
            <div
              onClick={() => handleProductClick(product.slug)}
              key={product._id}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
            >
              <img
                src={product.mainImage.url}
                alt={product.name}
                className="w-20 h-20 object-cover mr-2 rounded-md"
              />
              <div>
                <div className="text-sm line-clamp-2">{product.name}</div>
                <div className="flex items-center gap-2">
                  <div className="font-medium mt-1">
                    {formatPrice(
                      product.promotion ? product.finalPrice : product.price
                    )}{" "}
                    đ
                  </div>
                  {product.promotion &&
                    product.promotion.discountPercentage > 0 && (
                      <Tag color="#f50">
                        -{product.promotion.discountPercentage}%
                      </Tag>
                    )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            Không tìm thấy sản phẩm
          </div>
        )}
      </div>
    ),
    [searchResults, isLoading, handleProductClick]
  );

  return (
    // search
    <Popover
      content={searchContent}
      title="Kết quả tìm kiếm"
      trigger="click"
      open={showPopover && search.length > 0}
      onOpenChange={setShowPopover}
      overlayClassName="w-full md:w-[600px]"
      overlayStyle={{ maxWidth: "90vw" }}
      placement="bottomRight"
    >
      <Input
        value={search}
        placeholder="Tìm kiếm..."
        prefix={<SearchOutlined />}
        size="large"
        className="rounded-full"
        onChange={(e) => handleSearch(e.target.value)}
        onPressEnter={(e) => handleSearch(e.target.value)}
      />
    </Popover>
  );
};

export default React.memo(SearchHeader);
