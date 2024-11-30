import React, { useState } from 'react';
import { PlayCircle, Users, Clock } from 'lucide-react'; // Ensure these icons are from 'lucide-react'
import CourseOutline from '../CourseOutline/CourseOutline';

const CourseStructure: React.FC = () => {
    const [showCourseOutline, setShowCourseOutline] = useState(false); // To control CourseOutline visibility

    const openCourseOutline = () => {
        setShowCourseOutline(true); // Show CourseOutline when the button is clicked
    };

    return (
        <div className="container mx-auto  h-auto">
            <div className="p-2  rounded ">
                <h2 className="text-lg font-bold mt-2">কোর্সটি কিভাবে সাজানো হয়েছে</h2>
                <div className="grid grid-cols-2 gap-4 mt-4 mx-auto">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-500 rounded-full">
                            <PlayCircle className="text-white w-6 h-6" />
                        </div>
                        <p className="ml-4">৪৫টি Example ভিডিও লেকচার</p>
                    </div>
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-500 rounded-full">
                            <Users className="text-white w-6 h-6" />
                        </div>
                        <p className="ml-4">চ্যাটবটের মাধ্যমে ২৪/৭ সাপোর্ট</p>
                    </div>
                    <div className="flex items-center">
                        <div className="p-3 bg-green-500 rounded-full">
                            <Clock className="text-white w-6 h-6" />
                        </div>
                        <p className="ml-4">লাইভ প্রশ্ন-উত্তর ক্লাস</p>
                    </div>
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-500 rounded-full">
                            <Users className="text-white w-6 h-6" />
                        </div>
                        <p className="ml-4">ফেসবুক সাপোর্ট গ্রুপ</p>
                    </div>
                </div>

                {/* Open Course Outline Button */}
                {/* <button
                    onClick={openCourseOutline}
                    className="mt-4 px-6 py-2 bg-primary-default text-white rounded-lg transition-all"
                >
                    Open Course Outline
                </button> */}

                {/* Conditionally render CourseOutline */}
                {/* {showCourseOutline && <CourseOutline />} */}
            </div>
        </div>
    );
};

export default CourseStructure;
