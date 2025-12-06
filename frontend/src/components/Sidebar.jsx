import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, Bookmark, User, LogOut, Shield } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50';
    };

    return (
        <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col">
            {/* Logo Area */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900">InternKaro</h2>
                        <p className="text-xs text-gray-500">{user?.name}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link
                    to="/dashboard"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard')}`}
                >
                    <LayoutDashboard size={20} />
                    <span className="font-medium">Dashboard</span>
                </Link>

                {user?.role === 'admin' && (
                    <Link
                        to="/admin-dashboard"
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin-dashboard')}`}
                    >
                        <Shield size={20} />
                        <span className="font-medium">Admin Panel</span>
                    </Link>
                )}

                <Link
                    to="/saved-internships"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/saved-internships')}`}
                >
                    <Bookmark size={20} />
                    <span className="font-medium">Saved Internships</span>
                </Link>

                <Link
                    to="/profile"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/profile')}`}
                >
                    <User size={20} />
                    <span className="font-medium">Profile</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
