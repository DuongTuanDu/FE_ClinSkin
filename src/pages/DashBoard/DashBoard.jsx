import { Button, Card } from "antd";
import TableProductAlmostExpired from "@/pages/DashBoard/TableProductAlmostExpired";
import { PlusOutlined } from "@ant-design/icons";

import React, { useEffect, useState } from "react";
import StatsOverview from "./StatsOverview";
import StatsRevenueOrder from "./StatsRevenueOrder";
import StatsReview from "./StatsReview";

// Mock data generator for products almost expired
const generateMockProductData = (page, pageSize) => {
    const mockProducts = [
        {
            "_id": "66e064906e8ea3742f887fac",
            "name": "[Fruit Grocery edition] Phấn Nước Clio Che Khuyết Điểm Kill Cover The New Founwear Cushion SPF50+ PA+++ (15g) (Tặng 1 lõi refill)",
            "categories": [
                {
                    "_id": "66e004679369d7b247e5e3ef",
                    "name": "Trang điểm"
                },
                {
                    "_id": "66e008049369d7b247e5e403",
                    "name": "Trang điểm mặt"
                },
                {
                    "_id": "66e03246e5d9e3b3a57b9e32",
                    "name": "Cushion"
                }
            ],
            "brand": {
                "_id": "66e05acd9592f7b26ca4a109",
                "name": "Club Clio"
            },
            "images": [
                {
                    "url": "https://file.hstatic.net/200000135107/file/r_pro_tailor_be_velvet_cover_cushion_spf_34_pa____kem_loi_refill___54__74ff37cfe37f48ef982aa053b024cc17_grande.jpg",
                    "publicId": "clinskin/znbeybed8vgyhtmamt9d",
                    "_id": "677bd76509cb769c1a47aec0"
                }
            ],
            "price": 679000,
            "description": "<p>Nằm trong bộ sưu tập Phiên bản giới hạn \"Every Fruit Grocery\" của Clio, phấn nước Kill Cover The New Founwear Cushion với hình ảnh ngọt ngào được lấy cảm hứng từ trái đào với sắc hồng tươi tắn, nhẹ nhàng thể hiện lớp nền makeup cũng nhẹ nhàng, tươi mới và rạng rỡ như thế.</p>",
            "mainImage": {
                "url": "https://file.hstatic.net/200000135107/file/r_pro_tailor_be_velvet_cover_cushion_spf_34_pa____kem_loi_refill___54__74ff37cfe37f48ef982aa053b024cc17_grande.jpg",
                "publicId": "clinskin/gatuderbigvqn2pmztwk"
            },
            "variants": [
                {
                    "color": {
                        "name": "LINGERIE",
                        "code": "#ffdac7",
                        "image": {
                            "url": "https://file.hstatic.net/200000135107/file/r_pro_tailor_be_velvet_cover_cushion_spf_34_pa____kem_loi_refill___54__74ff37cfe37f48ef982aa053b024cc17_grande.jpg",
                            "publicId": "clinskin/fo43ddwo0fifw9y1612l"
                        }
                    },
                    "quantity": 98,
                    "_id": "677bd76509cb769c1a47aec1"
                }
            ],
            "enable": true,
            "tags": ["HOT"],
            "capacity": "15g",
            "createdAt": "2024-09-10T15:24:00.930Z",
            "updatedAt": "2025-05-27T08:36:02.139Z",
            "slug": "fruit-grocery-edition-phan-nuoc-clio-che-khuyet-diem-kill-cover-the-new-founwear-cushion-spf50+-pa+++-(15g)-(tang-1-loi-refill)",
            "expiry": "2025-08-14T00:00:00.000Z", // Sắp hết hạn
            "isAlmostExpired": true,
            "isExpired": false,
            "totalQuantity": 98,
            "cost": 407400,
            "promotion": null
        },
        {
            "_id": "67111d800a8def8ead3e119b",
            "name": "(Minisize) Kem Nền Che Khuyết Điểm Clio Kill Cover Founwear Foundation SPF30 PA+++ 13g",
            "categories": [
                {
                    "_id": "66e004679369d7b247e5e3ef",
                    "name": "Trang điểm"
                },
                {
                    "_id": "66e008049369d7b247e5e403",
                    "name": "Trang điểm mặt"
                },
                {
                    "_id": "66e03258e5d9e3b3a57b9e36",
                    "name": "Kem nền"
                }
            ],
            "brand": {
                "_id": "66e05acd9592f7b26ca4a109",
                "name": "Club Clio"
            },
            "images": [
                {
                    "url": "https://bizweb.dktcdn.net/thumb/1024x1024/100/509/263/products/442466060-1187247032272361-9075248689395473213-n.jpg?v=1717485471340",
                    "publicId": "clinskin/cigjrdcaimv50wfeuzmm",
                    "_id": "678b52ccb3642419867f5d07"
                }
            ],
            "price": 306750,
            "description": "<p>Một trong những loại kem nền xuất sắc cho làn da dầu hoặc da khô dễ mất độ ẩm đó là Clio Kill Cover Founwear Foundation.</p>",
            "mainImage": {
                "url": "https://bizweb.dktcdn.net/thumb/1024x1024/100/509/263/products/442466060-1187247032272361-9075248689395473213-n.jpg?v=1717485471340",
                "publicId": "clinskin/ssbfmhkhvink715awje6"
            },
            "variants": [
                {
                    "color": {
                        "name": "04 GINGER",
                        "code": "#dcc1a2",
                        "image": {
                            "url": "https://bizweb.dktcdn.net/thumb/1024x1024/100/509/263/products/442466060-1187247032272361-9075248689395473213-n.jpg?v=1717485471340",
                            "publicId": "clinskin/fe5sh7ldrgyr7ie9tui9"
                        }
                    },
                    "quantity": 99,
                    "_id": "678b52ccb3642419867f5d09"
                },
                {
                    "color": {
                        "name": "02 LINGERIE",
                        "code": "#f6ddc7",
                        "image": {
                            "url": "https://bizweb.dktcdn.net/thumb/1024x1024/100/509/263/products/442466060-1187247032272361-9075248689395473213-n.jpg?v=1717485471340",
                            "publicId": "clinskin/ccuhap7xycr5c4klzka2"
                        }
                    },
                    "quantity": 100,
                    "_id": "678b52ccb3642419867f5d0a"
                }
            ],
            "enable": true,
            "tags": ["SALE"],
            "expiry": "2025-07-17T00:00:00.000Z", // Sắp hết hạn
            "isAlmostExpired": true,
            "isExpired": false,
            "capacity": "13g",
            "createdAt": "2024-10-17T14:21:52.143Z",
            "updatedAt": "2025-01-18T07:05:48.534Z",
            "slug": "(minisize)-kem-nen-che-khuyet-diem-clio-kill-cover-founwear-foundation-spf30-pa+++-13g",
            "totalQuantity": 199,
            "cost": 199388,
            "promotion": null
        },
        {
            "_id": "67111eeb0a8def8ead3e11a7",
            "name": "Kem Nền Clio Kill Cover New Matte Foundation Spf20, Pa++ 38G",
            "categories": [
                {
                    "_id": "66e004679369d7b247e5e3ef",
                    "name": "Trang điểm"
                },
                {
                    "_id": "66e008049369d7b247e5e403",
                    "name": "Trang điểm mặt"
                },
                {
                    "_id": "66e03258e5d9e3b3a57b9e36",
                    "name": "Kem nền"
                }
            ],
            "brand": {
                "_id": "66e05acd9592f7b26ca4a109",
                "name": "Club Clio"
            },
            "images": [
                {
                    "url": "https://image.hsv-tech.io/1920x0/bbx/products/2c408b39-980a-4f43-974b-adc7004a181a.webp",
                    "publicId": "clinskin/okznn4wwfeevntruhgj6",
                    "_id": "677bd7e309cb769c1a47aef7"
                }
            ],
            "price": 779000,
            "description": "<p><strong>Công dụng:</strong> kem nền Clio Kill Cover New Matte Foundation là kem nền mới nhất của thương hiệu Clio nổi tiếng.</p>",
            "mainImage": {
                "url": "https://image.hsv-tech.io/1920x0/bbx/products/2c408b39-980a-4f43-974b-adc7004a181a.webp",
                "publicId": "clinskin/jgyam5sn6cklepz703xr"
            },
            "variants": [
                {
                    "color": {
                        "name": "04 GINGER",
                        "code": "#fddbbf",
                        "image": {
                            "url": "https://image.hsv-tech.io/1920x0/bbx/products/2c408b39-980a-4f43-974b-adc7004a181a.webp",
                            "publicId": "clinskin/f3ganblrclh8zwfoeynb"
                        }
                    },
                    "quantity": 100,
                    "_id": "677bd7e309cb769c1a47aef8"
                }
            ],
            "enable": true,
            "tags": ["NEW"],
            "expiry": "2025-09-17T00:00:00.000Z", // Sắp hết hạn
            "isAlmostExpired": true,
            "isExpired": false,
            "capacity": "38G",
            "createdAt": "2024-10-17T14:27:55.181Z",
            "updatedAt": "2025-01-18T04:49:11.059Z",
            "slug": "kem-nen-clio-kill-cover-new-matte-foundation-spf20-pa++-38g",
            "totalQuantity": 100,
            "cost": 467400,
            "promotion": null
        },
        {
            "_id": "67111e3a0a8def8ead3e11a2",
            "name": "Kem Nền Bóng Mượt Clio Kill Cover Glow Foundation Spf50+ Pa++++ 38G",
            "categories": [
                {
                    "_id": "66e004679369d7b247e5e3ef",
                    "name": "Trang điểm"
                },
                {
                    "_id": "66e008049369d7b247e5e403",
                    "name": "Trang điểm mặt"
                },
                {
                    "_id": "66e03258e5d9e3b3a57b9e36",
                    "name": "Kem nền"
                }
            ],
            "brand": {
                "_id": "66e05acd9592f7b26ca4a109",
                "name": "Club Clio"
            },
            "images": [
                {
                    "url": "https://image.hsv-tech.io/1987x0/bbx/products/55a07446-84e7-4e7a-bcc9-ecd61d369db2.webp",
                    "publicId": "clinskin/umfssq2tmeg7xgewqhzg",
                    "_id": "677bd7da09cb769c1a47aeeb"
                }
            ],
            "price": 779000,
            "description": "<p><strong>- Công dụng chính:</strong> Kem nền lâu trôi Clio cho lớp make-up nền ẩm mượt, mịn màng đồng thời giúp cấp ẩm.</p>",
            "mainImage": {
                "url": "https://image.hsv-tech.io/1987x0/bbx/products/55a07446-84e7-4e7a-bcc9-ecd61d369db2.webp",
                "publicId": "clinskin/cvldf15cbsnqyq6jdppe"
            },
            "variants": [
                {
                    "color": {
                        "name": "04 BO GINGER",
                        "code": "#f3caac",
                        "image": {
                            "url": "https://image.hsv-tech.io/1987x0/bbx/products/55a07446-84e7-4e7a-bcc9-ecd61d369db2.webp",
                            "publicId": "clinskin/yb4uqnt0jqcqvvrvembi"
                        }
                    },
                    "quantity": 99,
                    "_id": "677bd7da09cb769c1a47aeec"
                }
            ],
            "enable": true,
            "tags": ["NEW"],
            "expiry": "2025-08-20T00:00:00.000Z", // Sắp hết hạn
            "isAlmostExpired": true,
            "isExpired": false,
            "capacity": "38G",
            "createdAt": "2024-10-17T14:24:58.146Z",
            "updatedAt": "2025-01-18T04:49:11.059Z",
            "slug": "kem-nen-bong-muot-clio-kill-cover-glow-foundation-spf50+-pa++++-38g",
            "totalQuantity": 99,
            "cost": 467400,
            "promotion": null
        },
    ];

    // Paginate mock data
    const totalItems = mockProducts.length;
    const totalPage = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = mockProducts.slice(startIndex, endIndex);

    return {
        success: true,
        data: paginatedData,
        pagination: {
            page,
            totalPage,
            pageSize,
            totalItems
        }
    };
};

