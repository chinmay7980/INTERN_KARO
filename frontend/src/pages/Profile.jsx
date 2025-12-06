import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Github, MapPin, Clock, DollarSign, ExternalLink, Trash2, Edit2, X } from 'lucide-react';

const Profile = () => {
    const { user, logout, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [githubData, setGithubData] = useState(null);
    const [savedInternships, setSavedInternships] = useState([]);
    const [loading, setLoading] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        githubUsername: '',
        skills: '',
    });

    useEffect(() => {
        const fetchSavedInternships = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5001/api/user/saved', config);
                setSavedInternships(data);
            } catch (error) {
                console.error('Failed to fetch saved internships');
            }
        };

        if (user) {
            fetchSavedInternships();
            // Also fetch current profile data including GitHub info
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            // We might need an endpoint to get full profile details if not already in user context
            // For now assuming user context has basic info, but we might want to fetch fresh data
        } catch (error) {
            console.error(error);
        }
    };

    const fetchGithubData = async () => {
        setSyncLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5001/api/github/profile', config);
            setGithubData(data);
            toast.success('GitHub profile synced successfully');
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Failed to sync GitHub profile';
            toast.error(errorMessage);
        } finally {
            setSyncLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete('http://localhost:5001/api/user/account', config);
            toast.success('Account deactivated successfully');
            logout();
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete account');
        }
    };

    const handleEditProfile = () => {
        setEditFormData({
            name: user?.name || '',
            email: user?.email || '',
            githubUsername: user?.githubUsername || '',
            skills: user?.skills?.join(', ') || '',
        });
        setShowEditModal(true);
    };

    const handleEditInputChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            };

            const dataToSend = {
                name: editFormData.name,
                email: editFormData.email,
                githubUsername: editFormData.githubUsername,
                skills: editFormData.skills.split(',').map(s => s.trim()).filter(s => s),
            };

            const { data } = await axios.put('http://localhost:5001/api/user/profile', dataToSend, config);

            // Update user in context
            updateUser({
                name: data.name,
                email: data.email,
                githubUsername: data.githubUsername,
                skills: data.skills,
            });

            toast.success('Profile updated successfully!');
            setShowEditModal(false);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Profile Header */}
            <div className="bg-white shadow rounded-xl overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32"></div>
                <div className="px-6 py-4 relative">
                    <div className="absolute -top-16 left-6">
                        <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
                            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-gray-500">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        </div>
                    </div>
                    <div className="ml-36 pt-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                                <p className="text-gray-500">{user?.email}</p>
                                <div className="mt-2 flex items-center gap-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {user?.role || 'Student'}
                                    </span>
                                    {user?.githubUsername && (
                                        <span className="inline-flex items-center gap-1 text-gray-600">
                                            <Github className="h-4 w-4" />
                                            {user.githubUsername}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleEditProfile}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <Edit2 className="h-4 w-4" />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Skills & GitHub */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Skills Section */}
                    <div className="bg-white shadow rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Skills</h3>
                            <button
                                onClick={fetchGithubData}
                                disabled={syncLoading || !user?.githubUsername}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                            >
                                {syncLoading ? 'Syncing...' : 'Sync with GitHub'}
                            </button>
                        </div>

                        {githubData?.skills || user?.skills ? (
                            <div className="flex flex-wrap gap-2">
                                {(githubData?.skills || user?.skills || []).map((skill, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No skills listed. Sync with GitHub to auto-populate skills from your repositories.
                            </p>
                        )}
                    </div>

                    {/* GitHub Stats */}
                    {githubData && (
                        <div className="bg-white shadow rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">GitHub Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-gray-900">{githubData.public_repos || 0}</div>
                                    <div className="text-xs text-gray-500">Repositories</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-gray-900">{githubData.followers || 0}</div>
                                    <div className="text-xs text-gray-500">Followers</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Saved Internships & Repos */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Saved Internships */}
                    <div className="bg-white shadow rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Saved Internships</h3>
                            <Link to="/saved-internships" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                View All
                            </Link>
                        </div>
                        {savedInternships.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {savedInternships.slice(0, 3).map((internship) => (
                                    <div key={internship._id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-900">
                                                    <Link to={`/internships/${internship._id}`} className="hover:text-blue-600">
                                                        {internship.title}
                                                    </Link>
                                                </h4>
                                                <p className="text-gray-500">{internship.company}</p>
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {internship.stipend}
                                            </span>
                                        </div>
                                        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" /> {internship.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" /> {internship.duration}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No saved internships yet.
                            </div>
                        )}
                    </div>

                    {/* Repositories */}
                    {githubData?.repos && (
                        <div className="bg-white shadow rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900">Top Repositories</h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {githubData.repos.map((repo) => (
                                    <div key={repo.name} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                                    {repo.name}
                                                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                    {repo.description || 'No description'}
                                                </p>
                                            </div>
                                            {repo.language && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {repo.language}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Danger Zone - Delete Account */}
            <div className="mt-8 bg-white shadow rounded-xl overflow-hidden border border-red-200">
                <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                    <h3 className="text-lg font-bold text-red-900">Danger Zone</h3>
                </div>
                <div className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h4 className="text-base font-medium text-gray-900">Delete Account</h4>
                            <p className="text-sm text-gray-500 mt-1">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleEditInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editFormData.email}
                                    onChange={handleEditInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Username</label>
                                <input
                                    type="text"
                                    name="githubUsername"
                                    value={editFormData.githubUsername}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={editFormData.skills}
                                    onChange={handleEditInputChange}
                                    placeholder="e.g., JavaScript, React, Node.js"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Update Profile
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Account</h2>
                        <p className="text-gray-600 mb-6">
                            Are you absolutely sure you want to delete your account? This action cannot be undone.
                            All your data, including saved internships, will be permanently removed.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    handleDeleteAccount();
                                    setShowDeleteConfirm(false);
                                }}
                                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Yes, Delete My Account
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
