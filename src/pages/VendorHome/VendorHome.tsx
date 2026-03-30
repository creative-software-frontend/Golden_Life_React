import React, { useState, useEffect } from 'react';
import { 
    Package, 
    Truck, 
    RefreshCcw, 
    ArrowRightLeft, 
    CheckCircle2, 
    CalendarDays,
    AlertCircle,
    TrendingUp,
    Percent,
    DollarSign,
    ShoppingCart,
    Star,
    Plus,
    FileText,
    Headphones
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Reusable StatCard Component
const StatCard = ({ title, value, subtext, icon: Icon, trend, trendValue, colorClass, customColor }: any) => (
    <div className="bg-background rounded-xl border border-border p-4 sm:p-6 flex justify-between items-start shadow-sm hover:shadow-md transition-shadow duration-200 group">
        <div className="flex flex-col min-w-0">
            <h3 className="text-xs sm:text-sm font-semibold text-foreground/70 truncate">{title}</h3>
            <div className="flex items-baseline gap-2 mt-1 sm:mt-2 flex-wrap">
                <span className="text-xl sm:text-3xl font-black text-foreground">{value}</span>
                {trend && (
                    <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}
                    </span>
                )}
            </div>
            <p className="text-[10px] sm:text-xs text-foreground/50 mt-1 line-clamp-1">{subtext}</p>
        </div>
        <div 
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-primary-foreground flex-shrink-0 shadow-sm ml-2 transition-transform group-hover:scale-105 ${colorClass || ''}`}
            style={customColor ? { backgroundColor: `hsl(var(${customColor}))` } : {}}
        >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
        </div>
    </div>
);

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, onClick, variant = 'primary' }: any) => {
    const baseClass = "w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2";
    const variants: Record<string, string> = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground"
    };
    return (
        <button onClick={onClick} className={`${baseClass} ${variants[variant as keyof typeof variants] || variants.primary}`}>
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
};

// Recent Orders Component (Stacked view)
const RecentOrdersStack = ({ orders }: { orders: any[] }) => {
    const getStatusColor = (status: string): string => {
        const statusMap: Record<string, string> = {
            '1B10': 'text-green-600',
            '1JR0': 'text-yellow-500',
            'Processing': 'text-blue-500'
        };
        return statusMap[status] || 'text-gray-500';
    };

    return (
        <div className="space-y-3">
            {orders.slice(0, 3).map((order, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <div>
                        <p className="font-medium text-sm text-foreground">{order.order_no}</p>
                        <p className={`text-xs flex items-center gap-1 mt-0.5 ${getStatusColor(order.status)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {order.status}
                        </p>
                    </div>
                    <p className="font-semibold text-sm text-foreground">${order.total}</p>
                </div>
            ))}
            <button 
                onClick={() => window.location.href = '/vendor/dashboard/orders'}
                className="w-full text-center text-xs text-primary hover:underline mt-2 pt-2 border-t border-border"
            >
                View All Orders →
            </button>
        </div>
    );
};

// Sales Chart Component
const SalesChart = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const salesData = [218, 350, 280, 420, 380, 450, 400];
    const maxSale = Math.max(...salesData);

    return (
        <div>
            <div className="flex justify-between items-end h-48 gap-2">
                {salesData.map((sale, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                            className="w-full bg-primary/70 hover:bg-primary transition-all duration-300 rounded-t-lg"
                            style={{ height: `${(sale / maxSale) * 100}%`, minHeight: '4px' }}
                        />
                        <span className="text-xs text-muted-foreground">{days[idx]}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-4 pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">Week</span>
                <span className="text-xs font-semibold text-primary">↑ 12% vs last week</span>
            </div>
        </div>
    );
};

// Inventory Alert Component
const InventoryAlert = ({ items }: { items: any[] }) => {
    return (
        <div className="space-y-3">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div>
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400">{item.label}</p>
                        <p className="text-xs text-red-500 dark:text-red-500">{item.subtext || 'Needs attention'}</p>
                    </div>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">{item.count}</p>
                </div>
            ))}
        </div>
    );
};

