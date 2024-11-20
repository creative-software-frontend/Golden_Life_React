import React from 'react';
import { Backpack, ArrowRight } from 'lucide-react'; // Use appropriate icons from Lucide Icons

const Coursecatagory2 = () => {
    const grades = [
        { id: 1, label: 'HSC 24, 25, 26', color: 'bg-red-400', textColor: 'text-red-600' },
        { id: 2, label: '১০ম শ্রেণি', color: 'bg-yellow-400', textColor: 'text-yellow-600' },
        { id: 3, label: '৯ম শ্রেণি', color: 'bg-teal-400', textColor: 'text-teal-600' },
        { id: 4, label: '৮ম শ্রেণি', color: 'bg-orange-400', textColor: 'text-orange-600' },
        { id: 5, label: '৭ম শ্রেণি', color: 'bg-yellow-300', textColor: 'text-yellow-500' },
        { id: 6, label: '৬ষ্ঠ শ্রেণি', color: 'bg-blue-300', textColor: 'text-blue-500' },
    ];

    return (
        <div className="flex justify-between gap-4 p-4  mt-4 w-full md:max-w-[1040px]">
            {grades.map((grade) => (
                <div
                    key={grade.id}
                    className="flex flex-col items-center justify-between bg-gray-900 text-white p-4 rounded-md shadow-md w-32 h-32"
                >
                    {/* Icon Section */}
                    <div
                        className={`p-3 rounded-full ${grade.color}`}
                    >
                        <Backpack className="text-white w-6 h-6" />
                    </div>
                    {/* Text Section */}
                    <p className="mt-2 text-center font-semibold text-sm">{grade.label}</p>
                    {/* Arrow */}
                    <ArrowRight className="w-4 h-4 text-white mt-2" />
                </div>
            ))}
        </div>
    );
};

export default Coursecatagory2;
