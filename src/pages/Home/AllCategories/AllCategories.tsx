import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function Categories() {
    const { t } = useTranslation("global");

    const categories = [
        { id: 1, name: t("beautyPersonalCare"), icon: "../../../../public/image/categories/c19.png" },
        { id: 2, name: t("womensApparels"), icon: "../../../../public/image/categories/c2.jpg" },
        { id: 3, name: t("mensWear"), icon: "../../../../public/image/categories/c4.jpg" },
        { id: 4, name: t("mobileGadgets"), icon: "../../../../public/image/categories/c5.webp" },
        { id: 5, name: t("homeDecoration"), icon: "../../../../public/image/categories/c16.png" },
        { id: 6, name: t("homeAppliances"), icon: "../../../../public/image/categories/c17.png" },
        { id: 7, name: t("toyKidsBabies"), icon: "../../../../public/image/categories/c18.png" },
        { id: 8, name: t("kidsFashion"), icon: "../../../../public/image/categories/c18.png" },
        { id: 9, name: t("jewelleryAccessories"), icon: "../../../../public/image/categories/c1.jpg" },
        { id: 10, name: t("womensBag"), icon: "../../../../public/image/categories/c20.png" },
        { id: 11, name: t("mensBag"), icon: "../../../../public/image/categories/c21.png" },
        { id: 12, name: t("watchesAccessories"), icon: "../../../../public/image/categories/c19.png" },
        { id: 13, name: t("footwear"), icon: "../../../../public/image/categories/c17.png" },
        { id: 14, name: t("booksStationery"), icon: "../../../../public/image/categories/c18.png" },
        { id: 15, name: t("groceries"), icon: "../../../../public/image/categories/c12.png" },
        { id: 16, name: t("healthWellness"), icon: "../../../../public/image/categories/c1.jpg" },
        { id: 17, name: t("petSupplies"), icon: "../../../../public/image/categories/c12.png" },
        { id: 18, name: t("sportsEquipment"), icon: "../../../../public/image/categories/c19.png" },
    ];

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
            transition: { type: "spring", stiffness: 100, damping: 15 } 
        }
    };

    return (
        <section className="w-full py-6 px-4">
            <motion.div 
                className="max-w-4xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
            >
                <motion.div 
                    variants={itemVariants}
                    className="bg-gradient-to-r from-orange-500 via-yellow-600 to-green-600 rounded-t-lg p-4 md:p-5 flex flex-col md:flex-row justify-between items-center shadow-lg mb-6 text-white"
                >
                    <div className="text-center md:text-left mb-3 md:mb-0">
                        <h2 className="text-lg md:text-xl font-bold mb-0.5">{t("header.allCategories") || "Product Categories"}</h2>
                        <p className="text-white/90 text-xs font-medium opacity-90">Find exactly what you are looking for</p>
                    </div>
                    
                    <Link
                        to="/categories"
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all duration-300 group shadow-sm"
                    >
                        {t("viewAll") || "View All"}
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {categories.map((category) => (
                        <motion.div key={category.id} variants={itemVariants}>
                            <Link
                                to={`/category/${category.id}`}
                                className="group flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm 
                                hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-green-100
                                transition-all duration-500 transform hover:-translate-y-1.5 h-full"
                            >
                                <div className="w-12 h-12 mb-2.5 bg-gray-50 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                                
                                <span className="text-gray-700 font-bold text-center text-[10px] sm:text-xs group-hover:text-green-600 transition-colors duration-300 leading-tight line-clamp-2 px-1">
                                    {category.name}
                                </span>
                            </Link> {/* This was the fixed closing tag */}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}