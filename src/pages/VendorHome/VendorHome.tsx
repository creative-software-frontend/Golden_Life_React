import React, { useState } from 'react';
import { 
    Package, 
    Truck, 
    RefreshCcw, 
    ArrowRightLeft, 
    CheckCircle2, 
    CalendarDays,
    AlertCircle,
    TrendingUp,
    Percent
} from 'lucide-react';

// Reusable StatCard Component
const StatCard = ({ title, value, subtext, icon: Icon, colorClass, customColor }: any) => (
    <div className="bg-background rounded-xl border border-border p-4 sm:p-6 flex justify-between items-start shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col min-w-0"> {/* min-w-0 prevents text overflow in flex */}
            <h3 className="text-xs sm:text-sm font-semibold text-foreground/70 truncate">{title}</h3>
            <span className="text-xl sm:text-3xl font-black text-foreground mt-1 sm:mt-2">{value}</span>
            <p className="text-[10px] sm:text-xs text-foreground/50 mt-1 line-clamp-1">{subtext}</p>
        </div>
        <div 
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-primary-foreground flex-shrink-0 shadow-sm ml-2 ${colorClass || ''}`}
            style={customColor ? { backgroundColor: `hsl(var(${customColor}))` } : {}}
        >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
        </div>
    </div>
);

const VendorHome: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Today');
    const tabs = ['Today', 'Weekly', 'Monthly', 'Yearly'];

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-6 sm:space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Vendor Dashboard</h1>
                    <p className="text-xs sm:text-sm text-foreground/60">Welcome back! Here's what's happening today.</p>
                </div>

               {/* Time Filter Tabs - Adaptive Senior Solution */}
<div className="w-full lg:w-auto overflow-hidden">
    <div className="flex p-1 bg-muted/30 backdrop-blur-md rounded-2xl border border-border w-full">
        {tabs.map((tab) => {
            const active = activeTab === tab;
            return (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                        relative flex-1 px-2 sm:px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 rounded-xl
                        ${active 
                            ? 'text-primary-foreground shadow-sm' 
                            : 'text-muted-foreground hover:text-foreground'
                        }
                    `}
                >
                    {/* Sliding Background - Only visible when active */}
                    {active && (
                        <div 
                            className="absolute inset-0 bg-primary rounded-xl z-0 shadow-lg shadow-primary/20 animate-in zoom-in-95 duration-200" 
                        />
                    )}
                    
                    {/* Label - Positioned above the sliding background */}
                    <span className="relative z-10 whitespace-nowrap">{tab}</span>
                </button>
            );
        })}
    </div>
</div>
            </div>

            {/* Metrics Grid - Fully Responsive Columns */}
            {/* 1 col on mobile, 2 on tablet, 3 on small desktop, 4 on large desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                <StatCard 
                    title="Today Pickup Request" 
                    value="92" 
                    subtext="Total pickup requests today" 
                    icon={Package} 
                    customColor="--chart-1" 
                />
                <StatCard 
                    title="Today Delivery Request" 
                    value="20" 
                    subtext="Delivery requests for today" 
                    icon={Truck} 
                    customColor="--secondary" 
                />
                <StatCard 
                    title="Today Return Request" 
                    value="0" 
                    subtext="Return requests today" 
                    icon={RefreshCcw} 
                    customColor="--destructive" 
                />
                <StatCard 
                    title="Today Transfer Request" 
                    value="0" 
                    subtext="Transfer requests today" 
                    icon={ArrowRightLeft} 
                    customColor="--chart-4" 
                />
                <StatCard 
                    title="Today Delivery" 
                    value="0" 
                    subtext="Completed deliveries today" 
                    icon={CheckCircle2} 
                    customColor="--chart-2" 
                />
                <StatCard 
                    title="Monthly Delivery" 
                    value="0" 
                    subtext="Deliveries this month" 
                    icon={CalendarDays} 
                    customColor="--chart-1" 
                />
                <StatCard 
                    title="Total Pickup Request" 
                    value="314" 
                    subtext="All pickup requests" 
                    icon={Package} 
                    customColor="--chart-1" 
                />
                <StatCard 
                    title="Total Delivery Request" 
                    value="136" 
                    subtext="All delivery requests" 
                    icon={Truck} 
                    customColor="--secondary" 
                />
                <StatCard 
                    title="Total Return Request" 
                    value="14" 
                    subtext="All return requests" 
                    icon={AlertCircle} 
                    customColor="--destructive" 
                />
                <StatCard 
                    title="Total Transfer Request" 
                    value="42" 
                    subtext="All transfer requests" 
                    icon={ArrowRightLeft} 
                    customColor="--chart-4" 
                />
                <StatCard 
                    title="Pickup Collect Ratio" 
                    value="7.86%" 
                    subtext="Overall collection ratio" 
                    icon={TrendingUp} 
                    customColor="--primary" 
                />
                <StatCard 
                    title="Success Delivery Ratio" 
                    value="5%" 
                    subtext="Overall success ratio" 
                    icon={Percent} 
                    customColor="--chart-3" 
                />
            </div>
        </div>
    );
};

export default VendorHome;