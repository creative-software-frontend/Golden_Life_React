import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";

// Define the shape of a Category based on your internal state needs
interface Category {
    id: number;
    name_en: string;
    name_bn: string;
    icon: string;
    slug: string; // Added slug for linking
}

export default function Categories() {
    const { t, i18n } = useTranslation('global');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Helper to get Token
    const getAuthToken = () => {
        const session = localStorage.getItem("student_session");
        if (!session) return null;
        try {
            const parsedSession = JSON.parse(session);
            if (new Date().getTime() > parsedSession.expiry) {
                localStorage.removeItem("student_session");
                return null;
            }
            return parsedSession.token;
        } catch (e) { return null; }
    };

    // 2. Fetch Data from API
 // 2. Fetch Data from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';
                const token = getAuthToken();
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                };

                const response = await axios.get(`${baseURL}/api/getProductCategory`, config);
                
                // Debug to confirm we are getting data
                console.log("Full Response:", response.data);

                let rawData = [];

                // --- FIX: Target the specific path provided in your snippet ---
                // Path: response.data -> data -> categories
                if (response.data?.data?.categories && Array.isArray(response.data.data.categories)) {
                    rawData = response.data.data.categories;
                } else {
                    console.warn("Could not find categories array. Check console for structure.");
                }

                const mappedCategories = rawData.map((item: any) => {
                    // Image URL Construction
                    const imageUrl = `${baseURL}/uploads/ecommarce/category_image/${item.category_image}`;

                    return {
                        id: item.id,
                        // Map Names
                        name_en: item.category_name || "Category", // API uses 'category_name'
                        name_bn: item.category_name_bangla || item.category_name || "Category", // Fallback if no specific bangla field
                        
                        icon: imageUrl,
                        slug: item.category_slug
                    };
                });

                // 3. Limit to 10 items
                setCategories(mappedCategories.slice(0, 10));

            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Loading Skeleton
    if (loading) {
        return (
            <section className="w-full py-5 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Hide section if no data
    if (categories.length === 0) return null;

    return (
        <section className="w-full py-5 px-4">
            <div className="container mx-auto">
                
                {/* Header Section */}
                <div className="bg-gradient-to-r from-orange-500 via-yellow-600 to-green-600 rounded-t-lg p-3.5 md:p-4 flex flex-col md:flex-row justify-between items-center shadow-lg mb-5">
                    <div className="text-white mb-2.5 md:mb-0 text-center md:text-left">
                        <h2 className="text-base md:text-lg font-bold mb-0.5">{t("header.categories")}</h2>
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

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                    {categories.map((category) => {
                        // Dynamic Name Selection
                        const displayName = i18n.language === 'bn' ? category.name_bn : category.name_en;

                        return (
                            <Link
                                key={category.id}
                                to={`/category/${category.id}`} 
                                className="group flex flex-col items-center justify-center p-2.5 bg-white rounded-lg border border-gray-100 shadow-sm 
                                hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-green-100
                                transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform hover:-translate-y-1 hover:scale-[1.02]"
                            >
                                {/* Icon Container */}
                                <div className="w-10 h-10 mb-2 bg-gray-50 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
                                    <img
                                        src={category.icon}
                                        alt={displayName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { 
                                            // Fallback icon if image fails
                                            (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/1170/1170628.png"; 
                                        }}
                                    />
                                </div>
                                
                                {/* Category Name */}
                                <span className="text-gray-700 font-bold text-center text-[10px] sm:text-[11px] group-hover:text-green-600 transition-colors duration-300 leading-tight line-clamp-2">
                                    {displayName}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}