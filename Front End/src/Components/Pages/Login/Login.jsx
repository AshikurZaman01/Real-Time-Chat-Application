import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        let hasError = false;

        if (!email) {
            setEmailError("Email is required");
            hasError = true;
        } else {
            setEmailError("");
        }

        if (!password) {
            setPasswordError("Password is required");
            hasError = true;
        } else {
            setPasswordError("");
        }

        if (!hasError) {
            console.log({ email, password });
        }
    };

    return (
        <div>
            <motion.div
                className="bg-gray-900 min-h-screen flex items-center justify-center p-4"
                initial={{ opacity: 0, skew: 10 }}
                animate={{ opacity: 1, skew: 0 }}
                exit={{ opacity: 0, skew: -10 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            >
                <div className="bg-slate-600 p-8 rounded-lg shadow-lg max-w-sm w-full">
                    <h1 className="text-3xl font-bold text-center mb-6 text-white">Login</h1>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-300 font-semibold mb-1 text-sm">Email</label>
                            <input
                                type="email"
                                name="email"
                                ref={emailRef}
                                className="w-full border border-gray-500 rounded-md px-3 py-2 bg-gray-700 text-gray-100 text-sm"
                                placeholder="Enter your email"
                            />
                            {emailError && (
                                <p className="text-red-500 text-xs mt-1">{emailError}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-300 font-semibold mb-1 text-sm">Password</label>
                            <input
                                type="password"
                                name="password"
                                ref={passwordRef}
                                className="w-full border border-gray-500 rounded-md px-3 py-2 bg-gray-700 text-gray-100 text-sm"
                                placeholder="Enter your password"
                            />
                            {passwordError && (
                                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                            )}
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-sm"
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    <p className="text-center mt-4 text-gray-300 text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-400 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
