import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const InternshipDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchInternship = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`http://localhost:5001/api/internships/${id}`, config);
                setInternship(data);

                const savedRes = await axios.get('http://localhost:5001/api/user/saved', config);
                const savedIds = savedRes.data.map(item => item._id);
                if (savedIds.includes(id)) {
                    setIsSaved(true);
                }
            } catch (error) {
                toast.error('Failed to fetch internship details');
                console.log({error: error})
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchInternship();
        }
    }, [id, user]);

    const handleSave = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`http://localhost:5001/api/user/saved/${id}`, {}, config);
            setIsSaved(data.isSaved);
            toast.success(data.message);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update saved status');
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!internship) return <div className="p-8">Internship not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-2xl leading-6 font-medium text-gray-900">{internship.title}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{internship.company}</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{internship.location}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Duration</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{internship.duration}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Stipend</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{internship.stipend}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Skills Required</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex flex-wrap gap-2">
                                    {internship.skillsRequired.map((skill, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                                {internship.description}
                            </dd>
                        </div>
                    </dl>
                </div>
                <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-end space-x-4">
                    <button
                        onClick={handleSave}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSaved
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {isSaved ? 'Unsave Internship' : 'Save Internship'}
                    </button>
                    {internship.applyLink && (
                        <a
                            href={internship.applyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Apply Now
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InternshipDetails;