const VendorHome: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Today');
    const [loading, setLoading] = useState(true);
    const [dashboardData] = useState({
        stats: {
            today_pickup_request: 92,
            today_delivery_request: 20,
            today_return_request: 0,
            today_transfer_request: 0,
            today_delivery: 0,
            monthly_delivery: 0,
            total_pickup_request: 314,
            total_delivery_request: 136,
            total_return_request: 14,
            total_transfer_request: 42,
            pickup_collect_ratio: 7.86,
            success_delivery_ratio: 5
        },
        greeting: {
            name: 'Vendor',
            performance: 12
        },
        revenue: {
            total: 45780.00,
            change: 4970.00
        },
        activeOrders: 152,
        storeRating: 4.8,
        recentOrders: [
            { order_no: 'Apr 0021', status: '1B10', total: 229.00 },
            { order_no: 'Apr 0022', status: '1JR0', total: 75.00 },
            { order_no: 'Apr 0023', status: '1B10', total: 99.95 },
            { order_no: 'Apr 0024', status: 'Processing', total: 149.50 }
        ],
        inventoryAlerts: [
            { count: 100, label: 'Low Stock Alert', subtext: 'Camera - X100' },
            { count: 20, label: 'Out of Stock', subtext: 'Headphones - Pro' }
        ]
    });

    const tabs = ['Today', 'Weekly', 'Monthly', 'Yearly'];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setTimeout(() => setLoading(false), 500);
        };
        loadData();
    }, [activeTab]);

    const { stats, greeting, revenue, activeOrders, storeRating, recentOrders, inventoryAlerts } = dashboardData;

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
            
            {/* Greeting Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Good Morning, {greeting.name}!
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Your store is performing {greeting.performance}% better this week.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-card rounded-xl p-4 border shadow-sm">
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Store Rating</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl font-bold text-foreground">{storeRating}</span>
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < Math.floor(storeRating) ? 'fill-current' : 'stroke-current'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-5 shadow-sm border hover:shadow-md transition-all duration-200 group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
                            <p className="text-3xl font-bold text-foreground mt-2">
                                ${revenue.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-green-600 text-sm font-semibold mt-1 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                ${revenue.change.toLocaleString('en-US', { minimumFractionDigits: 2 })} ↑
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-105">
                            <DollarSign className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl p-5 shadow-sm border hover:shadow-md transition-all duration-200 group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">Active Orders</p>
                            <p className="text-3xl font-bold text-foreground mt-2">{activeOrders}</p>
                            <p className="text-green-600 text-sm font-semibold mt-1 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                ↑ {activeOrders}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-105">
                            <ShoppingCart className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl p-5 shadow-sm border hover:shadow-md transition-all duration-200 group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">Store Rating</p>
                            <p className="text-3xl font-bold text-foreground mt-2">{storeRating}</p>
                            <div className="flex text-yellow-500 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < Math.floor(storeRating) ? 'fill-current' : 'stroke-current'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-105">
                            <Star className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout: Left = Sales Chart, Right = Stacked (Quick Actions + Inventory + Recent Orders) */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Sales Chart (takes 2/3 width) */}
                <div className="lg:col-span-2 bg-card rounded-xl p-5 shadow-sm border">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg text-foreground">Sales Performance (Last 30 Days)</h3>
                        <div className="flex gap-1">
                            <button className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary">Week</button>
                            <button className="px-2 py-1 text-xs rounded-md hover:bg-muted">Month</button>
                            <button className="px-2 py-1 text-xs rounded-md hover:bg-muted">Year</button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                            <span>Daily Sales ($)</span>
                            <span className="text-primary font-semibold">Target: $500</span>
                        </div>
                        <SalesChart />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
                            <span>Lowest: $218</span>
                            <span>Highest: $450</span>
                            <span>Average: $350</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Stacked Items (takes 1/3 width) */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-card rounded-xl p-5 shadow-sm border">
                        <h3 className="font-semibold text-lg mb-4 text-foreground">Quick Actions</h3>
                        <div className="space-y-3">
                            <QuickActionButton 
                                icon={Plus} 
                                label="Add New Product" 
                                onClick={() => navigate('/vendor/dashboard/products/add')}
                                variant="primary"
                            />
                            <QuickActionButton 
                                icon={FileText} 
                                label="Generate Report" 
                                onClick={() => console.log('Generate Report')}
                                variant="outline"
                            />
                            <QuickActionButton 
                                icon={Headphones} 
                                label="Contact Support" 
                                onClick={() => console.log('Contact Support')}
                                variant="outline"
                            />
                        </div>
                    </div>

                    {/* Inventory Status */}
                    <div className="bg-card rounded-xl p-5 shadow-sm border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg text-foreground">Inventory Status</h3>
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <InventoryAlert items={inventoryAlerts} />
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-card rounded-xl p-5 shadow-sm border">
                        <h3 className="font-semibold text-lg mb-4 text-foreground">Recent Orders</h3>
                        <RecentOrdersStack orders={recentOrders} />
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-card rounded-xl p-6 shadow-sm border mt-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-foreground">Performance Metrics</h2>
                    <div className="flex gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                    activeTab === tab
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard 
                        title="Today Pickup Request" 
                        value={stats.today_pickup_request} 
                        subtext="Total pickup requests today" 
                        icon={Package} 
                        customColor="--chart-1" 
                    />
                    <StatCard 
                        title="Today Delivery Request" 
                        value={stats.today_delivery_request} 
                        subtext="Delivery requests for today" 
                        icon={Truck} 
                        customColor="--secondary" 
                    />
                    <StatCard 
                        title="Today Return Request" 
                        value={stats.today_return_request} 
                        subtext="Return requests today" 
                        icon={RefreshCcw} 
                        customColor="--destructive" 
                    />
                    <StatCard 
                        title="Today Transfer Request" 
                        value={stats.today_transfer_request} 
                        subtext="Transfer requests today" 
                        icon={ArrowRightLeft} 
                        customColor="--chart-4" 
                    />
                    <StatCard 
                        title="Today Delivery" 
                        value={stats.today_delivery} 
                        subtext="Completed deliveries today" 
                        icon={CheckCircle2} 
                        customColor="--chart-2" 
                    />
                    <StatCard 
                        title="Monthly Delivery" 
                        value={stats.monthly_delivery} 
                        subtext="Deliveries this month" 
                        icon={CalendarDays} 
                        customColor="--chart-1" 
                    />
                    <StatCard 
                        title="Total Pickup Request" 
                        value={stats.total_pickup_request} 
                        subtext="All pickup requests" 
                        icon={Package} 
                        customColor="--chart-1" 
                    />
                    <StatCard 
                        title="Total Delivery Request" 
                        value={stats.total_delivery_request} 
                        subtext="All delivery requests" 
                        icon={Truck} 
                        customColor="--secondary" 
                    />
                    <StatCard 
                        title="Total Return Request" 
                        value={stats.total_return_request} 
                        subtext="All return requests" 
                        icon={AlertCircle} 
                        customColor="--destructive" 
                    />
                    <StatCard 
                        title="Total Transfer Request" 
                        value={stats.total_transfer_request} 
                        subtext="All transfer requests" 
                        icon={ArrowRightLeft} 
                        customColor="--chart-4" 
                    />
                    <StatCard 
                        title="Pickup Collect Ratio" 
                        value={`${stats.pickup_collect_ratio}%`} 
                        subtext="Overall collection ratio" 
                        icon={TrendingUp} 
                        customColor="--primary" 
                    />
                    <StatCard 
                        title="Success Delivery Ratio" 
                        value={`${stats.success_delivery_ratio}%`} 
                        subtext="Overall success ratio" 
                        icon={Percent} 
                        customColor="--chart-3" 
                    />
                </div>
            </div>
        </div>
    );
};

export default VendorHome;