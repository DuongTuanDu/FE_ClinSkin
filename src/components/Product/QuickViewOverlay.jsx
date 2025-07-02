import React from "react";
import { EyeOutlined } from "@ant-design/icons";
import CustomButton from "../CustomButton";

const QuickViewOverlay = ({ onClick }) => {
  return (
    <div className="absolute rounded-t-lg inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
      <CustomButton
        onClick={onClick}
        icon={<EyeOutlined />}
        variant="primary"
        className="!rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
      >
        Xem ngay
      </CustomButton>
    </div>
  );
};

export default QuickViewOverlay;
