import React, { useState, useEffect, useMemo } from "react";
import {
    Checkbox,
    InputNumber,
    Typography,
    Breadcrumb,
    Card,
    message,
    Image,
} from "antd";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
} from "@redux/cart/cart.slice";
import { formatPrice } from "@helpers/formatPrice";
import { isEmpty } from "lodash";
import CustomButton from "@/components/CustomButton";
import ProductList from "@/components/Product/ProductList";
import { useGetProductOtherQuery } from "@/redux/product/product.query";
import ModalCheckout from "./ModalCheckout";
import { useGetAllAddressQuery } from "@/redux/address/address.query";

const { Text } = Typography;

const Cart = ({ isHiden = false }) => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.cart.cart);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paginate, setPaginate] = useState({
        page: 1,
        pageSize: 10,
        totalPage: 0,
        totalItems: 0,
    });
    const [open, setOpen] = useState(false);

    const { data, isLoading, isFetching } = useGetProductOtherQuery({
        ...paginate,
    });

    const { data: productList = [], pagination = {} } = data || {};

    const { data: addresses = [], isLoading: isLoadingAddress, refetch } = useGetAllAddressQuery();
    console.log("addresses", addresses);
    

    const selectedProducts = useMemo(() => {
        return products.filter((product) =>
            selectedItems.includes(product.productId)
        );
    }, [products, selectedItems]);

    useEffect(() => {
        const newTotalPrice = selectedItems.reduce((total, itemId) => {
            const item = products.find((product) => product.productId === itemId);
            return total + (item ? item.price * item.quantity : 0);
        }, 0);
        setTotalPrice(newTotalPrice);
    }, [selectedItems, products]);

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity <= 0) return;
        const currentItem = products.find((p) => p.productId === productId);
        if (!currentItem) return;

        if (newQuantity !== currentItem.quantity) {
            if (newQuantity > currentItem.quantity) {
                dispatch(
                    incrementQuantity({
                        productId,
                        amount: newQuantity - currentItem.quantity,
                    })
                );
            } else {
                dispatch(
                    decrementQuantity({
                        productId,
                        amount: currentItem.quantity - newQuantity,
                    })
                );
            }
        }
    };

    const handleRemoveVariant = (productId) => {
        dispatch(removeFromCart({ productId }));
        setSelectedItems(selectedItems.filter((id) => id !== productId));
    };

    const handleSelectItem = (productId, checked) => {
        setSelectedItems((prev) =>
            checked ? [...prev, productId] : prev.filter((id) => id !== productId)
        );
    };

    const handleSelectAll = (checked) => {
        setSelectedItems(checked ? products.map((p) => p.productId) : []);
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            message.warning("Vui lòng chọn sản phẩm để thanh toán");
            return;
        }
        setOpen(true);
    };

    const groupedProducts = Object.values(
        products.reduce((acc, product) => {
            if (!acc[product.productId]) {
                acc[product.productId] = { ...product, variants: [product] };
            } else {
                acc[product.productId].variants.push(product);
            }
            return acc;
        }, {})
    );

    return (
        <div className="container mx-auto py-4 sm:py-8 px-4">
            {products.length === 0 ? (
                <>
                    {!isHiden && (
                        <Breadcrumb
                            className="pb-4"
                            items={[{ title: "Trang chủ", href: "/" }, { title: "Giỏ hàng" }]}
                        />
                    )}
                    <div className="flex items-center justify-center">
                        <div>
                            <img
                                className="w-64 m-auto flex items-center justify-center"
                                src="https://res.cloudinary.com/dah1iwbdz/image/upload/v1750905779/cart_banner_image_f8sqih.webp"
                                alt="Empty-Cart"
                            />
                            <Typography.Text className="text-base">
                                Vui lòng thêm sản phẩm vào giỏ hàng
                            </Typography.Text>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <ModalCheckout
                        {...{
                            addresses: addresses,
                            isLoadingAddress: isLoadingAddress,
                            open,
                            setOpen,
                            products: selectedProducts,
                            totalAmount: totalPrice,
                        }}
                    />
                    {!isHiden && (
                        <Breadcrumb
                            className="pb-4"
                            items={[{ title: "Trang chủ", href: "/" }, { title: "Giỏ hàng" }]}
                        />
                    )}
                    <Card className="mb-4 sm:mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                        <Checkbox
                            checked={
                                selectedItems.length === products.length && products.length > 0
                            }
                            onChange={(e) => handleSelectAll(e.target.checked)}
                        >
                            <Text strong>Chọn tất cả ({products.length} sản phẩm)</Text>
                        </Checkbox>
                    </Card>

                    {groupedProducts.map((group) => (
                        <Card
                            key={group.productId}
                            className="mb-4 sm:mb-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <Checkbox
                                        checked={selectedItems.includes(group.productId)}
                                        onChange={(e) =>
                                            handleSelectItem(group.productId, e.target.checked)
                                        }
                                        className="mr-2"
                                    />
                                    <Text strong className="text-sm">
                                        {group.name}
                                    </Text>
                                </div>
                                <Text type="secondary" className="text-sm">
                                    {group.brand}
                                </Text>
                            </div>

                            <div className="py-2 sm:py-4 space-y-4">
                                {group.variants.map((variant, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex flex-1 gap-2 items-center space-x-2 sm:space-x-4 mb-2 sm:mb-0">
                                            <Image
                                                src={variant.image}
                                                alt={variant.name}
                                                width={70}
                                                className="object-cover rounded"
                                            />
                                            <div className="space-y-1">
                                                <Text className="text-sm">{variant.name}</Text>
                                                {!isEmpty(variant.color) && (
                                                    <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 sm:gap-2">
                                                        Phân loại:
                                                        <div
                                                            className="ml-1 sm:ml-2 inline-block w-4 h-4 sm:w-6 sm:h-6 rounded-full"
                                                            style={{ backgroundColor: variant.color.code }}
                                                        ></div>
                                                        <div>{variant.color.name}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                                            <Text strong className="font-bold text-sm sm:text-base">
                                                {formatPrice(variant.price)} đ
                                            </Text>
                                            <InputNumber
                                                min={1}
                                                max={99}
                                                value={variant.quantity}
                                                onChange={(value) => {
                                                    console.log("====================================");
                                                    console.log(value);
                                                    console.log("====================================");
                                                    handleQuantityChange(variant.productId, value);
                                                }}
                                                className="w-24 h-8 text-sm lg:h-10 lg:text-base"
                                            />
                                            <button
                                                onClick={() => handleRemoveVariant(variant.productId)}
                                                className="p-1 sm:p-2 border-2 rounded-md cursor-pointer hover:bg-[#edf1ff] transition-colors"
                                            >
                                                <MdOutlineDeleteOutline className="text-lg sm:text-xl" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}

                    <Card className="mb-4 sm:mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                            <Text strong className="mb-2 sm:mb-0 text-sm sm:text-base">
                                Đã chọn: {selectedItems.length} / {products.length}
                            </Text>
                            <Text strong className="text-base sm:text-lg">
                                {formatPrice(totalPrice)} đ
                            </Text>
                        </div>
                        <CustomButton
                            onClick={handleCheckout}
                            variant="primary"
                            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                        >
                            Tiến hành thanh toán
                        </CustomButton>
                    </Card>
                </>
            )}
            <ProductList
                {...{
                    isLoading: isLoading || isFetching,
                    products: productList,
                    title: "Sản phẩm khác",
                    setPaginate,
                    paginate: {
                        page: pagination?.page,
                        pageSize: pagination?.pageSize,
                        totalPage: pagination?.totalPage,
                        totalItems: pagination?.totalItems,
                    },
                }}
            />
        </div>
    );
};

export default Cart;
