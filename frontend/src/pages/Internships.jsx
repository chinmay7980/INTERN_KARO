import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Internships = () => {
    const { user } = useContext(AuthContext);
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('http://localhost:5001/api/internships', config);
                setInternships(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchInternships();
        }
    }, [user]);

    const filteredInternships = internships.filter((internship) =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.skillsRequired.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">All Internships</h1>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by title, company, or skills..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <p>Loading internships...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInternships.map((internship) => (
                        <div key={internship._id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-gray-900">{internship.title}</h3>
                            <p className="text-gray-600 mb-2">{internship.company}</p>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <span className="mr-4">{internship.location}</span>
                                <span>{internship.stipend}</span>
                            </div>
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    {internship.skillsRequired.slice(0, 3).map((skill, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                    {internship.skillsRequired.length > 3 && (
                                        <span className="text-xs text-gray-500">+{internship.skillsRequired.length - 3} more</span>
                                    )}
                                </div>
                            </div>
                            <Link
                                to={`/internships/${internship._id}`}
                                className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Internships;
