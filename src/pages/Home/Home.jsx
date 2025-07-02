import { Spin } from "antd";
import Banner from "./Banner";
import ProductCarousel from "@/components/Product/ProductCarousel";
import ProductList from "@/components/Product/ProductList";
import { useGetProductHomeQuery, useGetProductOtherQuery } from "@/redux/product/product.query";
import useScreen from "@/hook/useScreen";
import { useMemo, useState } from "react";
import Loading from "@/components/Loading/Loading";
import SliderList from "@/components/Slider/SliderList";
import { sliderPromotion } from "@/const/dataDefault";
import ProductListViewMore from "@/components/Product/ProductListViewMore";

const Home = () => {
    const { isMobile } = useScreen();
    const [paginate, setPaginate] = useState({
        page: 1,
        pageSize: 15,
        totalPage: 0,
        totalItems: 0,
    });

    const { data, isLoading, isFetching } = useGetProductHomeQuery();

    const { data: products, isLoading: isLoadingOther, isFetching: isFetchingOther } = useGetProductOtherQuery({
        ...paginate,
    });

    const { data: productList = [], pagination = {} } = products || {};

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
                <SliderList {...{ slides: sliderPromotion }} />
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
                <ProductListViewMore
                    {...{
                        isLoading: isLoadingOther || isFetchingOther,
                        products: productList,
                        title: "Sản phẩm khác",
                    }}
                />
            </div>
        </div>
    );
}

export default Home