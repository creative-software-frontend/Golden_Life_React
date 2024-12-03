import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function Categories() {
    const categories = [
        {
            id: 1,
            name: "Beauty & Personal Care",
            icon: "../../../../public/image/categories/c11.png",
        },
        {
            id: 2,
            name: "Women's Apparels",
            icon: "../../../../public/image/categories/c2.jpg",
        },
        {
            id: 3,
            name: "Men's Wear",
            icon: "../../../../public/image/categories/c13.png",
        },
        {
            id: 4,
            name: "Mobile & Gadgets",
            icon: "../../../../public/image/categories/c14.png",
        },
        {
            id: 5,
            name: "Home Decoration",
            icon: "../../../../public/image/categories/c15png.jpg",
        },
        {
            id: 6,
            name: "Home Appliances",
            icon: "../../../../public/image/categories/c16.png",
        },
        {
            id: 7,
            name: "Toy, Kids & Babies",
            icon: "../../../../public/image/categories/c17.png",
        },
        {
            id: 8,
            name: "Kids Fashion",
            icon: "../../../../public/image/categories/c18.png",
        },
        {
            id: 9,
            name: "Jewellery & Accessories",
            icon: "../../../../public/image/categories/c19.png",
        },
        {
            id: 10,
            name: "Women's Bag",
            icon: "../../../../public/image/categories/c20.png",
        },
        {
            id: 11,
            name: "Men's Bag",
            icon: "../../../../public/image/categories/c21.png",
        },
        {
            id: 12,
            name: "Watches & Accessories",
            icon: "../../../../public/image/categories/c1.jpg",
        },
    ]

    return (
        <div className="py-10  -mt-6 md:max-w-[1040px] w-[370px]   sm:w-full" >
            <div className="flex items-center justify-between mb-6 bg-primary-light p-2">
                <h2 className="text-lg text-white font-medium">Categories</h2>
                <Link
                    to='allcategories'
                    className="text-white text-sm font-medium flex items-center hover:underline"
                >
                    All Categories
                    <ChevronRight className="h-6 w-6" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 ">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        // to={`/productpage/${category.id}`}
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