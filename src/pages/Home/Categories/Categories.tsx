import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Categories() {
    const [t] = useTranslation('global');

    const categories = [
        {
            id: 1,
            name: t("categories.beautyCare"),
            icon: "../../../../public/image/categories/c1.jpg",
        },
        {
            id: 2,
            name: t("categories.womensApparels"),
            icon: "../../../../public/image/categories/c2.jpg",
        },
        {
            id: 3,
            name: t("categories.mensWear"),
            icon: "../../../../public/image/categories/c13.png",
        },
        {
            id: 4,
            name: t("categories.mobileGadgets"),
            icon: "../../../../public/image/categories/c14.png",
        },
        {
            id: 5,
            name: t("categories.homeDecoration"),
            icon: "../../../../public/image/categories/c15png.jpg",
        },
        {
            id: 6,
            name: t("categories.homeAppliances"),
            icon: "../../../../public/image/categories/c16.png",
        },
        {
            id: 7,
            name: t("categories.toysKidsBabies"),
            icon: "../../../../public/image/categories/c17.png",
        },
        {
            id: 8,
            name: t("categories.kidsFashion"),
            icon: "../../../../public/image/categories/c18.png",
        },
        {
            id: 9,
            name: t("categories.jewelleryAccessories"),
            icon: "../../../../public/image/categories/c19.png",
        },
        {
            id: 10,
            name: t("categories.womensBag"),
            icon: "../../../../public/image/categories/c20.png",
        },
        {
            id: 11,
            name: t("categories.mensBag"),
            icon: "../../../../public/image/categories/c21.png",
        },
        {
            id: 12,
            name: t("categories.watchesAccessories"),
            icon: "../../../../public/image/categories/c1.jpg",
        },
    ];

    return (
        <section className="w-full py-5 px-4">
            <div className="container mx-auto">
                
                {/* Header Section - Slightly more compact */}
                <div className="bg-gradient-to-r from-orange-500 via-yellow-600 to-green-600 rounded-t-lg p-3.5 md:p-4 flex flex-col md:flex-row justify-between items-center shadow-lg mb-5">
                    <div className="text-white mb-2.5 md:mb-0 text-center md:text-left">
                        {/* Title: Reduced size */}
                        <h2 className="text-base md:text-lg font-bold mb-0.5">{t("header.categories")}</h2>
                        {/* Subtitle: Reduced size */}
                        <p className="text-white/90 text-[10px] sm:text-xs font-medium opacity-90">Explore our top rated categories</p>
                    </div>
                    
                    <Link
                        to="allcategories"
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1 transition-all duration-300 group hover:shadow-lg"
                    >
                        {t("header.allCategories")}
                        <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Categories Grid - Compact Layout */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to=""
                            className="group flex flex-col items-center justify-center p-2.5 bg-white rounded-lg border border-gray-100 shadow-sm 
                            hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-green-100
                            transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform hover:-translate-y-1 hover:scale-[1.02]"
                        >
                            {/* Icon Container: Slightly smaller */}
                            <div className="w-10 h-10 mb-2 bg-gray-50 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                <img
                                    src={category.icon}
                                    alt={category.name}
                                    className="w-5 h-5 object-contain"
                                />
                            </div>
                            
                            {/* Category Name: Smaller text */}
                            <span className="text-gray-700 font-bold text-center text-[10px] sm:text-[11px] group-hover:text-green-600 transition-colors duration-300 leading-tight line-clamp-2">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}