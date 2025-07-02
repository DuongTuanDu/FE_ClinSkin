import { FaAward, FaCertificate, FaFlask, FaGlobeAsia, FaHeadset, FaHeart, FaLeaf, FaStar, FaTruck, FaUsers } from "react-icons/fa";
import { IoShield, IoThumbsUp } from "react-icons/io5";

export const values = [
    {
        icon: <FaHeart className="text-4xl text-red-500" />,
        title: "Tận tâm chăm sóc",
        description: "Chúng tôi luôn đặt sự hài lòng và sức khỏe làn da của khách hàng lên hàng đầu.",
    },
    {
        icon: <FaLeaf className="text-4xl text-green-500" />,
        title: "Thiên nhiên thuần khiết",
        description: "Sử dụng các thành phần tự nhiên an toàn, không gây hại cho da và môi trường.",
    },
    {
        icon: <FaFlask className="text-4xl text-blue-500" />,
        title: "Khoa học tiên tiến",
        description: "Kết hợp công nghệ mới nhất và các nghiên cứu chuyên sâu nhằm mang lại giải pháp skincare tối ưu.",
    },
    {
        icon: <IoShield className="text-4xl text-purple-500" />,
        title: "Chất lượng đảm bảo",
        description: "Chúng tôi cam kết cung cấp đầy đủ sản phẩm chính hãng với chất lượng cao nhất hiện nay.",
    }
];

export const achievements = [
    { icon: <FaUsers />, number: "10,000+", label: "Khách hàng tin tưởng" },
    { icon: <FaStar />, number: "4.8/5", label: "Đánh giá trung bình" },
    { icon: <FaAward />, number: "50+", label: "Thương hiệu uy tín" },
    { icon: <FaGlobeAsia />, number: "100%", label: "Sản phẩm chính hãng" },
    { icon: <FaCertificate />, number: "ISO", label: "Chứng nhận chất lượng" },
    { icon: <FaTruck />, number: "24h", label: "Giao hàng nhanh" },
    { icon: <FaHeadset />, number: "24/7", label: "Hỗ trợ khách hàng" },
    { icon: <IoThumbsUp />, number: "98%", label: "Hài lòng khách hàng" },
];

export const timeline = [
    {
        year: "2021",
        title: "Khởi đầu hành trình",
        content: "ClinSkin được thành lập với sứ mệnh mang đến giải pháp chăm sóc da tốt nhất cho người Việt.",
    },
    {
        year: "2022",
        title: "Mở rộng sản phẩm",
        content: "Hợp tác với các thương hiệu skincare hàng đầu thế giới như La Roche-Posay, Club Clio.",
    },
    {
        year: "2023",
        title: "Phát triển mạnh mẽ",
        content: "Ra mắt nền tảng online và đạt mốc 5,000 khách hàng tin tưởng.",
    },
    {
        year: "2024",
        title: "Hoàn thiện hệ thống",
        content: "Xây dựng hệ thống giao hàng toàn quốc và dịch vụ tư vấn chuyên nghiệp.",
    },
    {
        year: "2025",
        title: "Tương lai phát triển",
        content: "Tiếp tục mở rộng và nâng cao chất lượng dịch vụ, hướng tới trở thành thương hiệu số 1 Việt Nam.",
    },
];

export const team = [
    {
        name: "Dr. Nguyễn Thị Lan",
        role: "Chuyên gia Da liễu",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        description: "15 năm kinh nghiệm trong lĩnh vực chăm sóc da"
    },
    {
        name: "Ms. Trần Minh Anh",
        role: "Chuyên gia Skincare",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
        description: "Chuyên gia tư vấn sản phẩm làm đẹp"
    },
    {
        name: "Mr. Lê Văn Nam",
        role: "Giám đốc Kinh doanh",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        description: "10 năm kinh nghiệm trong ngành mỹ phẩm"
    }
];