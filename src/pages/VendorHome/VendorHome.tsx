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
    Headphones,
    Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// New Stat Card Component (like 2nd image)
const StatCardNew = ({ title, value, subValue, icon: Icon, bgColor, textColor }: any) => (
    <div className={`${bgColor} rounded-2xl p-5 shadow-sm border-0`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium opacity-80">{title}</p>
                <p className={`text-2xl font-bold mt-2 ${textColor}`}>{value}</p>
                {subValue && <p className={`text-sm font-medium mt-1 ${textColor} opacity-80`}>{subValue}</p>}
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
            </div>
        </div>
    </div>
);

// Performance Metric Card Component (4 cards design like image)
const MetricCard = ({ title, value, subtext, trend, trendValue }: any) => (
    <div className="bg-background rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex flex-col">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-foreground">{value}</span>
                {trend && (
                    <span className={`text-xs font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}
                    </span>
                )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
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
    return (
        <div className="space-y-3">
            {orders.map((order, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg transition-colors border-b border-border last:border-0">
                    <div>
                        <p className="font-medium text-sm text-foreground">{order.order_no}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{order.status}</p>
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
            <div className="flex justify-between items-end h-40 gap-1">
                {salesData.map((sale, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div 
                            className="w-full bg-primary/70 hover:bg-primary transition-all duration-300 rounded-t"
                            style={{ height: `${(sale / maxSale) * 100}%`, minHeight: '4px' }}
                        />
                        <span className="text-[10px] text-muted-foreground">{days[idx]}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                <span>Lowest: $218</span>
                <span>Highest: $450</span>
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
                        <p className="text-xs text-red-500 dark:text-red-500">{item.subtext}</p>
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
        parcelStats: {
            total: { count: 12, amount: 11980 },
            delivered: { count: 7, amount: 6230 },
            pending: { count: 0, amount: 0 },
            cancel: { count: 5, amount: 5750, percentage: 42 }
        },
        metrics: [
            { title: "Today Pickup Request", value: 92, subtext: "Total pickup requests today" },
            { title: "Today Delivery Request", value: 20, subtext: "Delivery requests for today" },
            { title: "Today Return Request", value: 0, subtext: "Return requests today" },
            { title: "Pickup Collect Ratio", value: "7.86%", subtext: "Overall collection ratio", trend: "up", trendValue: "2%" }
        ],
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
            { order_no: 'Apr 0021', status: 'Delivered', total: 229.00 },
            { order_no: 'Apr 0022', status: 'Pending', total: 75.00 },
            { order_no: 'Apr 0023', status: 'Processing', total: 99.95 },
            { order_no: 'Apr 0024', status: 'Shipped', total: 149.50 }
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

    const { parcelStats, metrics, greeting, revenue, activeOrders, storeRating, recentOrders, inventoryAlerts } = dashboardData;

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
            
            {/* Greeting Section */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Good Morning, {greeting.name}!
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Your store is performing {greeting.performance}% better this week.
                </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
                
                {/* ========== LEFT COLUMN (takes 2/3 width) ========== */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Parcel Stats Cards - 4 Cards */}
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCardNew 
                            title="Total Parcel" 
                            value={parcelStats.total.count}
                            subValue={`${parcelStats.total.amount} BDT`}
                            icon={Package}
                            bgColor="bg-emerald-500"
                            textColor="text-white"
                        />
                        <StatCardNew 
                            title="Delivered" 
                            value={parcelStats.delivered.count}
                            subValue={`${parcelStats.delivered.amount} BDT`}
                            icon={CheckCircle2}
                            bgColor="bg-green-500"
                            textColor="text-white"
                        />
                        <StatCardNew 
                            title="Pending" 
                            value={parcelStats.pending.count}
                            subValue={`${parcelStats.pending.amount} BDT`}
                            icon={Clock}
                            bgColor="bg-yellow-500"
                            textColor="text-white"
                        />
                        <StatCardNew 
                            title="Cancel" 
                            value={`${parcelStats.cancel.count} (${parcelStats.cancel.percentage}%)`}
                            subValue={`${parcelStats.cancel.amount} BDT`}
                            icon={AlertCircle}
                            bgColor="bg-red-500"
                            textColor="text-white"
                        />
                    </div> */}

                    {/* Stats Cards (3 in a row) */}
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

                    {/* Sales Chart */}
                    <div className="bg-card rounded-xl p-5 shadow-sm border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg text-foreground">Sales Performance (Last 30 Days)</h3>
                            <div className="flex gap-1">
                                <button className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary">Week</button>
                                <button className="px-2 py-1 text-xs rounded-md hover:bg-muted">Month</button>
                                <button className="px-2 py-1 text-xs rounded-md hover:bg-muted">Year</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Daily Sales ($)</span>
                                <span className="text-primary font-semibold">Target: $500</span>
                            </div>
                            <SalesChart />
                        </div>
                    </div>

                    {/* Performance Metrics - 4 Cards Design */}
                    <div className="bg-card rounded-xl p-6 shadow-sm border">
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
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {metrics.map((metric, index) => (
                                <MetricCard 
                                    key={index}
                                    title={metric.title}
                                    value={metric.value}
                                    subtext={metric.subtext}
                                    trend={metric.trend}
                                    trendValue={metric.trendValue}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ========== RIGHT COLUMN (takes 1/3 width) ========== */}
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
        </div>
    );
};

export default VendorHome;