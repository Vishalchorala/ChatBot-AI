import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { MoonLoader } from "react-spinners";
import { paths } from "../constant/paths";

const ProtectedRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);
    const location = useLocation();

    if (loading) {
        <div className='h-screen w-screen flex justify-center items-center bg-purple-3  00'>
            <MoonLoader />;
        </div>
        return
    }

    if (!user) {
        return <Navigate to={paths.logIn} state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
