import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Courses() {
    const [t] = useTranslation('global');

    const courses = [
        { id: 1, name: t("courseNames.webDevelopment"), icon: "../../../../public/image/courses/c1.avif" },
        { id: 2, name: t("courseNames.blockchain"), icon: "../../../../public/image/courses/c3.png" },
        { id: 3, name: t("courseNames.webDevelopment"), icon: "../../../../public/image/courses/c3.png" },
        { id: 4, name: t("courseNames.dataScience"), icon: "../../../../public/image/courses/c3.png" },
        { id: 5, name: t("courseNames.graphicDesign"), icon: "../../../../public/image/courses/c2.jpg" },
        { id: 6, name: t("courseNames.digitalMarketing"), icon: "../../../../public/image/courses/c3.png" },
        { id: 7, name: t("courseNames.machineLearning"), icon: "../../../../public/image/courses/c4.jpg" },
        { id: 8, name: t("courseNames.uiUxDesign"), icon: "../../../../public/image/courses/c3.png" },
        { id: 9, name: t("courseNames.cloudComputing"), icon: "../../../../public/image/courses/c2.jpg" },
        { id: 10, name: t("courseNames.blockchain"), icon: "../../../../public/image/courses/c3.png" },
        { id: 11, name: t("courseNames.softwareTesting"), icon: "../../../../public/image/courses/c3.png" },
        { id: 12, name: t("courseNames.bigData"), icon: "../../../../public/image/courses/c3.png" },
    ];

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { type: "spring", stiffness: 50, damping: 10 } 
        }
    };

    return (
        <motion.div 
            className="py-12 mt-4 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
        >
            
            {/* Header Section */}
            <motion.div 
                variants={itemVariants}
                className="flex items-center justify-between mb-8 bg-gradient-to-r from-primary-light to-primary-default p-4 rounded-xl shadow-md text-white"
            >
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold tracking-tight">{t('header.title')}</h2>
                    <p className="text-xs text-white/80 hidden sm:block">Explore our top rated courses</p>
                </div>
                
                <Link
                    to="/dashboard/all-courses"
                    className="group flex items-center gap-1 text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm"
                >
                    {t('header.allCourses')}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </motion.div>

            {/* Courses Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {courses.map((course) => (
                    <motion.div key={course.id} variants={itemVariants}>
                        <Link
                            to='' // Add your route here
                            className="group flex flex-col items-center p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-light/30 transition-all duration-300 hover:-translate-y-1 h-full"
                        >
                            {/* Icon Container with soft background */}
                            <div className="w-16 h-16 mb-4 p-3 bg-gray-50 rounded-full group-hover:bg-primary-light/10 transition-colors duration-300 flex items-center justify-center">
                                <img
                                    src={course.icon}
                                    alt={course.name}
                                    className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            
                            {/* Course Name */}
                            <span className="text-sm font-semibold text-center text-gray-700 group-hover:text-primary-default transition-colors line-clamp-2">
                                {course.name}
                            </span>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}