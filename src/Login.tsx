import React, { useState } from "react";
import NumericKeypad from "./components/NumericKeypad";
import { API_URL } from "./lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginProps {
    onLogin: (userId: string) => void;
}

interface LoginResponse {
    message: string;
    user: {
        id: string;
        emailOrPhone: string;
        passcode: string;
        location: string;
        manualLocation: boolean;
    };
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [identifier, setIdentifier] = useState("");
    const [passcode, setPasscode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^\d{6}$/.test(passcode)) {
            toast.error("Please enter a valid 6-digit passcode");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    emailOrPhone: identifier,
                    passcode: passcode,
                }),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data: LoginResponse = await response.json();

            // If we got here, we have a valid response with the expected structure
            onLogin(data.user.id);
        } catch (err) {
            toast.error("Login failed. Please check your credentials and try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-zinc-100">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xs bg-white p-8 rounded shadow-md text-center"
            >
                <h2 className="text-2xl font-bold mb-4 text-zinc-700">Login</h2>
                {/* Styled Email or Phone input */}
                <input
                    type="text"
                    placeholder="Email or Phone"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 mb-4 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-500"
                />
                {/* NumericKeypad for passcode input */}
                <NumericKeypad value={passcode} onChange={setPasscode} maxLength={6} />

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`mt-6 w-full bg-zinc-700 text-white py-2 rounded hover:bg-zinc-800 ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
