import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function AllCourses2() {
    const { t } = useTranslation("global");

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

    // Animation Variants for smooth staggered entry
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1, 
            transition: { type: "spring", stiffness: 100, damping: 12 } 
        }
    };

    return (
        <section className="w-full py-6 px-4">
            <motion.div 
                className="max-w-6xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
            >
                {/* Header Section - Matches your Categories/Courses layout */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-gradient-to-r from-orange-500 via-yellow-600 to-green-600 rounded-t-lg p-4 md:p-5 flex flex-col md:flex-row justify-between items-center shadow-lg mb-6 text-white"
                >
                    <div className="text-center md:text-left mb-3 md:mb-0">
                        <h2 className="text-lg md:text-xl font-bold mb-0.5"> All Professional Course</h2>
                        <p className="text-white/90 text-xs font-medium opacity-90">Choose your path to success</p>
                    </div>
                    
                    <Link
                        to="/courses"
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all duration-300 group"
                    >
                        {t("viewAll") || "Explore All"}
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                {/* Grid Layout - 2 cols mobile, 6 cols desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {courses.map((course) => (
                        <motion.div key={course.id} variants={itemVariants}>
                            <Link
                                to={`/course/${course.id}`}
                                className="group flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm 
                                hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-green-100
                                transition-all duration-500 transform hover:-translate-y-1.5 h-full"
                            >
                                {/* Icon Container - Exact matching size w-12 h-12 */}
                                <div className="w-12 h-12 mb-2.5 bg-gray-50 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    <img
                                        src={course.icon}
                                        alt={course.name}
                                        className="w-6 h-6 object-contain"
                                    />
                                </div>
                                
                                {/* Course Name - Exact matching font size text-[11px] */}
                                <span className="text-gray-700 font-bold text-center text-[11px] sm:text-xs group-hover:text-green-600 transition-colors duration-300 leading-tight line-clamp-2 px-1">
                                    {course.name}
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}