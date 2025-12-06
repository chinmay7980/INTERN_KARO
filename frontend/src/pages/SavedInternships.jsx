import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Bookmark, Trash2, MapPin, Clock, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';

const backend_url = import.meta.env.VITE_BACKEND_URL

const SavedInternships = () => {
    const { user } = useContext(AuthContext);
    const [savedInternships, setSavedInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchSavedInternships();
        }
    }, [user]);

    const fetchSavedInternships = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`${backend_url}/api/user/saved`, config);
            setSavedInternships(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch saved internships');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`${backend_url}/api/user/saved/${id}`, config);
            setSavedInternships(savedInternships.filter(item => item._id !== id));
            toast.success('Internship removed from saved list');
        } catch (error) {
            console.error(error);
            toast.error('Failed to remove internship');
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Saved Internships</h1>
                <p className="text-gray-500 mt-1">Manage your bookmarked opportunities</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : savedInternships.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedInternships.map((internship) => (
                        <div key={internship._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow relative group">
                            <button
                                onClick={() => handleRemove(internship._id)}
                                className="absolute top-6 right-6 text-red-400 hover:text-red-600 transition-colors bg-white rounded-full p-1 hover:bg-red-50"
                                title="Remove from saved"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-bold text-gray-600">
                                    {internship.company.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{internship.title}</h3>
                                    <p className="text-gray-500 text-sm">{internship.company}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {internship.location}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {internship.duration}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" /> {internship.stipend}
                                </span>
                            </div>

                            <Link
                                to={`/internships/${internship._id}`}
                                className="block w-full text-center bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900">No saved internships</h3>
                    <p className="text-gray-500 mt-2 mb-6">Start exploring and save internships you're interested in.</p>
                    <Link to="/dashboard" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        Explore Internships
                    </Link>
                </div>
            )}
        </div>
    );
};

export default SavedInternships;
