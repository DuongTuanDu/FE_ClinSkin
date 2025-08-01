import {
    Progress,
    Avatar,
    List,
    Rate,
    Space,
    Button,
    Select,
    Card,
    Spin,
    Pagination,
    Image,
    Divider,
    Tag,
    Alert,
} from "antd";
import { createAverageRate, createIcon, SingleStar } from "@utils/createIcon";
import {
    CameraOutlined,
    CommentOutlined,
    EyeOutlined,
    CustomerServiceOutlined,
    CheckCircleOutlined,
    ShoppingCartOutlined,
    EditOutlined
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { capitalizeFirstLetter } from "@helpers/formatDate";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";
import { MdVerified, MdAdminPanelSettings } from "react-icons/md";
import dayjs from "@utils/dayjsTz";
import { useGetReviewByUserQuery } from "@/redux/review/review.query";
import { useSelector } from "react-redux";
import ModalRateUser from "./ModalRateUser";

const RateList = ({ product, refetchProduct }) => {
    const [open, setOpen] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [hasAlreadyReviewed, setHasAlreadyReviewed] = useState(false);
    const [reviewFilter, setReviewFilter] = useState({
        rate: "",
        hasImage: "",
        hasComment: "",
    });
    const [paginate, setPaginate] = useState({
        page: 1,
        pageSize: 10,
    });

    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const { data, isLoading, refetch } = useGetReviewByUserQuery(
        { ...paginate, ...reviewFilter, productId: product?._id },
        { skip: !product }
    );

    const {
        data: reviews = [],
        pagination = {},
        averageRating = 0,
        rateDistribution = {},
    } = data || {};

    // Kiểm tra user có thể đánh giá sản phẩm này không
    useEffect(() => {
        const checkUserCanReview = () => {
            if (!isAuthenticated || !user || !product) {
                setCanReview(false);
                return;
            }

            // Kiểm tra user đã review sản phẩm này chưa
            const userReview = reviews.find(review =>
                review.userId._id === user._id
            );

            if (userReview) {
                setHasAlreadyReviewed(true);
                setCanReview(false);
            } else {
                setHasAlreadyReviewed(false);
                // Ở đây bạn có thể thêm logic kiểm tra user có đơn hàng delivered không
                // Hiện tại set là true để user có thể review, backend sẽ validate
                setCanReview(true);
            }
        };

        checkUserCanReview();
    }, [isAuthenticated, user, product, reviews]);

    const handleFilterChange = (type, value) => {
        setReviewFilter((prev) => ({
            ...prev,
            [type]: value,
        }));
        setPaginate((prev) => ({
            ...prev,
            page: 1,
        }));
    };

    const ratings = Object.entries(rateDistribution).map(([score, count]) => ({
        score,
        count,
    }));
    const totalRatings = Object.values(rateDistribution).reduce(
        (sum, count) => sum + count,
        0
    );

    const renderReviewButton = () => {
        if (!isAuthenticated) {
            return (
                <Alert
                    message="Đăng nhập để đánh giá sản phẩm"
                    type="info"
                    showIcon
                    className="mb-4"
                />
            );
        }

        if (hasAlreadyReviewed) {
            return (
                <Alert
                    message="Bạn đã đánh giá sản phẩm này"
                    type="success"
                    showIcon
                    icon={<CheckCircleOutlined />}
                    className="mb-4"
                />
            );
        }

        return (
            <div className="flex items-center justify-center mb-4">
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="large"
                    onClick={() => setOpen(true)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 border-none hover:from-pink-600 hover:to-purple-600"
                >
                    Viết đánh giá
                </Button>
            </div>
        );
    };

    return (
        <Card className="mb-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-base">
            <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
                <ModalRateUser
                    {...{
                        open,
                        setOpen,
                        product,
                        refetch,
                        refetchProduct,
                        withOrderValidation: true, // Sử dụng API mới
                    }}
                />
                <div className="md:w-1/3">
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold">
                                {parseFloat(averageRating || 0).toFixed(1)}
                            </h2>
                            <div className="flex justify-center items-center space-x-1">
                                <Rate
                                    disabled
                                    character={({ index }) =>
                                        createAverageRate({
                                            index: index + 1,
                                            rate: parseFloat(averageRating || 0),
                                            width: "24px",
                                            height: "24px",
                                        })
                                    }
                                />
                            </div>
                            <p className="text-gray-500 mt-2">{reviews.length} đánh giá</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        {ratings.map(({ score, count }) => (
                            <div key={score} className="flex items-center space-x-2 mb-2">
                                <span className="w-12 flex items-center gap-2">
                                    {score} <SingleStar />
                                </span>
                                <div className="flex-grow">
                                    <Progress
                                        percent={Math.round((count / totalRatings) * 100)}
                                        strokeColor="#313438"
                                        trailColor="#f0f0f0"
                                        showInfo={false}
                                        className="w-full"
                                    />
                                </div>
                                <span className="ml-2 w-12 text-right">({count})</span>
                            </div>
                        ))}
                    </div>

                    {/* Render review button based on user status */}
                    {renderReviewButton()}
                </div>

                <div className="md:w-2/3">
                    <div className="flex justify-between items-center mb-4">
                        <Space wrap>
                            <Button
                                type={reviewFilter.rate === "" ? "primary" : "default"}
                                onClick={() => {
                                    handleFilterChange("rate", "");
                                    handleFilterChange("hasImage", "");
                                    handleFilterChange("hasComment", "");
                                }}
                            >
                                Tất cả
                            </Button>
                            <Select
                                placeholder="Lọc theo đánh giá"
                                optionFilterProp="label"
                                allowClear
                                onChange={(value) => handleFilterChange("rate", value)}
                                options={[5, 4, 3, 2, 1].map((score) => ({
                                    value: score,
                                    label: (
                                        <span className="w-12 flex items-center gap-2">
                                            {score} <SingleStar />
                                        </span>
                                    ),
                                }))}
                            />
                            <Button
                                type={reviewFilter.hasImage === "true" ? "primary" : "default"}
                                onClick={() => {
                                    handleFilterChange(
                                        "hasImage",
                                        reviewFilter.hasImage === "true" ? "" : "true"
                                    );
                                }}
                            >
                                <CameraOutlined /> Có hình
                            </Button>
                            <Button
                                type={
                                    reviewFilter.hasComment === "true" ? "primary" : "default"
                                }
                                onClick={() =>
                                    handleFilterChange(
                                        "hasComment",
                                        reviewFilter.hasComment === "true" ? "" : "true"
                                    )
                                }
                            >
                                <CommentOutlined /> Có bình luận
                            </Button>
                        </Space>
                    </div>

                    {reviews.length === 0 ? (
                        <>
                            <div className="flex items-center justify-center">
                                <div className="space-y-2">
                                    <img
                                        className="w-40 lg:w-60 m-auto"
                                        src="https://res.cloudinary.com/dah1iwbdz/image/upload/v1753075025/pfkfbe8v6aifvf3zfj5a_gb9exn.png"
                                        alt="empty-review"
                                    />
                                    <div className="text-sm md:text-base italic text-center">
                                        Sản phẩm chưa có đánh giá !
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <Spin spinning={isLoading}>
                            <List
                                itemLayout="vertical"
                                dataSource={reviews}
                                renderItem={(review) => (
                                    <div className="pb-4">
                                        <Divider />
                                        <div className="flex flex-col space-y-3">
                                            {/* User Review Section */}
                                            <div className="flex items-start space-x-3">
                                                <Avatar
                                                    className="w-12 h-12"
                                                    src={review.userId.avatar.url}
                                                />
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between w-full flex-wrap">
                                                        <div className="text-base">
                                                            <div className="flex items-center gap-4 flex-wrap">
                                                                <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-rose-700 font-extrabold text-sm text-center uppercase">
                                                                    {review.userId.name}
                                                                </div>
                                                                {review.order && (
                                                                    <div className="flex items-center gap-1">
                                                                        <MdVerified className="text-[#3fbaf6] text-lg" />
                                                                        <span className="text-sm text-[#3fbaf6] italic">
                                                                            Đã mua
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                                            {capitalizeFirstLetter(
                                                                dayjs(review.createdAt).fromNow()
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Rate
                                                        disabled
                                                        value={review.rate}
                                                        character={({ index }) =>
                                                            createIcon({
                                                                index: index + 1,
                                                                rate: review.rate,
                                                                hoverValue: review.rate,
                                                                width: "16px",
                                                                height: "16px",
                                                            })
                                                        }
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 text-gray-600 text-base italic ml-15">
                                                <FaQuoteLeft className="text-gray-400" />
                                                <span>{review.comment}</span>
                                                <FaQuoteRight className="text-gray-400" />
                                            </div>

                                            {review.images && review.images.length > 0 && (
                                                <div className="ml-15">
                                                    <Image.PreviewGroup>
                                                        <div className="flex flex-wrap gap-2">
                                                            {review.images.map((image, index) => (
                                                                <Image
                                                                    key={index}
                                                                    src={image.url}
                                                                    alt={`Review image ${index + 1}`}
                                                                    width={60}
                                                                    height={60}
                                                                    preview={{
                                                                        maskClassName: "rounded-lg",
                                                                        mask: (
                                                                            <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-50 rounded-lg">
                                                                                <EyeOutlined className="text-white text-2xl" />
                                                                            </div>
                                                                        ),
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </Image.PreviewGroup>
                                                </div>
                                            )}

                                            {/* Admin Reply Section */}
                                            {review.reply && review.reply.trim() && (
                                                <div className="ml-8 mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                                                    <div className="flex items-start space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                                <CustomerServiceOutlined className="text-white text-lg" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Tag
                                                                    icon={<MdAdminPanelSettings />}
                                                                    color="blue"
                                                                    className="text-sm font-semibold"
                                                                >
                                                                    Phản hồi từ ClinSkin
                                                                </Tag>
                                                                <CheckCircleOutlined className="text-blue-500" />
                                                            </div>
                                                            <div className="text-gray-700 text-base leading-relaxed">
                                                                <span className="italic">"{review.reply}"</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            />
                            <div className="text-right mt-4">
                                <Pagination
                                    current={pagination?.page}
                                    pageSize={pagination?.pageSize}
                                    total={pagination?.totalItems}
                                    onChange={(page) =>
                                        setPaginate((prev) => ({ ...prev, page }))
                                    }
                                    showTotal={(total) => `Tổng ${total} đánh giá`}
                                />
                            </div>
                        </Spin>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default RateList;