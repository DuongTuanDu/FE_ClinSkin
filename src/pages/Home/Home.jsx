import { Spin } from "antd";
import Banner from "./Banner";
import ProductCarousel from "@/components/Product/ProductCarousel";
import ProductList from "@/components/Product/ProductList";
import { useGetProductHomeQuery } from "@/redux/product/product.query";
import useScreen from "@/hook/useScreen";
import { useMemo } from "react";
import Loading from "@/components/Loading/Loading";

const Home = () => {
    const { isMobile } = useScreen();
    const { data, isLoading, isFetching } = useGetProductHomeQuery();

    const productData = useMemo(() => {
        if (data?.length === 0) return {};
        return data?.reduce((acc, item) => {
            acc[item.tag] = item.products;
            return acc;
        }, {});
    }, [data]);

    const { HOT = [], NEW = [] } = productData || {};

    if (isLoading || isFetching) return <Loading />;

    return (
        <div>
            <Banner />
            <div className="space-y-8">
                <Spin spinning={isLoading} tip="Đang tải...">
                    {HOT &&
                        HOT.length >= 5 &&
                        (!isMobile ? (
                            <ProductCarousel
                                {...{ title: "Sản phẩm nổi bật", products: HOT, isLoading }}
                            />
                        ) : (
                            <ProductList
                                {...{ title: "Sản phẩm nổi bật", products: HOT, isLoading }}
                            />
                        ))}
                </Spin>
                <Spin spinning={isLoading} tip="Đang tải...">
                    {NEW &&
                        NEW.length >= 5 &&
                        (!isMobile ? (
                            <ProductCarousel
                                {...{ title: "Sản phẩm mới", products: NEW, isLoading }}
                            />
                        ) : (
                            <ProductList
                                {...{ title: "Sản phẩm mới", products: NEW, isLoading }}
                            />
                        ))}
                </Spin>
            </div>
        </div>
    );
}

export default Home