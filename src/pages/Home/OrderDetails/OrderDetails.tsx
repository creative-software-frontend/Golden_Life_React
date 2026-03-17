import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Package, Truck, MapPin, CreditCard, CheckCircle2, 
  Clock, User, Phone, ArrowLeft, Printer, Contact 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────
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

// ─── Component ─────────────────────────────────────────────
const OrderDetails = () => {
  const { t } = useTranslation("global");
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderNoFromQuery = searchParams.get('order');
  const { id, orderNo: orderNoFromState } = location.state || {};

  const effectiveOrderNo = orderNoFromQuery || orderNoFromState || id?.toString?.() || '';

  const [order, setOrder] = useState<OrderDetailsData | null>(null);
  const [ShippingInfo, setShippingInfo] = useState<BuyerAddress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.goldenlife.my';

  const getAuthToken = () => {
    const session = sessionStorage.getItem("student_session");
    if (!session) return null;
    try {
      const parsed = JSON.parse(session);
      if (new Date().getTime() > parsed.expiry) return null;
      return parsed.token;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!effectiveOrderNo) {
      setError(t("orderDetails.errorNotFound") || "No order number provided.");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      const token = getAuthToken();
      if (!token) {
        setError(t("orderDetails.errorAuth") || "Please log in to view order details.");
        setLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [orderRes, addrRes] = await Promise.all([
          axios.get(`${baseURL}/api/student/order-tracking?order_no=${encodeURIComponent(effectiveOrderNo)}`, { headers }),
          axios.get(`${baseURL}/api/student/addresses`, { headers }).catch(() => null)
        ]);

        const fetchedOrder = orderRes.data?.orders?.[0] ?? orderRes.data?.order ?? null;

        if (fetchedOrder) {
          setOrder(fetchedOrder);
        } else {
          setError(t("orderDetails.errorNotFound") || "Order not found.");
        }

        if (addrRes?.data?.status === "success" && addrRes.data.addresses) {
          const defaultAddr = addrRes.data.addresses.find((a: BuyerAddress) => a.is_default === "1");
          if (defaultAddr) setBuyerInfo(defaultAddr);
        }
      } catch (err: any) {
        console.error("Order fetch error:", err);
        setError(
          err.response?.data?.message ||
          t("orderDetails.errorFailed") ||
          "Failed to load order details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [effectiveOrderNo, baseURL, t]);

  // Status steps
  const statuses = [
    "Order Placed", "Processing", "Packaging", "Sent To Courier",
    "Ready To Courier", "On The Way", "Delivered", "Returned"
  ];

  const currentStatusIndex = statuses.findIndex(s =>
    order?.status?.toLowerCase().includes(s.toLowerCase())
  );
  const activeIndex = currentStatusIndex >= 0 ? currentStatusIndex : 0;
  const isReturned = order?.status?.toLowerCase().includes("returned") || false;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4 text-slate-400">
          <Package className="w-12 h-12 animate-bounce" />
          <span className="font-bold tracking-widest">{t("orderDetails.loading") || "LOADING..."}</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center bg-red-50 rounded-3xl border border-red-100 mt-12">
        <p className="text-red-600 font-bold text-lg mb-6">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const subtotal = Number(order.total) - Number(order.delivery_charge);
  const totalItems = order.products?.reduce((sum, p) => sum + Number(p.quantity || 0), 0) || 0;

  return (
    <div className="w-full max-w-[92%] 2xl:max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-10 space-y-8 print:space-y-6">
      {/* Print-friendly styles */}
      <style>{`
        @media print {
          nav, footer, .no-print { display: none !important; }
          body { background: white; }
          .shadow-sm, .shadow-lg { box-shadow: none !important; }
        }
      `}</style>

      {/* Header - Improved */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm no-print">
        <img
          src="/image/logo/logo.jpg"
          alt="Company Logo"
          className="h-16 object-contain"
        />
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-bold text-slate-800">{t("orderDetails.companyName")}</p>
            <p className="text-xs text-slate-500">{t("orderDetails.companyPhone")}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition flex items-center gap-2 shadow-md font-semibold"
          >
            <Printer size={18} />
            {t("orderDetails.print") || "Print Invoice"}
          </button>
        </div>
      </div>

      {/* Title & Basic Info - Improved */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {t("orderDetails.orderNumber", { number: order.order_no }) || `Order #${order.order_no}`}
            </h1>
            <span className={`px-5 py-2 rounded-full text-sm font-bold shadow-sm ${
              isReturned ? 'bg-red-100 text-red-700' :
              order.status.toLowerCase().includes('delivered') ? 'bg-emerald-100 text-emerald-700' :
              order.status.toLowerCase().includes('way') || order.status.toLowerCase().includes('courier') 
                ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {order.status}
            </span>
          </div>
          <p className="text-slate-600 mt-3 flex items-center gap-2 text-base">
            <Clock size={18} />
            {t("orderDetails.orderPlacedOn", { date: new Date(order.created_at).toLocaleDateString() })}
          </p>
        </div>

        <Link
          to="/dashboard/allProducts"
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 no-print transition"
        >
          <ArrowLeft size={18} /> {t("orderDetails.visitShop") || "Continue Shopping"}
        </Link>
      </div>

      {/* Progress Tracker - Improved */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10">
          {t("orderDetails.progressTitle") || "Order Progress"}
        </h3>

        <div className="relative flex justify-between items-center max-w-6xl mx-auto">
          <div className="absolute inset-x-0 top-1/2 h-2.5 bg-slate-100 rounded-full -translate-y-1/2" />
          <div
            className={`absolute left-0 top-1/2 h-2.5 rounded-full transition-all duration-700 -translate-y-1/2 ${
              isReturned ? 'bg-red-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${(activeIndex / (statuses.length - 1)) * 100}%` }}
          />

          {statuses.map((status, idx) => {
            const isActiveOrDone = idx <= activeIndex;
            return (
              <div key={status} className="relative z-10 flex flex-col items-center">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 ${
                  isReturned && idx === statuses.length - 1
                    ? 'bg-red-500 text-white scale-110'
                    : isActiveOrDone
                      ? 'bg-emerald-500 text-white scale-110 shadow-emerald-200'
                      : 'bg-slate-100 text-slate-400'
                }`}>
                  {idx === statuses.length - 1 ? <CheckCircle2 size={26} /> : <Truck size={24} />}
                </div>
                <span className={`text-xs md:text-sm font-bold mt-4 text-center uppercase tracking-wider w-24 ${
                  isActiveOrDone || (isReturned && idx === statuses.length - 1)
                    ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 print:flex-col">
        {/* Order Items + Summary - Slightly Enhanced */}
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          {/* ... Your existing Order Items and Summary code remains unchanged ... */}
          {/* (I kept it exactly as you had it) */}
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-black text-slate-500 uppercase tracking-wider flex items-center gap-2.5">
              <Package size={20} /> {t("orderDetails.orderItems") || "Order Items"}
              <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </h3>

            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
              <CreditCard size={20} className="text-blue-600" />
              <div>
                <p className="text-blue-900 font-bold text-sm">{order.payment?.payment_method || 'Not specified'}</p>
                <p className="text-xs text-blue-600/80 font-medium">
                  TXN: {order.payment?.transaction_number || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Products List & Summary - unchanged */}
          <div className="p-6 md:p-8 space-y-5 flex-1">
            {order.products?.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 bg-slate-50/40 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-white">
                  <img
                    src={`${baseURL}/uploads/ecommarce/product_image/${item.product_image}`}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image'; }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-lg leading-tight truncate">
                    {item.product_name}
                  </h4>
                  <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                    {t("orderDetails.quantityLabel") || "Qty"}:
                    <span className="bg-white border border-slate-200 px-3 py-1 rounded text-slate-700 font-medium">
                      ×{item.quantity}
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-black text-slate-900 text-xl">৳{Number(item.subtotal).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm font-medium text-slate-600">
                <span>{t("orderDetails.subTotal") || "Subtotal"} ({totalItems} items)</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-slate-600">
                <span>{t("orderDetails.deliveryFee") || "Delivery Fee"}</span>
                <span>৳{Number(order.delivery_charge).toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-6 flex justify-between items-center">
              <span className="text-lg font-black text-slate-900 uppercase tracking-wide">
                {t("orderDetails.total") || "Total Amount"}
              </span>
              <span className="text-3xl md:text-4xl font-black text-emerald-600">
                ৳{Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Addresses - Improved Design */}
        <div className="w-full xl:w-96 2xl:w-[440px] flex flex-col gap-6 shrink-0 print:w-full">
          {/* Buyer Info - Fixed Title & Design */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-base font-black text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2.5">
              <Contact size={20} /> Shipping Information
            </h3>
            {ShippingInfo ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Name</p>
                  <p className="text-slate-800 font-semibold flex items-center gap-2 mt-1">
                    <User size={16} className="text-slate-400" /> {ShippingInfo.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Phone</p>
                  <p className="text-slate-800 font-semibold flex items-center gap-2 mt-1">
                    <Phone size={16} className="text-slate-400" /> {ShippingInfo.phone}
                  </p>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100 mt-3">
                  {ShippingInfo.address}
                </p>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No buyer information available.</p>
            )}
          </div>

          {/* Shipping Address - Clean Design */}
       
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;