import React from 'react';
import { 
    Headphones, 
    Phone, 
    HelpCircle, 
    Ticket as TicketIcon 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HelpLanding: React.FC = () => {
    const { t } = useTranslation("global");

    const supportItems = [
        {
            title: "Support AI",
            icon: Headphones,
            path: "ai",
            color: "text-slate-800",
            bgColor: "bg-white"
        },
        {
            title: "Hotline",
            icon: Phone,
            path: "hotline",
            color: "text-slate-800",
            bgColor: "bg-white"
        },
        {
            title: "FAQ",
            icon: HelpCircle,
            path: "faq",
            color: "text-slate-800",
            bgColor: "bg-[#F3F4F6]" // Slightly grayer as per screenshot
        },
        {
            title: "Ticket",
            icon: TicketIcon,
            path: "ticket",
            color: "text-slate-800",
            bgColor: "bg-white"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportItems.map((item) => (
                    <Link
                        key={item.title}
                        to={item.path}
                        className={`
                            ${item.bgColor} 
                            border border-gray-200 
                            rounded-xl p-6 md:p-8 
                            flex items-center justify-center gap-4 
                            shadow-sm hover:shadow-md 
                            transition-all duration-300 
                            active:scale-95
                        `}
                    >
                        <item.icon className={`h-6 w-6 md:h-8 md:w-8 ${item.color}`} />
                        <span className="text-xl md:text-2xl font-bold text-gray-800">
                            {item.title}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HelpLanding;
