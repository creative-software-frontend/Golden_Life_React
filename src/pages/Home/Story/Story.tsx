import React from 'react';
import { Link } from 'react-router-dom';

const StoryPage: React.FC = () => {
    return (
        <div className="min-h-screen ">
            {/* Banner Section */}
            <section className="bg-primary-default py-20 m-4 relative">
                <div className="text-center text-white">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome to Our Story Page</h1>
                    {/*  */}
                    <button className="mt-4 px-4 py-2 bg-white text-primary-default rounded-full font-semibold hover:bg-gray-100">
                        Explore Stories
                    </button>
                </div>
            </section>




            {/* Tabs Section */}
            {/* for small screen */}
            <div className='m-4'>
                <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                        Select a tab
                    </label>
                    <select
                        id="tabs"
                        name="tabs"
                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        defaultValue="Team Members" // Set the default value to the current tab
                    >
                        <option value="My Account">My Account</option>
                        <option value="Company">Company</option>
                        <option value="Team Members">Team Members</option>
                        <option value="Billing">Billing</option>
                    </select>
                </div>

                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">


                            <Link
                                to="/our-story"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                            >
                                Our Story
                            </Link>
                            <Link
                                to='/help'
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                            >
                                FAQ
                            </Link>

                            <Link
                                to="/career"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                            >
                                Career
                            </Link>
                            <Link
                                to="/contact"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                            >
                                Contact
                            </Link>
                            <Link
                                to="/privacy-policy"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                to="/terms"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                            >
                                Terms of use
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
            {/* Story Description */}
            <section className="bg-white p-6 md:p-12 shadow-md rounded-lg mx-4 md:mx-auto max-w-4xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">About This Story</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                    Welcome to our story page, where narratives come alive with rich detail and heartfelt expression.
                    We take pride in crafting stories that not only inform but also inspire and resonate with our readers.
                    Every story is designed to provide an immersive experience that transports you into the heart of the narrative.
                </p>
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 mb-4">
                    "Stories are the compass of life; they guide, entertain, and leave an everlasting impact."
                </blockquote>
                <p className="text-gray-600 mb-4 leading-relaxed">
                    Our collection ranges from tales of personal triumph and community spirit to profound reflections on
                    life's challenges and triumphs. Whether it's a short anecdote or a detailed journey, each story is
                    carefully curated to touch your heart and mind. The power of storytelling lies in its ability to create
                    connections and inspire change, and we strive to bring that power to you through our stories.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">What You'll Discover:</h3>
                    <ul className="list-disc list-inside text-gray-600">
                        <li>Inspirational journeys and real-life stories</li>
                        <li>Educational and thought-provoking content</li>
                        <li>Personal experiences that resonate with readers</li>
                    </ul>
                </div>
                <p className="text-gray-600 mt-4 leading-relaxed">
                    We invite you to dive into our stories, explore new perspectives, and find inspiration. Let each story
                    remind you of the beauty of human experiences and the power of shared narratives.
                </p>
            </section>
        </div>
    );
};

export default StoryPage;
