"use client"
import { Link } from 'react-router-dom';


interface Category {
    id: string
    name: string
    image: string
    href: string
}

const categories: Category[] = [
    {
        id: "eggs",
        name: "Eggs",
        image: "../../../../public/image/bread.jpg",
        href: "/food/breakfast/eggs"
    },
    {
        id: "breads",
        name: "Breads",
        image: "../../../../public/image/egg.jpg",
        href: "/food/breakfast/breads"
    },
    {
        id: "tea-coffee",
        name: "Tea & Coffee",
        image: "../../../../public/image/bread.jpg",
        href: "/food/breakfast/tea-coffee"
    },
    {
        id: "local-breakfast",
        name: "Local Breakfast",
        image: "../../../../public/image/bread.jpg",
        href: "/food/breakfast/local-breakfast"
    },
    {
        id: "cereals",
        name: "Cereals",
        image: "../../../../public/image/egg.jpg",
        href: "/food/breakfast/cereals"
    },
    {
        id: "honey",
        name: "Honey",
        image: "../../../../public/image/egg.jpg",
        href: "/food/breakfast/honey"
    },
    {
        id: "dips-spreads",
        name: "Dips, Spreads & Syrups",
        image: "../../../../public/image/bread.jpg",
        href: "/food/breakfast/dips-spreads"
    },
    {
        id: "energy-boosters",
        name: "Energy Boosters",
        image: "../../../../public/image/bread.jpg",
        href: "/food/breakfast/energy-boosters"
    },
    {
        id: "jams-jellies",
        name: "Jams & Jellies",
        image: "../../../../public/image/honey.jpg",
        href: "/food/breakfast/jams-jellies"
    }
]

export default function AllCategories() {
    return (
        <div className="container mx-auto px-4 py-8">
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                <Link to="/food" className="hover:text-gray-900">
                    Food
                </Link>
                <span>/</span>
                <span className="font-medium text-gray-900">Breakfast</span>
            </nav>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {categories.map((category) => (
                    <Link
                        to='/'
                        key={category.id}
                        className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <img
                            src={category.image}
                            alt={category.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h2 className="text-white font-medium text-lg">{category.name}</h2>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}