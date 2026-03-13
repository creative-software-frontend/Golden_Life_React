import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Package, Truck, MapPin, CreditCard, CheckCircle2, 
    Clock, User, Phone, ArrowLeft, Receipt, Printer 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

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

// ... (imports and interfaces remain the same)

const OrderDetails: React.FC<{ orderNo?: string }> = ({ orderNo = "120326-50" }) => {
    const { t } = useTranslation("global");
    const [order, setOrder] = useState<OrderDetailsData | null>(null);
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
        const fetchOrderDetails = async () => {
            const token = getAuthToken();
            if (!token) {
                setError(t("orderDetails.errorAuth"));
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${baseURL}/api/student/order-tracking?order_no=${orderNo}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const fetchedOrder = response.data.orders ? response.data.orders[0] : response.data.order;
                
                if (fetchedOrder) {
                    setOrder(fetchedOrder);
                } else {
                    setError(t("orderDetails.errorNotFound"));
                }
            } catch (err) {
                setError(t("orderDetails.errorFailed"));
            } finally {
                setLoading(false);
            }
        };

        if (orderNo) fetchOrderDetails();
    }, [orderNo, baseURL, t]);

    const statuses = ["Order Placed", "Processing", "Shipped", "Delivered"];
    // Added optional chaining here for safety
    const currentStatusIndex = statuses.indexOf(order?.status || "Order Placed");

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-pulse flex flex-col items-center gap-3 text-slate-400">
                <Package className="w-8 h-8 animate-bounce" />
                <span className="font-bold tracking-widest">{t("orderDetails.loading")}</span>
            </div>
        </div>
    );

    if (error || !order) return (
        <div className="max-w-3xl mx-auto p-8 text-center bg-red-50 rounded-3xl border border-red-100 mt-10">
            <p className="text-red-500 font-bold">{error || t("orderDetails.errorGeneral")}</p>
        </div>
    );

    const itemsSubtotal = Number(order.total) - Number(order.delivery_charge);

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
            
            {/* Header / Branding Area */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <img 
                    src="/image/logo/logo.jpg" // Removed /public/ as Vite serves public folder from root
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
                        <span className="text-sm font-bold pr-1">{t("orderDetails.print")}</span>
                    </button>
                </div>
            </div>

            {/* Title & Date */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        {t("orderDetails.orderNumber", { number: order.order_no })}
                    </h1>
                    <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5 mt-1">
                        <Clock size={14} /> {t("orderDetails.orderPlacedOn", { date: new Date(order.created_at).toLocaleDateString() })}
                    </p>
                </div>
                <Link to="/" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <ArrowLeft size={14} /> {t("orderDetails.visitShop")}
                </Link>
            </div>

            {/* Tracking Progress */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6 md:p-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">{t("orderDetails.progressTitle")}</h3>
                <div className="relative flex justify-between items-center w-full max-w-2xl mx-auto mb-4">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0"></div>
                    <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full z-0 transition-all duration-700"
                        style={{ width: `${(Math.max(0, currentStatusIndex) / (statuses.length - 1)) * 100}%` }}
                    ></div>

                    {statuses.map((status, index) => {
                        const isCompleted = index <= currentStatusIndex;
                        return (
                            <div key={status} className="relative z-10 flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-500 ${
                                    isCompleted ? 'bg-emerald-500 text-white scale-110' : 'bg-slate-100 text-slate-300'
                                }`}>
                                    {index === statuses.length - 1 ? <CheckCircle2 size={18} /> : <Truck size={18} />}
                                </div>
                                <span className={`text-[10px] font-bold absolute -bottom-8 w-20 text-center uppercase tracking-tighter ${
                                    isCompleted ? 'text-slate-800' : 'text-slate-400'
                                }`}>
                                    {t(`orderDetails.orderProgress.${status.toLowerCase().replace(" ", "")}`)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    {/* Shipping Address */}
                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <MapPin size={16} /> {t("orderDetails.shippingAddress")}
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{t("orderDetails.recipient")}</p>
                                <p className="text-slate-800 font-bold flex items-center gap-2 text-sm"><User size={14} className="text-slate-400"/> {order.user_name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{t("orderDetails.contact")}</p>
                                <p className="text-slate-800 font-bold flex items-center gap-2 text-sm"><Phone size={14} className="text-slate-400"/> {order.user_phone}</p>
                            </div>
                            <p className="text-slate-600 text-xs font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
                                {order.user_address}
                            </p>
                        </div>
                    </div>

                    {/* Paid By */}
                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl p-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <CreditCard size={16} /> {t("orderDetails.paidBy")}
                        </h3>
                        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
                            <div>
                                <p className="text-blue-900 font-black text-sm">{order.payment?.payment_method || 'N/A'}</p>
                                <p className="text-[9px] font-bold text-blue-500/80 uppercase mt-0.5 tracking-tighter">TXN: {order.payment?.transaction_number || 'Pending'}</p>
                            </div>
                            <Receipt size={20} className="text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* Items Column */}
                <div className="md:col-span-2">
                    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden flex flex-col h-full">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Package size={16} /> {t("orderDetails.orderItems")}
                            </h3>
                            {/* FIX: Safe access to products length */}
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black">
                                {order.products?.length || 0} {t("orderDetails.itemsCount")}
                            </span>
                        </div>

                        <div className="p-6 space-y-4 flex-1">
                            {/* FIX: Safe mapping with optional chaining */}
                            {order.products?.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 bg-slate-50/30 p-3 rounded-2xl border border-slate-100/50 transition-hover hover:bg-slate-50">
                                    <div className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                                        <img 
                                            src={`${baseURL}/uploads/ecommarce/product_image/${item.product_image}`} 
                                            alt={item.product_name} 
                                            className="h-full w-full object-cover"
                                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-800 text-sm truncate">{item.product_name}</h4>
                                        <p className="text-[10px] font-black text-slate-400 mt-1 flex items-center gap-1.5 uppercase">
                                            {t("orderDetails.quantityLabel")}: <span className="text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">x{item.quantity}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-900">৳{item.subtotal}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-50 p-6 border-t border-slate-100">
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                                    <span>{t("orderDetails.subTotal")}</span>
                                    <span>৳{itemsSubtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                                    <span>{t("orderDetails.deliveryFee")}</span>
                                    <span>৳{order.delivery_charge}</span>
                                </div>
                            </div>
                            <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                                <span className="text-sm font-black text-slate-900 uppercase">{t("orderDetails.total")}</span>
                                <span className="text-2xl font-black text-emerald-600">৳{order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;