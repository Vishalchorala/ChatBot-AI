import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../constant/paths';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleReset = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset email sent!');
            setTimeout(() => {
                navigate(paths.logIn)
            }, 2000);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                toast.error('This email is not registered.');
            } else if (error.code === 'auth/invalid-email') {
                toast.error('Invalid email address.');
            } else {
                toast.error('Error: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <form onSubmit={handleReset} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-center">Reset Your Password</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border rounded mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    type="submit"
                    className={`w-full bg-purple-600 text-white font-semibold py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700 cursor-pointer'
                        }`}
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send Reset Email'}
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">
                    We’ll send a reset link if the email is registered.
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;
