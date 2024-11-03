import React from 'react'
import { Link } from 'react-router-dom';

const Career = () => {
    return (
        <div className="min-h-screen ">
            {/* Banner Section */}
            <section className="bg-primary-default py-20 m-4 relative">
                <div className="text-center text-white">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome to Our Career Page</h1>
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
            {/* Introduction Section */}
            {/* Hero Section */}
            {/* <section className="mb-12 text-center">
                <img
                    src="/path/to/career-hero.jpg" // Replace with your image path
                    alt="Career Opportunities"
                    className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
                />
                <h1 className="text-5xl font-bold mb-4 text-gray-800">Join Our Team</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    At Golden Life, we’re always looking for passionate and talented individuals to join our dynamic team.
                    Explore exciting career opportunities and take the next step in your professional journey.
                </p>
            </section> */}

            {/* Job Openings Section */}
            <section className="mb-12">
                <h2 className="text-4xl font-semibold mb-8 text-center text-gray-800">Current Openings</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Sample Job Card */}
                    <div className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white hover:shadow-xl transition">
                        <img
                            src="/path/to/frontend-dev.jpg" // Replace with an image related to the job
                            alt="Frontend Developer"
                            className="w-full h-40 object-cover rounded-t-lg mb-4"
                        />
                        <h3 className="text-2xl font-semibold mb-2 text-gray-800">Frontend Developer</h3>
                        <p className="text-gray-600 mb-4">
                            We are looking for a skilled Frontend Developer with experience in React and TypeScript to join our team.
                        </p>
                        <Link
                            to="/careers/frontend-developer"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            View Details
                        </Link>
                    </div>

                    {/* Additional Job Cards */}
                    <div className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white hover:shadow-xl transition">
                        <img
                            src="/path/to/backend-dev.jpg" // Replace with an image related to the job
                            alt="Backend Developer"
                            className="w-full h-40 object-cover rounded-t-lg mb-4"
                        />
                        <h3 className="text-2xl font-semibold mb-2 text-gray-800">Backend Developer</h3>
                        <p className="text-gray-600 mb-4">
                            Seeking an experienced Backend Developer proficient in Node.js and MongoDB.
                        </p>
                        <Link
                            to="/careers/backend-developer"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            View Details
                        </Link>
                    </div>
                    {/* Additional Job Cards */}
                    <div className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white hover:shadow-xl transition">
                        <img
                            src="/path/to/backend-dev.jpg" // Replace with an image related to the job
                            alt="Backend Developer"
                            className="w-full h-40 object-cover rounded-t-lg mb-4"
                        />
                        <h3 className="text-2xl font-semibold mb-2 text-gray-800">Backend Developer</h3>
                        <p className="text-gray-600 mb-4">
                            Seeking an experienced Backend Developer proficient in Node.js and MongoDB.
                        </p>
                        <Link
                            to="/careers/backend-developer"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            View Details
                        </Link>
                    </div>
                    {/* Additional Job Cards */}
                    <div className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white hover:shadow-xl transition">
                        <img
                            src="/path/to/backend-dev.jpg" // Replace with an image related to the job
                            alt="Backend Developer"
                            className="w-full h-40 object-cover rounded-t-lg mb-4"
                        />
                        <h3 className="text-2xl font-semibold mb-2 text-gray-800">Backend Developer</h3>
                        <p className="text-gray-600 mb-4">
                            Seeking an experienced Backend Developer proficient in Node.js and MongoDB.
                        </p>
                        <Link
                            to="/careers/backend-developer"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </section>

            {/* Join Our Team Section */}
            <section className="bg-blue-50 p-8 rounded-lg text-center">
                <h2 className="text-4xl font-bold mb-4 text-blue-900">Why Work with Us?</h2>
                <p className="text-gray-700 mb-6">
                    We offer a collaborative work environment, competitive salaries, and growth opportunities. Join us and be part of a company that values innovation and creativity.
                </p>
                <Link
                    to="/contact-us"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    Contact Us for Career Opportunities
                </Link>
            </section>
        </div>
    );
}

export default Career