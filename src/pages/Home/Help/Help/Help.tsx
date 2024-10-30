import React, { useState } from 'react';
import { XCircle } from 'lucide-react';

const HelpSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <section className="bg-primary-default py-16 m-4">
      <div className="text-center text-white">
        <h2 className="text-3xl font-bold mb-4">How Can We Help You?</h2>
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type keywords to find an answer"
            className="w-full px-4 py-2 rounded-full border-2 border-white text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-green-500"
            >
              <XCircle size={24} />
            </button>
          )}
        </div>
        <button className="mt-4 px-4 py-2 bg-white text-primary-default rounded-full font-semibold hover:bg-gray-100">
          All
        </button>
      </div>
    </section>
  );
};

export default HelpSection;
