import React from 'react';
import { Backpack, ArrowRight } from 'lucide-react'; // Use appropriate icons from Lucide Icons
import { Link } from 'react-router-dom'; // Import Link for routing
import { useTranslation } from 'react-i18next';

const Coursecatagory2 = () => {
    const [t] = useTranslation("global"); // Translation hook
    const grades = [
        { id: 1, label: t("course.HSC242526"), color: 'bg-red-400', textColor: 'text-red-600', path: '/courses/hsc' },
        { id: 2, label: t("course.১০ম শ্রেণি"), color: 'bg-yellow-400', textColor: 'text-yellow-600', path: '/courses/ssc' },
        { id: 3, label: t("course.৯ম শ্রেণি"), color: 'bg-teal-400', textColor: 'text-teal-600', path: '/courses/ssc' },
        { id: 4, label: t("course.৮ম শ্রেণি"), color: 'bg-orange-400', textColor: 'text-orange-600', path: '/courses/ssc' },
        { id: 5, label: t("course.৭ম শ্রেণি"), color: 'bg-yellow-300', textColor: 'text-yellow-500', path: '/courses/ssc' },
        { id: 6, label: t("course.৬ষ্ঠ শ্রেণি"), color: 'bg-blue-300', textColor: 'text-blue-500', path: '/courses/ssc' },
    ];

    return (
        <div className=" lg:mt-12  grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4  mt-6 sm:w-full md:max-w-[1040px] w-[377px]">
            {grades.map((grade) => (
                <Link
                    key={grade.id}
                    to={grade.path} // Dynamic path
                    className="flex flex-col items-center justify-between bg-[#ccfbf1] text-black p-4 rounded-md shadow-md"
                >
                    {/* Icon Section */}
                    <div className={`p-3 rounded-full ${grade.color}`}>
                        <Backpack className="text-white w-6 h-6" />
                    </div>
                    {/* Text Section */}
                    <p className="mt-2 text-center font-semibold text-sm text-nowrap">{grade.label}</p>
                    {/* Arrow */}
                    <ArrowRight className="w-4 h-4 text-black mt-2" />
                </Link>
            ))}
        </div>

    );
};

export default Coursecatagory2;