const DashBoard = () => {
    const [paginate, setPaginate] = useState({
        page: 1,
        pageSize: 10,
        totalPage: 0,
        totalItems: 0,
    });
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    // Mock fetch function
    const fetchProduct = async () => {
        setIsLoadingProducts(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockResponse = generateMockProductData(paginate.page, paginate.pageSize);

        if (mockResponse.success) {
            setProducts(mockResponse.data);
            setPaginate((prev) => ({
                ...prev,
                ...mockResponse.pagination,
            }));
        }

        setIsLoadingProducts(false);
    };

    useEffect(() => {
        fetchProduct();
    }, [paginate.page, paginate.pageSize]);

    return (
        <div className="space-y-4 p-4">
            <StatsOverview />
            <StatsRevenueOrder />
            <StatsReview />
            <Card className="shadow-lg" bordered={false}>
                <div className="flex items-center justify-between mb-2 flex-wrap">
                    <h2 className="text-xl font-bold m-0">
                        Sản phẩm sắp hết hạn
                        <span className="text-sm text-gray-500 font-normal ml-2">
                            ({paginate.totalItems} sản phẩm)
                        </span>
                    </h2>
                    <Button
                        disabled={products.length === 0}
                        type="primary"
                        icon={<PlusOutlined />}
                        className={`bg-indigo-600 ${products.length > 0 ? "hover:bg-indigo-700" : ""
                            } w-full sm:w-auto`}
                    >
                        Tạo khuyến mãi
                    </Button>
                </div>
                <TableProductAlmostExpired
                    {...{
                        products,
                        setPaginate,
                        paginate,
                        isLoading: isLoadingProducts,
                    }}
                />
            </Card>
        </div>
    );
};

export default DashBoard;