// import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AllCourses2() {
    const courses = [
        { id: 1, name: "Web Development", icon: "../../../../public/image/courses/c1.jpg" },
        { id: 2, name: "Data Science", icon: "../../../../public/image/courses/c2.jpg" },
        { id: 3, name: "Digital Marketing", icon: "../../../../public/image/courses/c3.jpg" },
        { id: 4, name: "Graphic Design", icon: "../../../../public/image/courses/c4.jpg" },
        { id: 5, name: "Cybersecurity", icon: "../../../../public/image/courses/c5.jpg" },
        { id: 6, name: "Project Management", icon: "../../../../public/image/courses/c6.jpg" },
        { id: 7, name: "UI/UX Design", icon: "../../../../public/image/courses/c7.jpg" },
        { id: 8, name: "Artificial Intelligence", icon: "../../../../public/image/courses/c8.jpg" },
        { id: 9, name: "Cloud Computing", icon: "../../../../public/image/courses/c9.jpg" },
        { id: 10, name: "Photography", icon: "../../../../public/image/courses/c10.jpg" },
        { id: 11, name: "Content Writing", icon: "../../../../public/image/courses/c11.jpg" },
        { id: 12, name: "App Development", icon: "../../../../public/image/courses/c12.jpg" }
    ];

    return (
        <div className="py-10 mt-10  md:max-w-[1040px]  w-[370px]   sm:w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:max-w-[1240px]">
                {courses.map((course) => (
                    <Link
                        key={course.id}
                        to={``} // Replace with appropriate route if needed
                        className="flex flex-col items-center p-4 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div className="w-12 h-12 mb-3">
                            <img
                                src={course.icon}
                                alt=""
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-sm text-center text-gray-900">
                            {course.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
