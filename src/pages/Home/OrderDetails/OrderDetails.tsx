import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Package, Truck, MapPin, CreditCard, CheckCircle2, 
    Clock, User, Phone, ArrowLeft, Printer, Contact 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from "react-router-dom";

// --- Types ---
interface Product {
    id: number;
    product_name: string;
    product_image: string;
    quantity: string;
    subtotal: string;
}

interface Payment {
    payment_method: string;
    transaction_number: string;
}

interface OrderDetailsData {
    id: number;
    order_no: string;
    user_name: string;
    user_phone: string;
    user_address: string;
    delivery_charge: string;
    total: string;
    created_at: string;
    status: string;
    payment: Payment | null;
    products: Product[];
}

interface BuyerAddress {
    id: number;
    name: string;
    phone: string;
    address: string;
    is_default: string;
}

const OrderDetails = () => {
    const { t } = useTranslation("global");
    const location = useLocation();
    const navigate = useNavigate();
    
    const { id, orderNo } = location.state || {};

    const [order, setOrder] = useState<OrderDetailsData | null>(null);
    const [buyerInfo, setBuyerInfo] = useState<BuyerAddress | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

    const handlePrint = () => window.print();

    const getAuthToken = () => {
        const session = sessionStorage.getItem("student_session");
        if (!session) return null;
        try {
            const parsed = JSON.parse(session);
            return new Date().getTime() > parsed.expiry ? null : parsed.token;
        } catch (e) { return null; }
    };

    useEffect(() => {
        if (!orderNo) {
            setError(t("orderDetails.errorNotFound") || "No order number provided.");
            setLoading(false);
            return;
        }

        const fetchDetails = async () => {
            const token = getAuthToken();
            if (!token) {
                setError(t("orderDetails.errorAuth") || "Authentication required.");
                setLoading(false);
                return;
            }

            try {
                const headers = { Authorization: `Bearer ${token}` };

                // FIX: Encode the orderNo so the # symbol doesn't break the URL
                const [orderResponse, addressResponse] = await Promise.all([
                    axios.get(`${baseURL}/api/student/order-tracking?order_no=${encodeURIComponent(orderNo)}`, { headers }),
                    axios.get(`${baseURL}/api/student/addresses`, { headers }).catch(() => null)
                ]);
                
                const fetchedOrder = orderResponse.data.orders ? orderResponse.data.orders[0] : orderResponse.data.order;
                if (fetchedOrder) {
                    setOrder(fetchedOrder);
                } else {
                    setError(t("orderDetails.errorNotFound") || "Order not found.");
                }

                if (addressResponse?.data?.status === "success" && addressResponse.data.addresses) {
                    const defaultAddress = addressResponse.data.addresses.find((addr: BuyerAddress) => addr.is_default === "1");
                    if (defaultAddress) {
                        setBuyerInfo(defaultAddress);
                    }
                }
                
            } catch (err) {
                setError(t("orderDetails.errorFailed") || "Failed to load details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [orderNo, id, baseURL, t]);

    // Added 6 steps with short titles
    const statuses = ["Placed", "Confirmed", "Packed", "Shipped", "Arrived", "Delivered"];
    
    // FIX: Safer status match to ensure the progress bar fills correctly
    const currentStatusIndex = statuses.findIndex(s => 
        order?.status?.toLowerCase().includes(s.toLowerCase())
    );
    const activeIndex = currentStatusIndex !== -1 ? currentStatusIndex : 0;

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-pulse flex flex-col items-center gap-3 text-slate-400">
                <Package className="w-8 h-8 animate-bounce" />
                <span className="font-bold tracking-widest">{t("orderDetails.loading") || "LOADING..."}</span>
            </div>
        </div>
    );

    if (error || !order) return (
        <div className="max-w-2xl mx-auto p-8 text-center bg-red-50 rounded-3xl border border-red-100 mt-10">
            <p className="text-red-500 font-bold mb-4">{error}</p>
            <button 
                onClick={() => navigate(-1)}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-bold"
            >
                Go Back
            </button>
        </div>
    );

    const itemsSubtotal = Number(order.total) - Number(order.delivery_charge);
    
    // FIX: Calculate total items by summing up the quantities properly
    const totalItemsCount = order.products?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;

    return (
        <div className="w-full max-w-[90%] 2xl:max-w-[1300px] mx-auto p-4 md:p-8 space-y-6">
            
            {/* Header / Branding Area */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <img 
                    src="/image/logo/logo.jpg" 
                    alt="Logo" 
                    className="h-12 object-contain" 
                />
                <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right">
                        <p className="text-xs font-bold text-slate-800">{t("orderDetails.companyName")}</p>
                        <p className="text-[10px] text-slate-500">{t("orderDetails.companyPhone")}</p>
                    </div>
                    <button 
                        onClick={handlePrint}
                        className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                    >
                        <Printer size={18} />
                        <span className="text-sm font-bold pr-1">{t("orderDetails.print") || "Print"}</span>
                    </button>
                </div>
            </div>

            {/* Title & Date */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {t("orderDetails.orderNumber", { number: order.order_no }) || `Order ${order.order_no}`}
                    </h1>
                    <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5 mt-2">
                        <Clock size={16} /> {t("orderDetails.orderPlacedOn", { date: new Date(order.created_at).toLocaleDateString() })}
                    </p>
                </div>
                <Link to="/dashboard/allProducts" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <ArrowLeft size={16} /> {t("orderDetails.visitShop") || "Visit Shop"}
                </Link>
            </div>

            {/* Tracking Progress */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 md:p-10 overflow-hidden">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-10">{t("orderDetails.progressTitle") || "TRACKING PROGRESS"}</h3>
                <div className="relative flex justify-between items-center w-full max-w-5xl mx-auto mb-6">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-slate-100 rounded-full z-0"></div>
                    <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-emerald-500 rounded-full z-0 transition-all duration-700"
                        style={{ width: `${(Math.max(0, activeIndex) / (statuses.length - 1)) * 100}%` }}
                    ></div>

                    {statuses.map((status, index) => {
                        const isCompleted = index <= activeIndex;
                        return (
                            <div key={status} className="relative z-10 flex flex-col items-center">
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-500 ${
                                    isCompleted ? 'bg-emerald-500 text-white scale-110' : 'bg-slate-200 text-slate-400'
                                }`}>
                                    {index === statuses.length - 1 ? <CheckCircle2 size={18} /> : <Truck size={16} />}
                                </div>
                                <span className={`text-[9px] md:text-[10px] font-bold absolute -bottom-6 w-16 md:w-20 text-center uppercase tracking-tighter ${
                                    isCompleted ? 'text-slate-800' : 'text-slate-400'
                                }`}>
                                    {/* FIX: Just use the raw status string from the array */}
                                    {status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col xl:flex-row gap-6">
                
                {/* Left Column: Order Items */}
                <div className="flex-1 bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden flex flex-col">
                    <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Package size={18} /> {t("orderDetails.orderItems") || "Order Items"}
                            {/* FIX: Badge to show total exact item count */}
                            <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-md ml-1 normal-case tracking-normal">
                                {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'}
                            </span>
                        </h3>
                        
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
                            <CreditCard size={18} className="text-blue-500 shrink-0" />
                            <div>
                                <p className="text-blue-900 font-black text-xs leading-tight">{order.payment?.payment_method || 'N/A'}</p>
                                <p className="text-[10px] font-bold text-blue-500/80 uppercase tracking-tighter">TXN: {order.payment?.transaction_number || 'Pending'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-4 flex-1">
                        {order.products?.map((item) => (
                            <div key={item.id} className="flex items-center gap-6 bg-slate-50/30 p-4 rounded-2xl border border-slate-100/50 hover:bg-slate-50 transition-colors">
                                <div className="h-20 w-20 shrink-0 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                                    <img 
                                        src={`${baseURL}/uploads/ecommarce/product_image/${item.product_image}`} 
                                        alt={item.product_name} 
                                        className="h-full w-full object-cover"
                                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-base truncate">{item.product_name}</h4>
                                    <p className="text-xs font-black text-slate-400 mt-2 flex items-center gap-1.5 uppercase">
                                        {t("orderDetails.quantityLabel") || "QTY"}: <span className="text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">x{item.quantity}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900 text-lg">৳{item.subtotal}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100">
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                {/* FIX: Ensure subtotal uses accurate count */}
                                <span>{t("orderDetails.subTotal") || "Subtotal"} ({totalItemsCount} items)</span>
                                <span>৳{itemsSubtotal}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                <span>{t("orderDetails.deliveryFee") || "Delivery Fee"}</span>
                                <span>৳{order.delivery_charge}</span>
                            </div>
                        </div>
                        <div className="border-t border-slate-200 pt-6 flex justify-between items-center">
                            <span className="text-base font-black text-slate-900 uppercase">{t("orderDetails.total") || "Total"}</span>
                            <span className="text-3xl font-black text-emerald-600">৳{order.total}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Address Cards */}
                <div className="w-full xl:w-[400px] 2xl:w-[500px] flex flex-col gap-6 shrink-0">
                    {/* Buyer Information */}
                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 md:p-8">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Contact size={18} /> {t("orderDetails.buyerInfo") || "Buyer Information"}
                        </h3>
                        {buyerInfo ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase">Buyer</p>
                                    <p className="text-slate-800 font-bold flex items-center gap-2 text-base mt-1"><User size={16} className="text-slate-400"/> {buyerInfo.name}</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase">Phone</p>
                                    <p className="text-slate-800 font-bold flex items-center gap-2 text-base mt-1"><Phone size={16} className="text-slate-400"/> {buyerInfo.phone}</p>
                                </div>
                                <p className="text-slate-600 text-sm font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
                                    {buyerInfo.address}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 font-medium">No default buyer address found.</p>
                        )}
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 md:p-8">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <MapPin size={18} /> {t("orderDetails.shippingAddress") || "Shipping Details"}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase">{t("orderDetails.recipient") || "Recipient"}</p>
                                <p className="text-slate-800 font-bold flex items-center gap-2 text-base mt-1"><User size={16} className="text-slate-400"/> {order.user_name}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase">{t("orderDetails.contact") || "Contact"}</p>
                                <p className="text-slate-800 font-bold flex items-center gap-2 text-base mt-1"><Phone size={16} className="text-slate-400"/> {order.user_phone}</p>
                            </div>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
                                {order.user_address}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrderDetails;