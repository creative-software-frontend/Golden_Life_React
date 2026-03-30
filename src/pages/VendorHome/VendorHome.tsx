import React, { useState, useEffect } from 'react';
import { 
    Package, 
    CheckCircle2, 
    Clock,
    AlertCircle,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Star,
    Plus,
    FileText,
    Headphones
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

// Recent Orders Component
const RecentOrdersStack = ({ orders }: { orders: any[] }) => {
    return (
        <div className="space-y-3">
            {orders.map((order, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg transition-colors border-b border-border last:border-0">
                    <div>
                        <p className="font-medium text-sm text-foreground">{order.order_no}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{order.status}</p>
                    </div>
                    <p className="font-semibold text-sm text-foreground">${parseFloat(order.total).toFixed(2)}</p>
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

const VendorHome: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Today');
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const [vendorData, setVendorData] = useState<any>(null);
    
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    const getAuthToken = () => {
        const session = sessionStorage.getItem('vendor_session');
        if (!session) return null;
        try {
            const parsed = JSON.parse(session);
            return parsed.token || null;
        } catch {
            return null;
        }
    };

    const fetchVendorProfile = async () => {
        try {
            const token = getAuthToken();
            if (!token) return;
            
            const response = await axios.get(`${baseURL}/api/vendor/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data?.vendor) {
                setVendorData(response.data.vendor);
            }
        } catch (error) {
            console.error('Error fetching vendor profile:', error);
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            
            if (!token) {
                console.error('No authentication token found');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${baseURL}/api/vendor/orders/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data?.success) {
                setOrders(response.data.orders || []);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendorProfile();
        fetchOrders();
    }, []);

    const getFilteredOrders = () => {
        const now = new Date();
        let startDate: Date;
        
        switch(activeTab) {
            case 'Today':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'Weekly':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'Monthly':
                startDate = new Date(now.setDate(now.getDate() - 30));
                break;
            case 'Yearly':
                startDate = new Date(now.setDate(now.getDate() - 365));
                break;
            default:
                startDate = new Date(0);
        }
        
        return orders.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate >= startDate;
        });
    };

    const filteredOrders = getFilteredOrders();
    
    // Calculate metrics
    const totalOrders = filteredOrders.length;
    const deliveredOrders = filteredOrders.filter(o => o.status === "Delivered").length;
    const pendingOrders = filteredOrders.filter(o => o.status === "Order Placed" || o.status === "Pending").length;
    const cancelledOrders = filteredOrders.filter(o => o.status === "Cancelled").length;
    
    const totalAmount = filteredOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
    const deliveredAmount = filteredOrders.filter(o => o.status === "Delivered").reduce((sum, o) => sum + parseFloat(o.total), 0);
    const pendingAmount = filteredOrders.filter(o => o.status === "Order Placed" || o.status === "Pending").reduce((sum, o) => sum + parseFloat(o.total), 0);
    const cancelledAmount = filteredOrders.filter(o => o.status === "Cancelled").reduce((sum, o) => sum + parseFloat(o.total), 0);
    const cancelPercentage = totalOrders > 0 ? Math.round((cancelledOrders / totalOrders) * 100) : 0;

    const businessName = vendorData?.businee_name || vendorData?.business_name || 'Vendor';
    const tabs = ['Today', 'Weekly', 'Monthly', 'Yearly'];
    const recentOrders = filteredOrders.slice(0, 4);

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
            
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Welcome back, <span className="text-primary">{businessName}</span>!
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {filteredOrders.length} orders found for {activeTab.toLowerCase()}
                </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
                
                {/* ========== LEFT COLUMN (takes 2/3 width) ========== */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Top Stats Cards (3 in a row) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card rounded-xl p-5 shadow-sm border hover:shadow-md transition-all duration-200 group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
                                    <p className="text-3xl font-bold text-foreground mt-2">$0.00</p>
                                    <p className="text-green-600 text-sm font-semibold mt-1 flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        Coming soon
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
                                    <p className="text-3xl font-bold text-foreground mt-2">
                                        {filteredOrders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length}
                                    </p>
                                    <p className="text-green-600 text-sm font-semibold mt-1 flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        Active orders
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
                                    <p className="text-3xl font-bold text-foreground mt-2">4.8</p>
                                    <div className="flex text-yellow-500 mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={`w-4 h-4 ${i < 4.8 ? 'fill-current' : 'stroke-current'}`}
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
                                <span className="text-primary font-semibold">Coming soon</span>
                            </div>
                            <SalesChart />
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
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <div>
                                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">Low Stock Alert</p>
                                    <p className="text-xs text-red-500 dark:text-red-500">Coming soon</p>
                                </div>
                                <p className="text-xl font-bold text-red-600 dark:text-red-400">-</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-card rounded-xl p-5 shadow-sm border">
                        <h3 className="font-semibold text-lg mb-4 text-foreground">Recent Orders</h3>
                        <span className="text-xs text-muted-foreground">{filteredOrders.length} orders</span>
                        <RecentOrdersStack orders={recentOrders} />
                    </div>
                </div>
            </div>

            {/* ========== BOTTOM SECTION - Order Cards with Filters ========== */}
            <div className="mt-8 bg-card rounded-xl p-6 shadow-sm border">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-foreground">Order Overview</h2>
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
                    {/* Total Parcel Card */}
                    <div className="bg-background rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Total Parcel</p>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Package className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold text-foreground">{totalOrders}</span>
                                <p className="text-xs text-muted-foreground mt-1">Orders</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-semibold text-primary">{totalAmount.toFixed(2)} BDT</span>
                                <p className="text-xs text-muted-foreground mt-1">Amount</p>
                            </div>
                        </div>
                    </div>

                    {/* Delivered Card */}
                    <div className="bg-background rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold text-foreground">{deliveredOrders}</span>
                                <p className="text-xs text-muted-foreground mt-1">Orders</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-semibold text-primary">{deliveredAmount.toFixed(2)} BDT</span>
                                <p className="text-xs text-muted-foreground mt-1">Amount</p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Card */}
                    <div className="bg-background rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Pending</p>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold text-foreground">{pendingOrders}</span>
                                <p className="text-xs text-muted-foreground mt-1">Orders</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-semibold text-primary">{pendingAmount.toFixed(2)} BDT</span>
                                <p className="text-xs text-muted-foreground mt-1">Amount</p>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Card */}
                    <div className="bg-background rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-medium text-muted-foreground">Cancel</p>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <AlertCircle className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-2xl font-bold text-foreground">{cancelledOrders} ({cancelPercentage}%)</span>
                                <p className="text-xs text-muted-foreground mt-1">Orders</p>
                            </div>
                            <div className="text-right">
                                <span className="text-lg font-semibold text-primary">{cancelledAmount.toFixed(2)} BDT</span>
                                <p className="text-xs text-muted-foreground mt-1">Amount</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorHome;