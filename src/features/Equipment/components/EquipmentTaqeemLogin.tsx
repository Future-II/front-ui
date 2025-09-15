import { useState } from "react";
import { taqeemLogin } from "../api";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export default function LoginModal({ isOpen, onClose, setIsLoggedIn }: LoginModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otpRequired, setOtpRequired] = useState(false);
    const [otp, setOtp] = useState("");
    const [progressMessage, setProgressMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!otpRequired) {
                setProgressMessage("🔑 Entering Email and Password...");
            } else {
                setProgressMessage("📲 Verifying OTP...");
            }

            const response = await taqeemLogin(email, password, otpRequired ? otp : undefined);
            console.log(response);

            if (response.status === "OTP_REQUIRED") {
                setOtpRequired(true);
                setProgressMessage("✅ Email and Password accepted. Please enter OTP.");
            } else if (response.status === "SUCCESS") {
                setIsLoggedIn(true);
                setProgressMessage("🎉 Login successful!");
                onClose();
            } else {
                setProgressMessage("❌ Login failed");
                alert("Login failed");
            }
        } catch (error) {
            console.error(error);
            setProgressMessage("⚠️ Something went wrong");
            alert("Something went wrong");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative pointer-events-auto">
                <button
                    onClick={() => setIsLoggedIn(true)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {otpRequired ? "Enter OTP" : "Login"}
                </h2>

                <form className="space-y-4">
                    {otpRequired ? (
                        <div>
                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium text-gray-700"
                            >
                                OTP
                            </label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    ) : (
                        <>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                        onClick={handleSubmit}
                    >
                        {otpRequired ? "Verify OTP" : "Sign In"}
                    </button>
                </form>

                {/* Progress message at bottom */}
                {progressMessage && (
                    <div className="mt-4 text-sm text-indigo-600 text-center">
                        {progressMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
