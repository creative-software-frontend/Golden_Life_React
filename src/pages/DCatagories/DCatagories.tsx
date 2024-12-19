import { Watch, Smartphone } from 'lucide-react';

export default function DCatagories() {
    const categories = [
        // Row 1
        { name: "Gents", icon: <ShirtIcon /> },
        { name: "Ladies", icon: <DressIcon /> },
        { name: "Mobile", icon: <MobileIcon /> },
        { name: "Glasses", icon: <GlassesIcon /> },
        // Row 2
        { name: "Watch", icon: <Watch className="w-6 h-6" /> },
        { name: "Gents", icon: <ShirtIcon /> },
        { name: "Ladies", icon: <DressIcon /> },
        { name: "Mobile", icon: <MobileIcon /> },
        // Row 3
        { name: "Glasses", icon: <GlassesIcon /> },
        { name: "Watch", icon: <Watch className="w-6 h-6" /> },
        { name: "Gents", icon: <ShirtIcon /> },
        { name: "Ladies", icon: <DressIcon /> },
        // Row 4
        { name: "Mobile", icon: <MobileIcon /> },
        { name: "Glasses", icon: <GlassesIcon /> },
        { name: "Watch", icon: <Watch className="w-6 h-6" /> },
        { name: "Gents", icon: <ShirtIcon /> },
        // Row 5
        { name: "Ladies", icon: <DressIcon /> },
        { name: "Mobile", icon: <MobileIcon /> },
        { name: "Glasses", icon: <GlassesIcon /> },
        { name: "Watch", icon: <Watch className="w-6 h-6" /> },
    ];

    return (

        <div>
            <h1 className="text-lg font-bold mb-2 text-center">products Ctagories</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4 p-4">

                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center p-8 border rounded-md bg-white hover:shadow transition-shadow"
                    >
                        <div className="mb-1">{category.icon}</div>
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ShirtIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-blue-500"
        >
            <path
                d="M12 4L8 2L3 4V22H21V4L16 2L12 4ZM12 4V22M8 2V6M16 2V6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3 4L8 6L12 4L16 6L21 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function DressIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-pink-400"
        >
            <path
                d="M12 4L9 2L4 4V22H20V4L15 2L12 4ZM12 4V22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 12H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function GlassesIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 12C6 10.3431 4.65685 9 3 9C1.34315 9 0 10.3431 0 12C0 13.6569 1.34315 15 3 15C4.65685 15 6 13.6569 6 12Z"
                fill="currentColor"
            />
            <path
                d="M21 9C19.3431 9 18 10.3431 18 12C18 13.6569 19.3431 15 21 15C22.6569 15 24 13.6569 24 12C24 10.3431 22.6569 9 21 9Z"
                fill="currentColor"
            />
            <path d="M6 12H18" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

function MobileIcon() {
    return (
        <div className="relative text-blue-500">
            <Smartphone className="w-6 h-6" />
            <div className="absolute -right-1 bottom-0 w-2 h-2 bg-yellow-400 rounded-full" />
        </div>
    );
}
