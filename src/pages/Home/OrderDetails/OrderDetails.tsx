import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import {
  Package, Truck, MapPin, CreditCard, CheckCircle2,
  User, Phone, ArrowLeft, Printer, Contact, Mail, Calendar, Download
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

/* ─── Print-only Invoice Component ───────────────────────────── */
const PrintInvoice = ({ order, shippingInfo, buyerProfile, subtotal, totalItems, baseURL }: any) => {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);
  
  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const printDateTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const invoiceNumber = order.order_no;
  const trackingUrl = `${window.location.origin}/order-tracking/${invoiceNumber}`;

  // Generate QR Code
  useEffect(() => {
    if (qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, trackingUrl, {
        width: 100,
        margin: 1,
        color: {
          dark: '#1e293b',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      }, (error) => {
        if (error) console.error('QR Code generation error:', error);
      });
    }
  }, [trackingUrl]);

  // Generate Barcode
  useEffect(() => {
    if (barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, invoiceNumber, {
          format: 'CODE128',
          width: 2,
          height: 60,
          displayValue: true,
          fontSize: 12,
          font: 'monospace',
          textMargin: 4,
          margin: 5,
          background: '#ffffff',
          lineColor: '#1e293b',
        });
      } catch (error) {
        console.error('Barcode generation error:', error);
      }
    }
  }, [invoiceNumber]);

  return (
    <>
      {/* ─── PRINT SPECIFIC CSS ─── */}
      <style>{`
        @media screen {
          .print-only { display: none !important; }
        }
        @media print {
          /* Hide everything else on the page */
          body * { visibility: hidden; }
          
          /* Make the invoice visible and allow it to grow */
          .print-only, .print-only * { visibility: visible; }
          .print-only {
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            display: block !important;
          }

          /* Table print rules */
          table { page-break-inside: auto; }
          thead { display: table-header-group; /* Repeats header on new pages */ }
          tr { page-break-inside: avoid; page-break-after: auto; /* Stops rows splitting in half */ }
          
          /* Keep totals blocks together but allow breaking if they are too large to avoid huge gaps */
          .no-break { page-break-inside: auto; }
          
          @page { margin: 15mm; }
        }
      `}</style>

      {/* ─── INVOICE WRAPPER ─── */}
      <div className="print-only" style={{
        fontFamily: 'Arial, sans-serif',
        color: '#111',
        background: '#fff',
        position: 'relative', /* CHANGED: Replaced 'fixed' */
        width: '100%',
        height: 'auto',       /* CHANGED: Replaced '100%' */
        overflow: 'visible',  /* CHANGED: Replaced 'hidden' */
        boxSizing: 'border-box',
        padding: '0'          /* Margins are now handled by @page in CSS */
      }}>
        {/* ─── Header ─── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #f5d800', paddingBottom: '16px', marginBottom: '24px' }}>
          <div>
            <img src="/image/logo/logo.jpg" alt="Golden Life" style={{ height: '48px', objectFit: 'contain' }} />
          </div>

          <div style={{ textAlign: 'right', flex: 1, marginRight: '20px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 4px', color: '#111' }}>Invoice</h1>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#333', margin: 0 }}>#{order.order_no}</h2>
            <p style={{ fontSize: '11px', color: '#777', marginTop: '4px', marginBottom: 0 }}>Date: {orderDate} &nbsp;|&nbsp; Status: {order.status}</p>
          </div>

          {/* QR Code & Barcode Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            {/* QR Code */}
            <canvas
              ref={qrCanvasRef}
              width={100}
              height={100}
              style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
            />
            <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>Scan to Track</span>
            
            {/* Barcode */}
            <svg
              ref={barcodeRef}
              style={{ maxWidth: '200px', height: '80px' }}
            />
            <span style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace', fontWeight: 600 }}>{invoiceNumber}</span>
          </div>
        </div>

        {/* ─── Billing + Shipping ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '16px', borderTop: '1px solid #eee', paddingTop: '14px' }}>
          {/* Billing */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', color: '#111', textTransform: 'uppercase', marginBottom: '10px', marginTop: 0 }}>Billing Address</p>
            {buyerProfile ? (
              <>
                <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px' }}>{buyerProfile.student?.name}</p>
                <p style={{ fontSize: '13px', color: '#444', margin: '0 0 3px' }}>{buyerProfile.personal_info?.location || buyerProfile.personal_info?.district || '—'}</p>
                <p style={{ fontSize: '13px', color: '#444', margin: '0 0 3px' }}>{buyerProfile.student?.email}</p>
                <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>{buyerProfile.student?.mobile}</p>
              </>
            ) : (
              <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>Not provided</p>
            )}
          </div>
          {/* Shipping */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', color: '#111', textTransform: 'uppercase', marginBottom: '10px', marginTop: 0 }}>Shipping Address</p>
            {shippingInfo ? (
              <>
                <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px' }}>{shippingInfo.name}</p>
                <p style={{ fontSize: '13px', color: '#444', margin: '0 0 3px' }}>{shippingInfo.address}</p>
                <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>{shippingInfo.phone}</p>
              </>
            ) : (
              <>
                <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px' }}>{order.user_name}</p>
                <p style={{ fontSize: '13px', color: '#444', margin: '0 0 3px' }}>{order.user_address}</p>
                <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>{order.user_phone}</p>
              </>
            )}
          </div>
        </div>

        {/* ─── Product Table ─── */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '12px' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 14px 10px 0', textAlign: 'left', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Description</th>
              <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '80px' }}>Quantity</th>
              <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '100px' }}>Unit Price</th>
              <th style={{ padding: '10px 14px 10px 14px', textAlign: 'right', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '100px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.products?.map((item: any) => {
              const qty = Number(item.quantity) || 1;
              const itemTotal = Number(item.subtotal) || 0;
              const unitPrice = qty > 0 ? (itemTotal / qty) : itemTotal;

              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0', borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '12px 12px 12px 0', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={`${baseURL}/uploads/ecommarce/product_image/${item.product_image}`}
                        alt={item.product_name}
                        style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee', flexShrink: 0 }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/40?text=?'; }}
                      />
                      <span style={{ fontWeight: 700, color: '#111' }}>{item.product_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#555' }}>{qty}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#555' }}>৳{unitPrice.toFixed(2)}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: '#111' }}>৳{itemTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ─── Totals and Payment (Grouped to prevent breaking across pages) ─── */}
        <div className="no-break">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <div style={{ width: '280px', fontSize: '13px' }}>
              {[
                { label: 'Subtotal', value: `৳${subtotal.toFixed(2)}` },
                { label: 'Delivery Fee', value: `৳${Number(order.delivery_charge).toFixed(2)}` },
                { label: 'Total Amount Paid', value: `৳${Number(order.total).toFixed(2)}`, bold: true },
                { label: 'Total Due', value: '৳0', bold: true },
              ].map(({ label, value, bold }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: bold ? '#111' : '#555', fontWeight: bold ? 800 : 500 }}>{label}</span>
                  <span style={{ fontWeight: bold ? 800 : 600, color: '#111' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Info */}
          {order.payment && (
            <div style={{ padding: '0', marginBottom: '32px', fontSize: '12px', color: '#555' }}>
              <span style={{ fontWeight: 800, color: '#111' }}>PaymentType: </span>
              {order.payment.payment_method}
              {order.payment.transaction_number && (
                <span> &nbsp;|&nbsp; TXN: {order.payment.transaction_number}</span>
              )}
            </div>
          )}
        </div>

        {/* ─── Footer Note ─── */}
        <div className="no-break" style={{ borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '11px', color: '#555', lineHeight: 1.6 }}>
          <p style={{ margin: '0 0 15px 0' }}>
            Please note that depending on the availability of your products, your order will be shipped within 5 to 7 business days. Please go through the return instructions as well as warranty period of the products upon receiving. For any additional queries please call 654-123-123 or send us an email at support@goldenlife.my
          </p>
          <p style={{ fontWeight: 800, color: '#111', fontSize: '12px', margin: '0 0 10px 0' }}>
            Thank you for shopping!
          </p>
          <p style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic', margin: '10px 0 0 0' }}>
            Printed on: {printDateTime}
          </p>
        </div>
      </div>
    </>

  );
};

// ─── Types ────────────────────────────────────────────────
interface Product {
  id: number;
  product_id?: string | number;
  product_name: string;
  product_image: string;
  quantity: string;
  subtotal: string;
  ebook?: string;
  video_link?: string;
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

interface StudentProfile {
  student: {
    name: string;
    email: string;
    mobile: string;
    affiliate_id: string;
  };
  personal_info: {
    district: string;
    location: string;
    division: string;
  };
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
  const [shippingInfo, setShippingInfo] = useState<BuyerAddress | null>(null);
  const [buyerProfile, setBuyerProfile] = useState<StudentProfile | null>(null);
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

        const [ordersRes, addrRes, profileRes] = await Promise.all([
          axios.get(`${baseURL}/api/student/orders`, { headers }),
          axios.get(`${baseURL}/api/student/addresses`, { headers }).catch(() => null),
          axios.get(`${baseURL}/api/student/profile`, { headers }).catch(() => null)
        ]);

        if (ordersRes.data?.status === "success" && ordersRes.data?.orders) {
          const matchedOrder = ordersRes.data.orders.find(
            (o: OrderDetailsData) => o.order_no === effectiveOrderNo
          );

          if (matchedOrder) {
            const productsRes = await axios.get(`${baseURL}/api/products`, { headers }).catch(() => null);
            // Handle multiple potential response structures
            const allProductsList = productsRes?.data?.data?.products || productsRes?.data?.products || [];

            const enrichedProducts = matchedOrder.products.map((orderP: Product) => {
              const pId = String(orderP.product_id ?? orderP.id);
              const details = allProductsList.find((p: any) => String(p.id) === pId);
              return {
                ...orderP,
                ebook: details?.ebook ? String(details.ebook).trim() : "0",
                video_link: details?.video_link?.trim() || ""
              };
            });

            setOrder({ ...matchedOrder, products: enrichedProducts });
          } else {
            setError(t("orderDetails.errorNotFound") || "Order not found.");
          }
        } else {
          setError(t("orderDetails.errorNotFound") || "Failed to load orders.");
        }

        if (addrRes?.data?.status === "success" && addrRes.data.addresses) {
          const defaultAddr = addrRes.data.addresses.find((a: BuyerAddress) => a.is_default === "1");
          if (defaultAddr) setShippingInfo(defaultAddr);
        }

        if (profileRes?.data?.status === "success" && profileRes.data.student) {
          setBuyerProfile(profileRes.data);
        }
      } catch (err: any) {
        console.error("Order fetch error:", err);
        setError(err.response?.data?.message || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [effectiveOrderNo, baseURL, t]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400 animate-pulse">
          <Package className="w-12 h-12 animate-bounce" />
          <span className="font-medium tracking-wider">LOADING...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <p className="text-red-600 font-medium mb-6">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  const subtotal = Number(order.total) - Number(order.delivery_charge);
  const totalItems = order.products?.reduce((sum, p) => sum + Number(p.quantity || 0), 0) || 0;

  const statuses = [
    "Order Placed", "Processing", "Packaging", "Sent To Courier",
    "Ready To Courier", "On The Way", "Delivered", "Returned"
  ];

  const currentStatusIndex = statuses.findIndex(s =>
    order.status.toLowerCase().includes(s.toLowerCase())
  );
  const activeIndex = currentStatusIndex >= 0 ? currentStatusIndex : 0;
  const isReturned = order.status.toLowerCase().includes("returned");

  return (
    <div className="min-h-screen bg-slate-50/40 print-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 space-y-6 lg:space-y-8">
        {/* Print styles */}
        <style>{`
          @media print {
            @page { margin: 10mm; size: A4 portrait; }
            .no-print, header, nav, footer, .fixed, .backdrop-blur,
            .screen-only { display: none !important; }
            .print-only { display: block !important; }
            body, html { background: white !important; color: black !important; margin: 0 !important; padding: 0 !important; }
            .print-wrapper { all: unset; display: block !important; }
            .print-wrapper > * { all: unset; display: block !important; }
          }
        `}</style>

        {/* Print Invoice — hidden on screen, visible when printing */}
        <PrintInvoice
          order={order}
          shippingInfo={shippingInfo}
          buyerProfile={buyerProfile}
          subtotal={subtotal}
          totalItems={totalItems}
          baseURL={baseURL}
        />

        {/* ── Screen Header (no-print) ── */}
        <div className="screen-only bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left: logo + tagline */}
          <div className="flex items-center gap-3">
            <img src="/image/logo/logo.jpg" alt="Golden Life" className="h-10 sm:h-12 object-contain" />
            <div className="hidden sm:block">

            </div>
          </div>
          {/* Right: company info + print button */}
          <div className="flex items-center gap-4">

            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition shadow-sm"
            >
              <Printer size={15} />
              Print
            </button>
          </div>
        </div>

        {/* Title + Status */}
        <div className="screen-only flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Order #{effectiveOrderNo}
              </h1>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${isReturned ? 'bg-red-100 text-red-700' :
                  order.status.toLowerCase().includes('delivered') ? 'bg-emerald-100 text-emerald-700' :
                    order.status.toLowerCase().includes('way') || order.status.toLowerCase().includes('courier') ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-800'
                  }`}
              >
                {order.status}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
              <Calendar size={14} />
              {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>

          <Link
            to="/dashboard/allProducts"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5 text-sm no-print"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>

        {/* Progress Tracker */}
        <div className="screen-only bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
            Order Progress
          </h3>

          <div className="relative flex flex-wrap justify-between gap-2 sm:gap-0 items-center max-w-5xl mx-auto">
            <div className="absolute inset-x-0 top-1/2 h-1.5 bg-slate-100 rounded-full -translate-y-1/2 hidden sm:block" />
            <div
              className={`absolute left-0 top-1/2 h-1.5 rounded-full transition-all ${isReturned ? 'bg-red-500' : 'bg-emerald-500'} hidden sm:block`}
              style={{ width: `${(activeIndex / (statuses.length - 1)) * 100}%` }}
            />

            {statuses.map((status, idx) => {
              const isActive = idx <= activeIndex;
              return (
                <div key={status} className="relative z-10 flex flex-col items-center flex-1 min-w-[70px] sm:min-w-0">
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-sm transition-all ${isReturned && idx === statuses.length - 1
                      ? 'bg-red-500 text-white ring-2 ring-red-200'
                      : isActive
                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-200'
                        : 'bg-slate-100 text-slate-400'
                      }`}
                  >
                    {idx === statuses.length - 1 ? <CheckCircle2 size={18} /> : <Truck size={16} />}
                  </div>
                  <span className={`mt-2 text-[10px] sm:text-xs font-medium text-center leading-tight ${isActive || (isReturned && idx === statuses.length - 1) ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="screen-only grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left - Items + Summary (takes 3/4 on xl) */}
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
                  <Package size={18} />
                  Order Items
                  <span className="ml-2 bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </span>
                </h3>

                <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 flex items-center gap-3 text-sm">
                  <CreditCard size={16} className="text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-900">{order.payment?.payment_method || '—'}</div>
                    <div className="text-xs text-blue-600/80">
                      TXN: {order.payment?.transaction_number || '—'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {order.products?.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 bg-slate-50/60 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all"
                  >
                    <div className="w-full sm:w-24 h-24 sm:h-24 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0">
                      <img
                        src={`${baseURL}/uploads/ecommarce/product_image/${item.product_image}`}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image')}
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <h4 className="font-semibold text-slate-800 line-clamp-2">
                        {item.product_name}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span>Qty:</span>
                        <span className="bg-white border border-slate-200 px-3 py-1 rounded text-slate-700 font-medium">
                          ×{item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between gap-3 sm:gap-4 min-w-[100px]">
                      <p className="font-bold text-lg text-slate-900">
                        ৳{Number(item.subtotal).toFixed(2)}
                      </p>

                      {item.ebook === "1" && item.video_link ? (
                        <button
                          onClick={() => window.open(item.video_link, '_blank', 'noopener,noreferrer')}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 transition no-print whitespace-nowrap"
                        >
                          <Download size={14} />
                          Download
                        </button>
                      ) : item.ebook === "1" ? (
                        <p className="text-xs text-amber-700 italic">Coming soon</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-slate-50 p-5 sm:p-6 border-t">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>Delivery Fee</span>
                    <span>৳{Number(order.delivery_charge).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4 mt-3 flex justify-between items-center text-lg font-bold">
                    <span className="text-slate-900">Total</span>
                    <span className="text-emerald-600 text-2xl sm:text-3xl">
                      ৳{Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar - Buyer & Shipping */}
          <div className="space-y-6 xl:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={16} /> Buyer Profile
              </h3>
              {buyerProfile ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Name</p>
                    <p className="font-medium">{buyerProfile.student.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Contact</p>
                    <p className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" /> {buyerProfile.student.email}
                    </p>
                    <p className="flex items-center gap-2 mt-1.5">
                      <Phone size={14} className="text-slate-400" /> {buyerProfile.student.mobile}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Location</p>
                    <p className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      {buyerProfile.personal_info?.location || buyerProfile.personal_info?.district || 'Not provided'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">Profile unavailable</p>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Contact size={16} /> Shipping Address
              </h3>
              {shippingInfo ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Name</p>
                    <p className="font-medium">{shippingInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Phone</p>
                    <p>{shippingInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Address</p>
                    <p className="leading-relaxed">{shippingInfo.address}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">No shipping details</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;