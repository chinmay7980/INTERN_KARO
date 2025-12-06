import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, DollarSign, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Edit, X } from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalInternships, setTotalInternships] = useState(0);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [savedInternships, setSavedInternships] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingInternship, setEditingInternship] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        company: '',
        location: '',
        duration: '',
        stipend: '',
        skillsRequired: '',
        description: '',
    });

    const limit = 9;

    const fetchInternships = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                params: {
                    page: currentPage,
                    limit,
                    ...(searchQuery && { search: searchQuery }),
                    ...(selectedLocation && { location: selectedLocation }),
                    ...(selectedSkill && { skills: selectedSkill }),
                    sortBy,
                    order: sortOrder,
                },
            };

            const { data } = await axios.get('http://localhost:5001/api/internships', config);

            if (data.internships && data.pagination) {
                setInternships(data.internships || []);
                setCurrentPage(data.pagination.currentPage || 1);
                setTotalPages(data.pagination.totalPages || 1);
                setTotalInternships(data.pagination.totalInternships || 0);
            } else if (Array.isArray(data)) {
                setInternships(data);
                setCurrentPage(1);
                setTotalPages(1);
                setTotalInternships(data.length);
            } else {
                setInternships([]);
                setCurrentPage(1);
                setTotalPages(1);
                setTotalInternships(0);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch internships');
            setInternships([]);
            setCurrentPage(1);
            setTotalPages(1);
            setTotalInternships(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedInternships = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5001/api/user/saved', config);
            setSavedInternships(data.map(i => i._id));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchInternships();
            fetchSavedInternships();
        }
    }, [currentPage, searchQuery, selectedLocation, selectedSkill, sortBy, sortOrder, user]);

    if (!user) {
        return (
            <div className="p-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold text-yellow-900 mb-2">Authentication Required</h2>
                    <p className="text-yellow-700">Please log in to view the dashboard.</p>
                </div>
            </div>
        );
    }

    const handleSearch = () => {
        setCurrentPage(1);
        fetchInternships();
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
        fetchInternships();
    };

    const handleToggleSave = async (internshipId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `http://localhost:5001/api/user/saved/${internshipId}`,
                {},
                config
            );

            if (data.isSaved) {
                setSavedInternships([...savedInternships, internshipId]);
                toast.success('Internship saved!');
            } else {
                setSavedInternships(savedInternships.filter(id => id !== internshipId));
                toast.success('Internship removed from saved');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to save internship');
        }
    };

    const handleEditClick = (internship) => {
        setEditingInternship(internship);
        setEditFormData({
            title: internship.title,
            company: internship.company,
            location: internship.location,
            duration: internship.duration,
            stipend: internship.stipend,
            skillsRequired: internship.skillsRequired.join(', '),
            description: internship.description,
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
                ...editFormData,
                skillsRequired: editFormData.skillsRequired.split(',').map(s => s.trim()),
            };

            await axios.put(
                `http://localhost:5001/api/internships/${editingInternship._id}`,
                dataToSend,
                config
            );
            toast.success('Internship updated successfully!');
            setShowEditModal(false);
            setEditingInternship(null);
            fetchInternships();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update internship');
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        if (value === 'recent') {
            setSortBy('createdAt');
            setSortOrder('desc');
        } else if (value === 'oldest') {
            setSortBy('createdAt');
            setSortOrder('asc');
        } else if (value === 'title') {
            setSortBy('title');
            setSortOrder('asc');
        }
    };

    const getPageNumbers = () => {
        if (!totalPages || totalPages <= 0) {
            return [];
        }

        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
                <p className="text-gray-500 mt-1">Explore {totalInternships} internship opportunities</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                        placeholder="Search by title, company, skill..."
                    />
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <select
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Skills</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Python">Python</option>
                        <option value="React">React</option>
                        <option value="Node.js">Node.js</option>
                        <option value="Java">Java</option>
                    </select>
                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Locations</option>
                        <option value="Remote">Remote</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Hyderabad">Hyderabad</option>
                    </select>
                    <button
                        onClick={handleApplyFilters}
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                    {searchQuery || selectedLocation || selectedSkill ? 'Search Results' : 'All Internships'}
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Sort By:</span>
                    <select
                        onChange={handleSortChange}
                        className="text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 cursor-pointer"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title">Title (A-Z)</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : internships.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {internships.map((internship) => {
                        const isSaved = savedInternships.includes(internship._id);
                        return (
                            <div key={internship._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow relative group">
                                <div className="absolute top-6 right-6 flex gap-2">
                                    {user?.role === 'admin' && (
                                        <button
                                            onClick={() => handleEditClick(internship)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Edit internship"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleToggleSave(internship._id)}
                                        className={`transition-colors ${isSaved ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'
                                            }`}
                                    >
                                        {isSaved ? (
                                            <BookmarkCheck className="h-6 w-6 fill-current" />
                                        ) : (
                                            <Bookmark className="h-6 w-6" />
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-bold text-gray-600">
                                        {internship.company.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{internship.title}</h3>
                                        <p className="text-gray-500 text-sm">{internship.company}</p>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                    {internship.description || "Join our dynamic team to work on cutting-edge projects."}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                        {internship.location}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                        {internship.duration || '3 Months'}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                        {internship.stipend}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    {internship.applyLink ? (
                                        <a
                                            href={internship.applyLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 text-center bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Apply Now
                                        </a>
                                    ) : (
                                        <button
                                            disabled
                                            className="flex-1 text-center bg-gray-300 text-gray-500 font-medium py-2.5 rounded-lg cursor-not-allowed"
                                            title="No application link available"
                                        >
                                            No Apply Link
                                        </button>
                                    )}
                                    <Link
                                        to={`/internships/${internship._id}`}
                                        className="flex-1 text-center bg-gray-100 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No internships found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search query.</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="text-gray-400">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium ${currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <h2 className="text-2xl font-bold text-gray-900">Edit Internship</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editFormData.title}
                                    onChange={handleEditInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={editFormData.company}
                                        onChange={handleEditInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={editFormData.location}
                                        onChange={handleEditInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={editFormData.duration}
                                        onChange={handleEditInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stipend *</label>
                                    <input
                                        type="text"
                                        name="stipend"
                                        value={editFormData.stipend}
                                        onChange={handleEditInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required (comma-separated)</label>
                                <input
                                    type="text"
                                    name="skillsRequired"
                                    value={editFormData.skillsRequired}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                <textarea
                                    name="description"
                                    value={editFormData.description}
                                    onChange={handleEditInputChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Update Internship
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
        </div>
    );
};

export default Dashboard;
