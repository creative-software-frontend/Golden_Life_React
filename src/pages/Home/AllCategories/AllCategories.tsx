import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function Categories() {
    const categories = [
        { id: 1, name: "Beauty & Personal Care", icon: "../../../../public/image/categories/c19.png" },
        { id: 2, name: "Women's Apparels", icon: "../../../../public/image/categories/c2.jpg" },
        { id: 3, name: "Men's Wear", icon: "../../../../public/image/categories/c4.jpg" },
        { id: 4, name: "Mobile & Gadgets", icon: "../../../../public/image/categories/c5.webp" },
        { id: 5, name: "Home Decoration", icon: "../../../../public/image/categories/c16.png" },
        { id: 6, name: "Home Appliances", icon: "../../../../public/image/categories/c17.png" },
        { id: 7, name: "Toy, Kids & Babies", icon: "../../../../public/image/categories/c18.png" },
        { id: 8, name: "Kids Fashion", icon: "../../../../public/image/categories/c18.png" },
        { id: 9, name: "Jewellery & Accessories", icon: "../../../../public/image/categories/c1.jpg" },
        { id: 10, name: "Women's Bag", icon: "../../../../public/image/categories/c20.png" },
        { id: 11, name: "Men's Bag", icon: "../../../../public/image/categories/c21.png" },
        { id: 12, name: "Watches & Accessories", icon: "../../../../public/image/categories/c19.png" },
        { id: 13, name: "Footwear", icon: "../../../../public/image/categories/c17.png" },
        { id: 14, name: "Books & Stationery", icon: "../../../../public/image/categories/c18.png" },
        { id: 15, name: "Groceries", icon: "../../../../public/image/categories/c12.png" },
        { id: 16, name: "Health & Wellness", icon: "../../../../public/image/categories/c1.jpg" },
        { id: 17, name: "Pet Supplies", icon: "../../../../public/image/categories/c12.png" },
        { id: 18, name: "Sports Equipment", icon: "../../../../public/image/categories/c19.png" },
        // { id: 19, name: "Furniture", icon: "../../../../public/image/c1.jpg" },
        // { id: 20, name: "Garden Supplies", icon: "../../../../public/image/categories/c1.jpg" },
        // { id: 21, name: "Automotive Accessories", icon: "../../../../public/image/c3.jpg" },
        // { id: 22, name: "Beverages", icon: "../../../../public/image/c4.jpg" },
        // { id: 23, name: "Musical Instruments", icon: "../../../../public/image/c1.jpg" },
        // { id: 24, name: "Office Supplies", icon: "../../../../public/image/categories/c1.jpg" },
        // { id: 25, name: "Luggage & Travel", icon: "../../../../public/image/c3.jpg" },
        // { id: 26, name: "Cleaning Supplies", icon: "../../../../public/image/c4.jpg" },
        // { id: 27, name: "Party Supplies", icon: "../../../../public/image/c1.jpg" },
        // { id: 28, name: "Crafts & Hobbies", icon: "../../../../public/image/categories/c1.jpg" },
        // { id: 29, name: "Eyewear", icon: "../../../../public/image/c3.jpg" },
        // { id: 30, name: "Personal Safety", icon: "../../../../public/image/c4.jpg" }
    ];


    return (
        <div className="py-10 mt-10  md:max-w-[1040px]  w-[370px]   sm:w-full " >
            {/* <div className="flex items-center justify-between mb-6 bg-primary-light p-2">
                <h2 className="text-lg text-white font-medium">Categories</h2>
                <Link
                    to='allcategories'
                    className="text-white text-sm font-medium flex items-center hover:underline"
                >
                    All Categories
                    <ChevronRight className="h-6 w-6" />
                </Link>
            </div> */}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:max-w-[1240px]">
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