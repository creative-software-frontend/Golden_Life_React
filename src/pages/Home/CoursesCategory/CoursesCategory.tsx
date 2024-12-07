import { Button } from "@/components/ui/button";
import useModalStore from "@/store/Store";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Courses() {
    const [cart, setCart] = useState<any[]>([])
    const { toggleClicked } = useModalStore();

    const addToCart = (product: any) => {
        const updatedCart = [...cart, product];
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toggleClicked(); // trigger to update cart on other components
    }
    const courses = [
        {
            id: 1,
            name: "Web Development ",
            icon: "../../../../public/image/courses/c1.avif",
        },
        {
            id: 2,
            name: "Data Science ",
            icon: "../../../../public/image/courses/c3.png",
        },
        {
            id: 3,
            name: "Graphic Design ",
            icon: "../../../../public/image/courses/c3.png",
        },
        {
            id: 4,
            name: "Digital Marketing ",
            icon: "../../../../public/image/courses/c3.png",
        },
        {
            id: 5,
            name: " App Development",
            icon: "../../../../public/image/courses/c2.jpg",
        },
        {
            id: 6,
            name: " Machine Learning",
            icon: "../../../../public/image/courses/c3.png",
        },
        {
            id: 7,
            name: "Cybersecurity ",
            icon: "../../../../public/image/courses/c4.jpg",
        },
        {
            id: 8,
            name: "UI/UX Design ",
            icon: "../../../../public/image/courses/c3.png",
        },
        {
            id: 9,
            name: "Cloud Computing ",
            icon: "../../../../public/image/courses/c2.jpg",
        },
        {
            id: 10,
            name: "Blockchain ",
            icon: "../../../../public/image/courses/c3.png",
        },
        {
            id: 11,
            name: "Software Testing ",
            icon: "../../../../public/image/courses/c3.png",
        },
        {
            id: 12,
            name: "Big Data ",
            icon: "../../../../public/image/courses/c3.png",
        },
    ];

    return (
        <div className="py-10 -mt-6 md:max-w-[1040px] w-[370px] sm:w-full">
            <div className="flex items-center justify-between mb-6 bg-primary-light p-2">
                <h2 className="text-lg text-white font-medium">Courses</h2>
                <Link
                    to="/all-courses"
                    className="text-white text-sm font-medium flex items-center hover:underline"
                >
                    All Courses
                    <ChevronRight className="h-6 w-6" />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:max-w-[1240px] sm:w-full">
                {courses.map((course) => (
                    <Link
                        key={course.id}
                        // to={`/coursepage/${course.id}`}
                        to=''
                        className="flex flex-col items-center p-4 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div className="w-14 h-14 mb-3">
                            <img
                                src={course.icon}
                                alt={course.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-sm text-center text-gray-900 text-nowrap">
                            {course.name}
                        </span>
                        {/* <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                addToCart(courses); // Add product to the cart
                            }}
                            className="w-full mt-2"
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add
                        </Button> */}
                    </Link>
                ))}
            </div>
        </div>
    );
}
