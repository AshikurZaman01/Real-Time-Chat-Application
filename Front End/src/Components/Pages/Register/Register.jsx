import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from "../../../features/Users/userSlice";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error, user: registeredUser } = useSelector(state => state.user);

    const [user, setUser] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: ''
    });

    const [imagePreview, setImagePreview] = useState("");
    const [errors, setErrors] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: ""
    });

    const [successMessage, setSuccessMessage] = useState(null);

    // State to manage password visibility
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    // Handle form validation
    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        if (!user.userName) {
            errors.userName = "Username is required.";
            formIsValid = false;
        }
        if (!user.email) {
            errors.email = "Email is required.";
            formIsValid = false;
        }
        if (!user.password) {
            errors.password = "Password is required.";
            formIsValid = false;
        }
        if (!user.confirmPassword) {
            errors.confirmPassword = "Confirm Password is required.";
            formIsValid = false;
        }
        if (!user.image) {
            errors.image = "Image is required.";
            formIsValid = false;
        }

        if (user.password !== user.confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
            formIsValid = false;
        }

        setErrors(errors);
        return formIsValid;
    };

    const inputHandler = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            const file = files[0];
            setUser(prevState => ({
                ...prevState,
                [name]: file
            }));
            if (file) {
                setImagePreview(URL.createObjectURL(file));
            }
        } else {
            setUser(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = new FormData();
            formData.append('userName', user.userName);
            formData.append('email', user.email);
            formData.append('password', user.password);
            formData.append('image', user.image);

            try {
                const response = await dispatch(createUser(formData)).unwrap();
                const { token } = response;
                localStorage.setItem('token', token);

                // Trigger success message and redirect
                setSuccessMessage("User registered successfully!");
            } catch (err) {
                // Handle registration error
                console.error(err);
            }
        }
    };

    // Show success message and reset form if registration is successful
    useEffect(() => {
        if (registeredUser && !isLoading) {
            setUser({
                userName: "",
                email: "",
                password: "",
                confirmPassword: "",
                image: ''
            });
            setImagePreview(""); // Clear image preview
            setErrors({
                userName: "",
                email: "",
                password: "",
                confirmPassword: "",
                image: ""
            });
            setTimeout(() => {
                setSuccessMessage(null); // Hide the message after 3 seconds
                navigate("/"); // Redirect to login page
            }, 3000);
        }
    }, [registeredUser, isLoading, navigate]);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(prev => !prev);
    };

    // Toggle confirm password visibility
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(prev => !prev);
    };

    return (
        <motion.div
            className="bg-gray-900 min-h-screen flex items-center justify-center p-4"
            initial={{ opacity: 0, skew: 10 }}
            animate={{ opacity: 1, skew: 0 }}
            exit={{ opacity: 0, skew: -10 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <div className="bg-slate-600 p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-3xl font-bold text-center mb-6 text-white">Register</h1>

                {/* Success Message */}
                {successMessage && (
                    <motion.div
                        className="bg-green-500 text-white text-center py-2 mb-4 rounded"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {successMessage}
                    </motion.div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.div
                        className="bg-red-500 text-white text-center py-2 mb-4 rounded"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {error}
                    </motion.div>
                )}

                <form className="space-y-4" onSubmit={submitHandler}>
                    {/* Username Input */}
                    <div>
                        <label className="block text-gray-300 font-semibold mb-1 text-sm">Username</label>
                        <input
                            type="text"
                            name="userName"
                            value={user.userName}
                            onChange={inputHandler}
                            className="w-full border border-gray-500 rounded-md px-3 py-2 bg-gray-700 text-gray-100 text-sm"
                            placeholder="Enter your username"
                        />
                        {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName}</p>}
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-gray-300 font-semibold mb-1 text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={inputHandler}
                            className="w-full border border-gray-500 rounded-md px-3 py-2 bg-gray-700 text-gray-100 text-sm"
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-gray-300 font-semibold mb-1 text-sm">Password</label>
                        <div className="relative">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                name="password"
                                value={user.password}
                                onChange={inputHandler}
                                className="w-full border border-gray-500 rounded-md px-3 py-2 bg-gray-700 text-gray-100 text-sm"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
                            >
                                {passwordVisible ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label className="block text-gray-300 font-semibold mb-1 text-sm">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={confirmPasswordVisible ? "text" : "password"}
                                name="confirmPassword"
                                value={user.confirmPassword}
                                onChange={inputHandler}
                                className="w-full border border-gray-500 rounded-md px-3 py-2 bg-gray-700 text-gray-100 text-sm"
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
                            >
                                {confirmPasswordVisible ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {/* Image Upload with Preview */}
                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <label className="block text-gray-300 font-semibold mb-1 text-sm">Upload Image</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={inputHandler}
                                className="w-full border border-gray-500 rounded-md px-3 py-2 bg-gray-700 text-gray-100 text-sm"
                            />
                            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                        </div>

                        {imagePreview && (
                            <div className="w-16 h-16 overflow-hidden rounded-full border border-gray-500">
                                <img
                                    src={imagePreview}
                                    alt="Image preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-sm"
                            disabled={isLoading}
                        >
                            {isLoading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>

                {/* Login Link */}
                <p className="text-center mt-4 text-gray-300 text-sm">
                    Already have an account? <Link to="/" className="text-blue-400 hover:underline">Login</Link>
                </p>
            </div>
        </motion.div>
    );
};

export default Register;
