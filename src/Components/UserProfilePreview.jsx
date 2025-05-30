import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { paths } from '../constant/paths';
import { useSelector } from 'react-redux';

const UserProfilePreview = () => {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);
    const email = user?.email ?? "";
    const username = email.split('@')[0];

    const avatarUrl = useSelector((state) => state.avatar.avatarUrl);
    return (
        <div
            className="mt-4 border-t border-t-gray-400 pt-3 flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(paths.profile)}
        >
            <img
                src={avatarUrl}
                alt="User"
                className="w-10 h-10 rounded-full border border-purple-300"
            />
            <div>
                <p className="font-semibold text-sm text-purple-800">{username}</p>
                <p className="text-xs text-gray-500">{email}</p>
            </div>
        </div>
    );
};

export default UserProfilePreview;
