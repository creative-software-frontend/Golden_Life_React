import React from 'react';
import { Backpack, ArrowRight } from 'lucide-react'; // Use appropriate icons from Lucide Icons
import { Link } from 'react-router-dom'; // Import Link for routing

const Coursecatagory2 = () => {
    const grades = [
        { id: 1, label: 'HSC 24, 25, 26', color: 'bg-red-400', textColor: 'text-red-600', path: '/courses/hsc' },
        { id: 2, label: '১০ম শ্রেণি', color: 'bg-yellow-400', textColor: 'text-yellow-600', path: '/courses/ssc' },
        { id: 3, label: '৯ম শ্রেণি', color: 'bg-teal-400', textColor: 'text-teal-600', path: '/class-9' },
        { id: 4, label: '৮ম শ্রেণি', color: 'bg-orange-400', textColor: 'text-orange-600', path: '/class-8' },
        { id: 5, label: '৭ম শ্রেণি', color: 'bg-yellow-300', textColor: 'text-yellow-500', path: '/class-7' },
        { id: 6, label: '৬ষ্ঠ শ্রেণি', color: 'bg-blue-300', textColor: 'text-blue-500', path: '/class-6' },
    ];

    return (
        <div className="flex justify-between gap-2 p-2 mt-6 w-full md:max-w-[1040px]">
            {grades.map((grade) => (
                <Link
                    key={grade.id}
                    to={grade.path} // Dynamic path
                    className="flex flex-col items-center justify-between bg-[#ccfbf1] text-black p-4 rounded-md shadow-md w-40 h-35"
                >
                    {/* Icon Section */}
                    <div className={`p-3 rounded-full ${grade.color}`}>
                        <Backpack className="text-white w-6 h-6" />
                    </div>
                    {/* Text Section */}
                    <p className="mt-2 text-center font-semibold text-sm">{grade.label}</p>
                    {/* Arrow */}
                    <ArrowRight className="w-4 h-4 text-black mt-2" />
                </Link>
            ))}
        </div>
    );
};

export default Coursecatagory2;
