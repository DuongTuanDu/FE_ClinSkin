const MOCK_DATA = {
    "success": true,
    "data": [
        {
            "_id": "66e004e99369d7b247e5e3fb",
            "name": "Chăm sóc cá nhân",
            "parent": null,
            "level": 0,
            "createdAt": "2024-09-10T08:35:53.499Z",
            "updatedAt": "2024-09-10T08:35:53.499Z",
            "slug": "cham-soc-ca-nhan",
            "__v": 0
        },
        {
            "_id": "66e004ef9369d7b247e5e3fe",
            "name": "Chăm sóc cơ thể",
            "parent": null,
            "level": 0,
            "createdAt": "2024-09-10T08:35:59.982Z",
            "updatedAt": "2024-09-10T08:35:59.982Z",
            "slug": "cham-soc-co-the",
            "__v": 0
        },
        {
            "_id": "66e004d69369d7b247e5e3f8",
            "name": "Chăm sóc da",
            "parent": null,
            "level": 0,
            "createdAt": "2024-09-10T08:35:34.407Z",
            "updatedAt": "2024-09-10T08:35:34.407Z",
            "slug": "cham-soc-da",
            "__v": 0
        },
        {
            "_id": "66e004679369d7b247e5e3ef",
            "name": "Trang điểm",
            "parent": null,
            "level": 0,
            "createdAt": "2024-09-10T08:33:43.355Z",
            "updatedAt": "2024-09-10T08:33:43.355Z",
            "slug": "trang-diem",
            "__v": 0
        },
        {
            "_id": "66e00a269369d7b247e5e423",
            "name": "Chăm sóc toàn thân",
            "parent": "66e004ef9369d7b247e5e3fe",
            "level": 1,
            "createdAt": "2024-09-10T08:58:14.894Z",
            "updatedAt": "2024-09-10T08:58:14.894Z",
            "slug": "cham-soc-toan-than",
            "__v": 0
        },
        {
            "_id": "66e00a339369d7b247e5e427",
            "name": "Chăm sóc tóc",
            "parent": "66e004ef9369d7b247e5e3fe",
            "level": 1,
            "createdAt": "2024-09-10T08:58:27.737Z",
            "updatedAt": "2024-09-10T08:58:27.737Z",
            "slug": "cham-soc-toc",
            "__v": 0
        },
        {
            "_id": "66e009929369d7b247e5e417",
            "name": "Dưỡng da",
            "parent": "66e004d69369d7b247e5e3f8",
            "level": 1,
            "createdAt": "2024-09-10T08:55:46.428Z",
            "updatedAt": "2024-09-10T08:55:46.428Z",
            "slug": "duong-da",
            "__v": 0
        },
        {
            "_id": "66e009a09369d7b247e5e41b",
            "name": "Làm sạch",
            "parent": "66e004d69369d7b247e5e3f8",
            "level": 1,
            "createdAt": "2024-09-10T08:56:00.558Z",
            "updatedAt": "2024-09-10T08:56:00.558Z",
            "slug": "lam-sach",
            "__v": 0
        },
        {
            "_id": "66e009aa9369d7b247e5e41f",
            "name": "Mặt nạ",
            "parent": "66e004d69369d7b247e5e3f8",
            "level": 1,
            "createdAt": "2024-09-10T08:56:10.133Z",
            "updatedAt": "2024-09-10T08:56:10.133Z",
            "slug": "mat-na",
            "__v": 0
        },
        {
            "_id": "66e009089369d7b247e5e413",
            "name": "Trang điểm cho mắt",
            "parent": "66e004679369d7b247e5e3ef",
            "level": 1,
            "createdAt": "2024-09-10T08:53:28.837Z",
            "updatedAt": "2024-09-10T08:53:28.837Z",
            "slug": "trang-diem-cho-mat",
            "__v": 0
        },
        {
            "_id": "66e00b001369d7b247e5e431",
            "name": "Kem chống nắng",
            "parent": "66e004d69369d7b247e5e3f8",
            "level": 1,
            "createdAt": "2024-09-10T09:01:44.123Z",
            "updatedAt": "2024-09-10T09:01:44.123Z",
            "slug": "kem-chong-nang",
            "__v": 0
        },
        {
            "_id": "66e00b101369d7b247e5e435",
            "name": "Serum",
            "parent": "66e004d69369d7b247e5e3f8",
            "level": 1,
            "createdAt": "2024-09-10T09:02:00.456Z",
            "updatedAt": "2024-09-10T09:02:00.456Z",
            "slug": "serum",
            "__v": 0
        },
        {
            "_id": "66e00b201369d7b247e5e439",
            "name": "Toner",
            "parent": "66e004d69369d7b247e5e3f8",
            "level": 1,
            "createdAt": "2024-09-10T09:02:16.789Z",
            "updatedAt": "2024-09-10T09:02:16.789Z",
            "slug": "toner",
            "__v": 0
        },
        {
            "_id": "66e00b301369d7b247e5e443",
            "name": "Phấn nền",
            "parent": "66e004679369d7b247e5e3ef",
            "level": 1,
            "createdAt": "2024-09-10T09:02:32.012Z",
            "updatedAt": "2024-09-10T09:02:32.012Z",
            "slug": "phan-nen",
            "__v": 0
        },
        {
            "_id": "66e00b401369d7b247e5e447",
            "name": "Son môi",
            "parent": "66e004679369d7b247e5e3ef",
            "level": 1,
            "createdAt": "2024-09-10T09:02:48.345Z",
            "updatedAt": "2024-09-10T09:02:48.345Z",
            "slug": "son-moi",
            "__v": 0
        },
        {
            "_id": "66e00b501369d7b247e5e451",
            "name": "Dầu gội",
            "parent": "66e00a339369d7b247e5e427",
            "level": 2,
            "createdAt": "2024-09-10T09:03:04.678Z",
            "updatedAt": "2024-09-10T09:03:04.678Z",
            "slug": "dau-goi",
            "__v": 0
        },
        {
            "_id": "66e00b601369d7b247e5e455",
            "name": "Dầu xả",
            "parent": "66e00a339369d7b247e5e427",
            "level": 2,
            "createdAt": "2024-09-10T09:03:20.901Z",
            "updatedAt": "2024-09-10T09:03:20.901Z",
            "slug": "dau-xa",
            "__v": 0
        },
        {
            "_id": "66e00b701369d7b247e5e459",
            "name": "Kem dưỡng",
            "parent": "66e004d69369d7b247e5e3f8",
            "level": 1,
            "createdAt": "2024-09-10T09:03:36.234Z",
            "updatedAt": "2024-09-10T09:03:36.234Z",
            "slug": "kem-duong",
            "__v": 0
        },
        {
            "_id": "66e00b801369d7b247e5e463",
            "name": "Tinh chất",
            "parent": "66e004d69369d7b247e5e3f8",
            "level": 1,
            "createdAt": "2024-09-10T09:03:52.567Z",
            "updatedAt": "2024-09-10T09:03:52.567Z",
            "slug": "tinh-chat",
            "__v": 0
        }
    ],
    "pagination": {
        "page": 1,
        "totalPage": 2,
        "totalItems": 19,
        "pageSize": 10
    }
};

export default MOCK_DATA;