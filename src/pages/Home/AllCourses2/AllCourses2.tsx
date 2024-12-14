// import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function AllCourses2() {
    const { t } = useTranslation("global"); // Correct way to use the `useTranslation` hook

    const courses = [
        { id: 1, name: t("webDev"), icon: "../../../../public/image/courses/c2.jpg" },
        { id: 2, name: t("dataSci"), icon: "../../../../public/image/courses/c3.png" },
        { id: 3, name: t("digitalMkt"), icon: "../../../../public/image/courses/c4.jpg" },
        { id: 4, name: t("graphicDes"), icon: "../../../../public/image/courses/ai.jpg" },
        { id: 5, name: t("cyberSec"), icon: "../../../../public/image/courses/c2.jpg" },
        { id: 6, name: t("projMgmt"), icon: "../../../../public/image/courses/cloud.jpg" },
        { id: 7, name: t("uiUx"), icon: "../../../../public/image/courses/content.jpg" },
        { id: 8, name: t("ai"), icon: "../../../../public/image/courses/ai.jpg" },
        { id: 9, name: t("cloudComp"), icon: "../../../../public/image/courses/c3.png" },
        { id: 10, name: t("photo"), icon: "../../../../public/image/courses/photo.jpg" },
        { id: 11, name: t("contentWrite"), icon: "../../../../public/image/courses/cyber.jpg" },
        { id: 12, name: t("appDev"), icon: "../../../../public/image/courses/c3.png" },
    ];

    return (
        <div className="py-10 mt-10 md:max-w-[1040px] w-[370px] sm:w-full">
            {/* <h2 className="text-center text-lg font-bold mb-4">{t("header")}</h2> */}
            {/* <p className="text-center text-sm text-gray-600 mb-6">{t("clickInfo")}</p> */}
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
