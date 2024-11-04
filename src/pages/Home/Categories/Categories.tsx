import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function Categories() {
    const categories = [
        {
            id: 1,
            name: "Beauty & Personal Care",
            icon: "../../../../public/image/c1.jpg",
        },
        {
            id: 2,
            name: "Women's Apparels",
            icon: "../../../../public/image/c2.jpg",
        },
        {
            id: 3,
            name: "Men's Wear",
            icon: "../../../../public/image/c4.jpg",
        },
        {
            id: 4,
            name: "Mobile & Gadgets",
            icon: "../../../../public/image/c1.jpg",
        },
        {
            id: 5,
            name: "Home Decoration",
            icon: "../../../../public/image/c3.jpg",
        },
        {
            id: 6,
            name: "Home Appliances",
            icon: "../../../../public/image/c2.jpg",
        },
        {
            id: 7,
            name: "Toy, Kids & Babies",
            icon: "../../../../public/image/c4.jpg",
        },
        {
            id: 8,
            name: "Kids Fashion",
            icon: "../../../../public/image/c1.jpg",
        },
        {
            id: 9,
            name: "Jewellery & Accessories",
            icon: "../../../../public/image/c2.jpg",
        },
        {
            id: 10,
            name: "Women's Bag",
            icon: "../../../../public/image/c3.jpg",
        },
        {
            id: 11,
            name: "Men's Bag",
            icon: "../../../../public/image/c1.jpg",
        },
        {
            id: 12,
            name: "Watches & Accessories",
            icon: "../../../../public/image/c4.jpg",
        },
    ]

    return (
        <div className="py-10 md:max-w-[1040px]  " >
            <div className="flex items-center justify-between mb-6 bg-primary-light p-2">
                <h2 className="text-lg text-white font-medium">Categories</h2>
                <Link
                    to='all-categories'
                    className="text-white text-sm font-medium flex items-center hover:underline"
                >
                    All Categories
                    <ChevronRight className="h-6 w-6" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:max-w-[1240px]">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        to=''
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

    )
}