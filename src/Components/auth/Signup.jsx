import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { paths } from '../../constant/paths';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup
        .string()
        .required('Confirm Password is required')
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const SignUp = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmValue, setConfirmValue] = useState('');

    const [googleLoading, setGoogleLoading] = useState(false);
    const [signUploading, setSignUpLoading] = useState(false);

    const onSubmit = async (data) => {
        setSignUpLoading(true)
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: data.name });
            // await auth.signOut();
            toast.success("Account created successfully! Please log in.");
            setTimeout(() => {
                reset();
                setPasswordValue('');
                navigate(paths.logIn);
            }, 2000);
        } catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    toast.error("This email is already registered. Please log in.");
                    break;
                case 'auth/invalid-email':
                    toast.error("Please enter a valid email address.");
                    break;
                case 'auth/internal-error':
                    toast.error("Something went wrong. Please try again.");
                    break;
                default:
                    toast.error("Sign up failed: " + error.message);
                    break;
            }
        } finally {
            setSignUpLoading(false)
        }
    };

    const handleGoogleSignIn = async () => {
        if (googleLoading) return;
        setGoogleLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Google sign-in user:", result.user);
            alert("Google sign-in successful!");
            navigate(paths.chatBot);
        } catch (error) {
            if (error.code === 'auth/popup-closed-by-user') {
                console.log("Popup closed by user.");
                toast.error("Google sign-in failed: " + error.message);
            } else if (error.code === 'auth/cancelled-popup-request') {
                console.log("Popup request was cancelled because another one was already in progress.");
            } else {
                alert("Google sign-in failed: " + error.message);
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center bg-white px-4 rounded-md"
        >
            <div className="w-full max-w-sm">
                <div className="text-center  mb-2 md:mb-6">
                    <div className="text-purple-600 text-4xl font-bold mb-2 hidden sm:block">⚡</div>
                    <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
                    <p className="text-gray-500 text-sm">Sign in to your account to proceed </p>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className={`w-full border border-gray-300 rounded-full py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium mb-1.5 md:mb-2
                         ${googleLoading ?
                            'opacity-50 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                        } transition`}
                >
                    <FcGoogle size={20} />
                    {googleLoading ? 'Signing in...' : 'Sign in with Google'}
                </button>

                <div className="flex items-center gap-2 mb-2 sm:mb-4">
                    <hr className="flex-1 border-gray-300" />
                    <span className="text-gray-400 text-xs sm:text-sm">or Sign up with Email</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 sm:space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            {...register('name')}
                            className="w-full border border-gray-300 rounded-full py-1.5 md:py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="mail@website.com"
                            {...register('email')}
                            className="w-full border border-gray-300 rounded-full py-1.5 md:py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min. 8 character"
                            {...register('password')}
                            onChange={(e) => setPasswordValue(e.target.value)}
                            className="w-full border border-gray-300 rounded-full py-1.5 md:py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {passwordValue.length > 0 && (
                            <div
                                className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        )}
                        <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
                    </div>

                    <div className="relative">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="Confirm password"
                            {...register('confirmPassword')}
                            onChange={(e) => setConfirmValue(e.target.value)}
                            className="w-full border border-gray-300 rounded-full py-1.5 md:py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {confirmValue.length > 0 && (
                            <div
                                className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-500"
                                onClick={() => setShowConfirm((prev) => !prev)}
                            >
                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        )}
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword?.message}</p>
                    </div>

                    <button
                        type="submit"
                        disabled={signUploading}
                        className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full py-1 sm:py-2 transition ${signUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {signUploading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                                Signing up...
                            </div>
                        ) : 'Sign Up'}
                    </button>

                </form>

                <p className="text-center text-sm text-gray-600 mt-3 md:mt-6">
                    Already have an account?{' '}
                    <NavLink to={paths.logIn} className="text-purple-600 font-medium hover:underline">
                        Log in
                    </NavLink>
                </p>

                <p className="text-center text-xs text-gray-500 mt-2 md:mt-8">©{new Date().getFullYear()} chatBOT. All rights reserved.</p>
            </div>
        </motion.div>
    );
};

export default SignUp;
