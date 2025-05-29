import React from "react";

const CustomButton = ({
    children,
    variant = "default",
    className = "",
    onClick,
    icon,
    loading = false,
    type = "button",
    disabled = false,
}) => {
    const baseStyle =
        "px-6 py-2.5 rounded-lg font-medium transition-all duration-300 text-sm relative overflow-hidden";

    const variants = {
        primary:
            "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-200/50 active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed",
        outline:
            "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-transparent",
        default:
            "bg-gray-100 hover:bg-gray-200 text-gray-800 active:bg-gray-300 disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed",
        danger:
            "bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 hover:border-rose-300 active:bg-rose-200 active:border-rose-400 disabled:bg-rose-50 disabled:border-rose-100 disabled:text-rose-300 disabled:cursor-not-allowed transition-colors duration-200",
        dangerFilled:
            "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg hover:shadow-rose-200/50 active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed",
        success:
            "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-200/50 active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed",
        successOutline:
            "border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 disabled:border-emerald-200 disabled:text-emerald-300 disabled:cursor-not-allowed",
        warning:
            "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg hover:shadow-amber-200/50 active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed",
        warningOutline:
            "border-2 border-amber-500 text-amber-600 hover:bg-amber-50 active:bg-amber-100 disabled:border-amber-200 disabled:text-amber-300 disabled:cursor-not-allowed",
        info: "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-cyan-200/50 active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed",
        infoOutline:
            "border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 active:bg-cyan-100 disabled:border-cyan-200 disabled:text-cyan-300 disabled:cursor-not-allowed",
        secondary:
            "bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white shadow-lg hover:shadow-violet-200/50 active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed",
        secondaryOutline:
            "border-2 border-violet-500 text-violet-600 hover:bg-violet-50 active:bg-violet-100 disabled:border-violet-200 disabled:text-violet-300 disabled:cursor-not-allowed",
        ghost:
            "bg-transparent hover:bg-gray-100 text-gray-700 active:bg-gray-200 disabled:bg-transparent disabled:text-gray-300 disabled:cursor-not-allowed",
        link: "bg-transparent text-blue-600 hover:text-blue-700 hover:underline p-0 h-auto disabled:text-gray-300 disabled:no-underline disabled:cursor-not-allowed shadow-none",
        dark: "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white shadow-lg hover:shadow-gray-200/50 active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed",
        darkOutline:
            "border-2 border-gray-700 text-gray-700 hover:bg-gray-50 active:bg-gray-100 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed",
    };

    return (
        <button
            type={type}
            className={`
        ${baseStyle} 
        ${variants[variant]} 
        ${className} 
        flex items-center justify-center gap-2
        disabled:shadow-none
      `}
            onClick={onClick}
            disabled={loading || disabled}
        >
            {loading ? (
                <>
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    <span className="opacity-70">Đang xử lý...</span>
                </>
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    <span>{children}</span>
                </>
            )}
        </button>
    );
};

export default CustomButton;
