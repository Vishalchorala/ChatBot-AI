import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { paths } from "../constant/paths";
import { auth } from "../firebase";
import { useSelector } from "react-redux";
import { IoArrowUndoCircleSharp } from "react-icons/io5";

const Profile = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully");
            navigate(paths.logIn);
        } catch (error) {
            toast.error("Failed to log out");
            console.error(error);
        }
    };

    const username = user?.email?.split("@")[0];
    const email = user?.email ?? "";

    const avatarUrl = useSelector((state) => state.avatar.avatarUrl);

    return (
        <div className="flex flex-col items-center justify-center h-dvh px-4 sm:px-6 md:px-8 lg:px-10 relative bg-purple-100">
            <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md text-center border border-blue-100 relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 transition active:scale-90 cursor-pointer"
                >
                    <IoArrowUndoCircleSharp className="w-8 h-8 text-gray-900 hover:opacity-80" />
                </button>
                <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto shadow-md border-2 border-white -mt-16 mb-4 object-cover"
                />
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-2">
                    {username}
                </h2>
                <h2 className="text-sm sm:text-base font-medium text-gray-600">
                    {email}
                </h2>
                <button
                    onClick={() => setShowConfirm(true)}
                    className="mt-6 w-full sm:w-auto bg-gradient-to-r from-purple-800 to-indigo-400 text-white font-semibold py-2 px-6 sm:px-8 rounded-full shadow transition-transform transform hover:opacity-80 cursor-pointer"
                >
                    Logout
                </button>
            </div>

            {showConfirm && (
                <div className="fixed inset-3 bg-opacity-20 backdrop-blur-md flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm text-center border border-gray-200">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                            Confirm Logout
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500 mt-2">
                            Are you sure you want to log out?
                        </p>
                        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full font-medium transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-gradient-to-r from-purple-800 to-indigo-400 hover:opacity-85 text-white px-4 py-2 rounded-full font-medium transition cursor-pointer"
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;