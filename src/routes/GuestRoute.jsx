import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { paths } from '../constant/paths';
import { MoonLoader } from 'react-spinners'

const GuestRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        <div className='h-screen w-screen flex justify-center items-center bg-purple-3'>
            <MoonLoader />;
        </div>
        return
    }

    if (user) {
        return <Navigate to={paths.chatBot} replace />;
    }

    return children;
};

export default GuestRoute;
