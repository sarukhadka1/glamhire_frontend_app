import React, { useState } from 'react';
import { forgotPasswordApi, verifyOtpApi } from '../../apis/Api';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';
import './Forgot_password.css'; 

const ForgotPassword = () => {
    const [phone, setPhone] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleSendOtp = (e) => {
        e.preventDefault();
        forgotPasswordApi({ phone }).then((res) => {
            if (res.status === 200) {
                toast.success(res.data.message);
                setIsSent(true);
            }
        }).catch((error) => {
            toast.error(error.response?.data?.message || 'Error occurred');
        });
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        const data = { phone, otp, newPassword };
        verifyOtpApi(data).then((res) => {
            if (res.status === 200) {
                toast.success(res.data.message);
            }
        }).catch((error) => {
            toast.error(error.response?.data?.message || 'Error occurred');
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="small-form-container">
                <h3>Forgot Password</h3>
                <form>
                    <div className="mb-4">
                        <label>Phone</label>
                        <div className="flex items-center">
                            <span className="mr-2 text-pink-700">+977</span>
                            <input
                                disabled={isSent}
                                onChange={(e) => setPhone(e.target.value)}
                                type="number"
                                className="form-control"
                                placeholder="Enter valid phone number"
                            />
                        </div>
                    </div>
                    <button
                        disabled={isSent}
                        onClick={handleSendOtp}
                        className="w-full mb-4"
                    >
                        Send OTP
                    </button>

                    {isSent && (
                        <>
                            <p>OTP has been sent to {phone} ✅</p>
                            <div className="mb-4">
                                <label>OTP</label>
                                <input
                                    onChange={(e) => setOtp(e.target.value)}
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter valid OTP"
                                />
                            </div>
                            <div className="mb-4">
                                <label>New Password</label>
                                <input
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    type="password"
                                    className="form-control"
                                    placeholder="Set new password"
                                />
                            </div>
                            <button
                                onClick={handleVerifyOtp}
                                className="w-full"
                            >
                                Verify OTP and Set Password
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
