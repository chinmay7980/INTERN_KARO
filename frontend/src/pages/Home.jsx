import { Link } from 'react-router-dom';
import { Search, UserPlus, Sparkles, Send } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-white min-h-screen font-sans">

            <section className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        <div className="mb-12 lg:mb-0">
                            <h1 className="text-5xl lg:text-7xl font-semibold text-gray-900 tracking-tight mb-8 leading-tight">
                                Launch Your <br />
                                <span className="text-gray-900">Career Today.</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                                Connect with top companies and find internships that actually matter. No fluff, just opportunities.
                            </p>

                            <div className="bg-white p-2 rounded-xl shadow-xl max-w-md flex items-center border border-gray-100 ring-1 ring-gray-100">
                                <Search className="h-5 w-5 text-gray-400 ml-4" />
                                <input
                                    type="text"
                                    placeholder="What are you looking for?"
                                    className="flex-1 px-4 py-4 outline-none text-gray-900 placeholder-gray-400 font-medium"
                                />
                                <Link to="/dashboard">
                                    <button className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95">
                                        Search
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                                    alt="Team working together"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>




            <footer className="bg-gray-50 py-12 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold text-gray-900">InternKaro</span>
                    </div>

                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} InternKaro. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
