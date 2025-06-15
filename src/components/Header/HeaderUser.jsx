import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes, FaRegUserCircle } from "react-icons/fa";
import Logo from "./Logo";
import { Avatar, Button, Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { logoutUser } from "@/redux/auth/auth.slice";
import { isEmpty } from "lodash";

const HeaderUser = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Handle scroll event to change header appearance
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/");
    };

    const accoutItems = [
        {
            key: "1",
            label: (
                <div
                    className="flex items-center gap-4"
                    onClick={() => navigate("/account")}
                >
                    <UserOutlined /> <span>Tài khoản</span>
                </div>
            ),
        },
        {
            key: "2",
            label: (
                <div className="flex items-center gap-4" onClick={handleLogout}>
                    <LogoutOutlined /> <span>Đăng xuất</span>
                </div>
            ),
        },
    ];

    return (
        <div
            className={`w-full z-50 transition-all duration-300 ${isScrolled
                ? "py-2 bg-white shadow-md"
                : "py-4 bg-gradient-to-r from-pink-500 to-purple-500"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to={"/"}>
                            <Logo />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className={`font-medium hover:opacity-80 transition ${isScrolled ? "text-gray-800" : "text-white"}`}>
                            Trang chủ
                        </Link>
                        <Link to="/products" className={`font-medium hover:opacity-80 transition ${isScrolled ? "text-gray-800" : "text-white"}`}>
                            Sản phẩm
                        </Link>
                        <Link to="/skincare" className={`font-medium hover:opacity-80 transition ${isScrolled ? "text-gray-800" : "text-white"}`}>
                            Chăm sóc da
                        </Link>
                        <Link to="/promotions" className={`font-medium hover:opacity-80 transition ${isScrolled ? "text-gray-800" : "text-white"}`}>
                            Khuyến mãi
                        </Link>
                        <Link to="/about" className={`font-medium hover:opacity-80 transition ${isScrolled ? "text-gray-800" : "text-white"}`}>
                            Về chúng tôi
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <button className={`p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-200 ${isScrolled ? "text-gray-700" : "text-white"}`}>
                            <FaSearch />
                        </button>

                        {/* Cart */}
                        <Link to="/cart" className={`p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-200 ${isScrolled ? "text-gray-700" : "text-white"} relative`}>
                            <FaShoppingCart />
                            <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                0
                            </span>
                        </Link>

                        {/* User */}
                        {isAuthenticated ? (
                            <Dropdown
                                className="hidden md:flex"
                                menu={{ items: accoutItems }}
                            >
                                <div
                                    className="ant-dropdown-link flex items-center"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <Avatar
                                        src={userInfo.avatar.url}
                                        size={"large"}
                                        className="mr-2"
                                    />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-rose-700 font-extrabold text-sm text-center uppercase">
                                        {!isEmpty(userInfo) ? userInfo.name : ""}
                                    </span>
                                </div>
                            </Dropdown>
                        ) : (
                            <Button
                                onClick={() => navigate("/auth")}
                                type="text"
                                icon={<FaRegUserCircle className="text-3xl" />}
                                className="hidden md:flex text-base font-medium"
                            >
                                Đăng nhập
                            </Button>
                        )}


                        {/* Mobile menu button */}
                        <button
                            className={`md:hidden p-2 rounded-full ${isScrolled ? "text-gray-700" : "text-white"}`}
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white mt-2 rounded-md shadow-lg py-4 absolute left-4 right-4">
                        <nav className="flex flex-col space-y-3">
                            <Link to="/" className="px-4 py-2 hover:bg-pink-50 text-gray-800">
                                Trang chủ
                            </Link>
                            <Link to="/products" className="px-4 py-2 hover:bg-pink-50 text-gray-800">
                                Sản phẩm
                            </Link>
                            <Link to="/skincare" className="px-4 py-2 hover:bg-pink-50 text-gray-800">
                                Chăm sóc da
                            </Link>
                            <Link to="/about" className="px-4 py-2 hover:bg-pink-50 text-gray-800">
                                Về chúng tôi
                            </Link>
                            <Link to="/blog" className="px-4 py-2 hover:bg-pink-50 text-gray-800">
                                Blog
                            </Link>
                        </nav>
                    </div>
                )}
            </div>

            {/* Secondary Navigation - Categories (only visible when scrolled) */}
            {isScrolled && (
                <div className="hidden md:block bg-gray-50 py-2 shadow-sm mt-1">
                    <div className="container mx-auto px-4">
                        <ul className="flex items-center justify-center space-x-8 text-sm">
                            <li>
                                <Link to="/category/face" className="text-gray-600 hover:text-pink-600 transition">
                                    Chăm sóc mặt
                                </Link>
                            </li>
                            <li>
                                <Link to="/category/body" className="text-gray-600 hover:text-pink-600 transition">
                                    Chăm sóc cơ thể
                                </Link>
                            </li>
                            <li>
                                <Link to="/category/makeup" className="text-gray-600 hover:text-pink-600 transition">
                                    Trang điểm
                                </Link>
                            </li>
                            <li>
                                <Link to="/category/sets" className="text-gray-600 hover:text-pink-600 transition">
                                    Bộ sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link to="/category/bestsellers" className="text-gray-600 hover:text-pink-600 transition">
                                    Bán chạy
                                </Link>
                            </li>
                            <li>
                                <Link to="/category/new" className="text-gray-600 hover:text-pink-600 transition">
                                    Mới nhất
                                </Link>
                            </li>
                            <li>
                                <Link to="/category/promotion" className="text-gray-600 hover:text-pink-600 transition">
                                    Khuyến mãi
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderUser;