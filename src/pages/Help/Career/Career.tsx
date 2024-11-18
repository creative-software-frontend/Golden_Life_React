import { Link } from 'react-router-dom';

const Career = () => {
    return (
        <div className="min-h-screen ">








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