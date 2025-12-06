import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const OAuthSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setUserFromOAuth } = useContext(AuthContext);

    useEffect(() => {
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');
        const name = searchParams.get('name');
        const email = searchParams.get('email');
        const role = searchParams.get('role');
        const githubUsername = searchParams.get('githubUsername');

        if (token && userId && name && email && role) {
            const userInfo = {
                _id: userId,
                name: decodeURIComponent(name),
                email: decodeURIComponent(email),
                role,
                token,
                githubUsername: githubUsername ? decodeURIComponent(githubUsername) : undefined,
            };

            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            setUserFromOAuth(userInfo);
            toast.success('Successfully logged in with GitHub!');

            // Add small delay to ensure context is updated
            setTimeout(() => {
                navigate('/dashboard');
            }, 100);
        } else {
            toast.error('Authentication failed. Please try again.');
            navigate('/login');
        }
    }, [searchParams, navigate, setUserFromOAuth]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Completing GitHub authentication...</p>
            </div>
        </div>
    );
};

export default OAuthSuccess;
