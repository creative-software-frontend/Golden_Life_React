import React from 'react';


const StoryPage: React.FC = () => {
    return (
        <div className="min-h-screen ">
           
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
