import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
    // loading
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-pink-50" >
            <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="w-16 h-16 mb-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#FF424E"
                    >
                        <path d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM16.5 16.5C15.37 17.63 13.89 18.25 12.35 18.25C10.81 18.25 9.33 17.63 8.2 16.5C7.07 15.37 6.45 13.89 6.45 12.35C6.45 10.81 7.07 9.33 8.2 8.2C9.33 7.07 10.81 6.45 12.35 6.45C13.89 6.45 15.37 7.07 16.5 8.2C17.63 9.33 18.25 10.81 18.25 12.35C18.25 13.89 17.63 15.37 16.5 16.5Z" />
                    </svg>
                </motion.div>
                <motion.div
                    className={`text-pink-600 font-semibold text-xl`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Đang tải...
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Loading;
