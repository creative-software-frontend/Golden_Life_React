import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Categories() {
    const [t] = useTranslation("global");
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

    return (
        <div className="py-10 mt-10 md:max-w-[1040px] w-[370px] sm:w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:max-w-[1240px]">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        to=""
                        className="flex flex-col items-center p-4 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div className="w-12 h-12 mb-3">
                            <img
                                src={category.icon}
                                alt=""
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-sm text-center text-gray-900">
                            {category.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
