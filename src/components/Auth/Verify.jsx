import React, { useState, useRef, useEffect } from "react";
import { sendOtp, verifyAccount } from "@redux/auth/auth.thunk";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { setEmailVerify } from "@redux/auth/auth.slice";
import CustomButton from "../CustomButton";

const Verify = ({ setStep, isReset }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    const { emailVerify } = useSelector((state) => state.auth);

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((item, idx) => (idx === index ? element.value : item))]);
        if (element.value !== "") {
            if (index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && index > 0 && otp[index] === "") {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            message.warning("Vui lòng nhập đủ 6 số OTP");
            return;
        }
        const otpNumber = parseInt(otpString, 10);
        if (isNaN(otpNumber)) {
            message.error("OTP không hợp lệ. Vui lòng chỉ nhập số.");
            return;
        }
        if (emailVerify) {
            dispatch(verifyAccount({ email: emailVerify, otp: otpNumber })).then(
                (result) => {
                    if (result.payload.success) {
                        message.success(result.payload.message);
                        setOtp(["", "", "", "", "", ""]);
                        if (isReset) {
                            setStep("resetPassword");
                            return;
                        } else {
                            setStep("login");
                            dispatch(setEmailVerify(""));
                            return;
                        }
                    }
                }
            );
        }
    };

    const handleResend = () => {
        if (emailVerify) {
            dispatch(sendOtp({ email: emailVerify })).then((res) => {
                if (res.payload.success) {
                    message.success(res.payload.message);
                }
            });
        }
    };

    return (
        <div className="">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Xác thực mã OTP
            </h2>
            <p className="text-center text-gray-600 mb-8">
                Chúng tôi đã gửi mã OTP đến email của bạn. Vui lòng nhập mã để xác thực
                tài khoản.
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex justify-between">
                    {otp.map((data, index) => {
                        return (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                ref={(el) => (inputRefs.current[index] = el)}
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onFocus={(e) => e.target.select()}
                                className="w-14 h-14 border border-gray-300 rounded-lg bg-gray-50 text-center text-xl font-semibold text-gray-800 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-200"
                            />
                        );
                    })}
                </div>
                <CustomButton
                    variant="primary"
                    type="submit"
                    className="w-full mt-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                >
                    Xác thực
                </CustomButton>
            </form>
            <p className="text-center mt-6 text-sm text-gray-600">
                Bạn không nhập được mã OTP?
                <button
                    onClick={handleResend}
                    className="text-indigo-600 hover:text-indigo-800 font-medium ml-1 transition duration-200"
                >
                    Gửi lại
                </button>
            </p>
        </div>
    );
};

export default Verify;
