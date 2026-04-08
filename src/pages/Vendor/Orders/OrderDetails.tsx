import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, User, Phone, MapPin, Printer, Check, CreditCard, Receipt } from 'lucide-react';
import { useOrders } from './hooks/useOrders';
import { Order, OrderStatus } from './types/order.types';
import { OrderStatusBadge } from './components/OrderStatusBadge';
import { StatusUpdateModal } from './components/StatusUpdateModal';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

// Helper function to format address
const formatAddress = (address: string | undefined) => {
  if (!address) return 'Not provided';
  if (!isNaN(Number(address))) {
    return 'Address not available';
  }
  return address;
};

/* ─── Print-only Invoice Component ─── */
const PrintInvoice = ({ order, formatDate, fullAddressText, orderTransaction }: { 
  order: Order; 
  formatDate: (d: string) => string; 
  fullAddressText?: string | null; 
  orderTransaction?: any;
}) => {
  const subtotal = parseFloat(order.total) - parseFloat(order.delivery_charge);
  const invoiceNumber = order.order_no;
  const orderDate = formatDate(order.created_at);
  const printDateTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // QR Code and Barcode refs
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);
  const trackingUrl = `${window.location.origin}/order-tracking/${invoiceNumber}`;

  // Generate QR Code
  useEffect(() => {
    if (qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, trackingUrl, {
        width: 90,
        margin: 1,
        color: { dark: '#1e293b', light: '#ffffff' },
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
          width: 1.8,
          height: 50,
          displayValue: true,
          fontSize: 10,
          font: 'monospace',
          textMargin: 3,
          margin: 5,
          background: '#ffffff',
          lineColor: '#1e293b',
        });
      } catch (error) {
        console.error('Barcode generation error:', error);
      }
    }
  }, [invoiceNumber]);

  // Get user email - try multiple possible field names
  const userEmail = (order as any).user_email || (order as any).email || (order as any).customer_email || '—';

  return (
    <>
      <style>{`
        @media screen {
          .print-only { display: none !important; }
        }
        @media print {
          body * { visibility: hidden; }
          .print-only, .print-only * { visibility: visible; }
          .print-only {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          @page { margin: 12mm; size: A4; }
        }
      `}</style>

      <div className="print-only" style={{
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#111827',
        background: '#ffffff',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
      }}>
        
        {/* ========== HEADER: Logo Left + Invoice Info Right ========== */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '2px solid #f5b800',
          paddingBottom: '16px',
          marginBottom: '24px'
        }}>
          {/* Left: Logo + Company Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/image/logo/logo.jpg" 
              alt="Golden Life" 
              style={{ height: '55px', width: '55px', objectFit: 'contain', borderRadius: '10px' }} 
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#111827', letterSpacing: '-0.3px' }}>GOLDEN LIFE</h1>
              <p style={{ fontSize: '9px', color: '#6b7280', margin: '2px 0 0 0' }}>No #1 Digital Business & Reseller Platform in Bangladesh</p>
            </div>
          </div>
          
          {/* Right: Invoice Number + Date + Status */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              background: '#f5b800', 
              color: '#111827', 
              padding: '6px 14px', 
              borderRadius: '30px',
              fontWeight: 800,
              fontSize: '14px',
              marginBottom: '8px',
              display: 'inline-block'
            }}>
              INVOICE #{invoiceNumber}
            </div>
            <p style={{ fontSize: '10px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Date: {orderDate} | Status: <span style={{ fontWeight: 600, color: '#f5b800' }}>{order.status}</span>
            </p>
          </div>
        </div>

        {/* ========== TWO COLUMN: Addresses (Left) + QR/Barcode (Right) ========== */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          gap: '40px', 
          marginBottom: '28px' 
        }}>
          
          {/* LEFT COLUMN - Addresses */}
          <div style={{ flex: 2 }}>
            {/* Billing Address */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                fontSize: '11px', 
                fontWeight: 700, 
                letterSpacing: '1px', 
                color: '#9ca3af', 
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>Billing Address</h3>
              <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px', color: '#111827' }}>{order.user_name}</p>
              <p style={{ fontSize: '12px', color: '#4b5563', margin: '4px 0' }}>{fullAddressText || formatAddress(order.user_address)}</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>{order.user_phone}</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>{userEmail}</p>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 style={{ 
                fontSize: '11px', 
                fontWeight: 700, 
                letterSpacing: '1px', 
                color: '#9ca3af', 
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>Shipping Address</h3>
              <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px', color: '#111827' }}>{order.user_name}</p>
              <p style={{ fontSize: '12px', color: '#4b5563', margin: '4px 0' }}>{fullAddressText || formatAddress(order.user_address)}</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>{order.user_phone}</p>
            </div>
          </div>

          {/* RIGHT COLUMN - QR Code + Barcode */}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '12px',
            background: '#f9fafb',
            padding: '16px 12px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <canvas ref={qrCanvasRef} width={90} height={90} style={{ borderRadius: '8px' }} />
            <svg ref={barcodeRef} style={{ width: '100%', maxWidth: '200px', height: 'auto' }} />
            <p style={{ fontSize: '9px', color: '#9ca3af', margin: '4px 0 0 0' }}>Scan to Track Order</p>
          </div>
        </div>

        {/* ========== PRODUCTS TABLE (No Headers) ========== */}
        <div style={{ marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {order.products?.map((product: any, idx: number) => {
                const unitPrice = product.price ? parseFloat(product.price) : (parseFloat(product.subtotal) / parseFloat(product.quantity?.toString() || '1'));
                return (
                  <tr key={product.id} style={{ borderBottom: idx === (order.products?.length || 0) - 1 ? 'none' : '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 0', textAlign: 'left', fontWeight: 500, fontSize: '13px', color: '#111827' }}>
                      {product.product_name}
                    </td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontSize: '13px', color: '#6b7280', width: '70px' }}>
                      x{product.quantity}
                    </td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#4b5563', width: '100px' }}>
                      ৳{unitPrice.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#111827', width: '110px' }}>
                      ৳{parseFloat(product.subtotal).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ========== DIVIDER ========== */}
        <div style={{ height: '1px', background: 'linear-gradient(to right, #e5e7eb, #d1d5db, #e5e7eb)', margin: '16px 0' }}></div>

        {/* ========== TOTALS SECTION ========== */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <div style={{ width: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Subtotal</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>৳{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Delivery Fee</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>৳{parseFloat(order.delivery_charge).toFixed(2)}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0 8px', 
              borderTop: '2px solid #e5e7eb',
              marginTop: '4px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>Total Amount</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#f5b800' }}>৳{parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ========== PAYMENT METHOD SECTION ========== */}
        <div style={{ 
          background: '#fefce8', 
          border: '1px solid #fef08a', 
          borderRadius: '10px', 
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CreditCard size={18} color="#ca8a04" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#854d0e' }}>{orderTransaction?.payment_method || (order as any).payment?.payment_method || '—'}</div>
              <div style={{ fontSize: '11px', color: '#a16207' }}>TXN: {orderTransaction?.Transaction_ID || (order as any).payment?.transaction_number || '—'}</div>
            </div>
          </div>
          <Button 
            onClick={() => window.print()} 
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            <Printer size={14} /> PRINT RECEIPT
          </Button>
        </div>

        {/* ========== FOOTER ========== */}
        <div style={{ 
          borderTop: '1px solid #e5e7eb', 
          paddingTop: '16px', 
          textAlign: 'center',
          fontSize: '10px',
          color: '#9ca3af'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>Thank you for shopping with Golden Life!</p>
          <p style={{ margin: 0, fontStyle: 'italic' }}>Printed on: {printDateTime}</p>
        </div>
      </div>
    </>
  );
};

export default function OrderDetails() {
  const { order_no } = useParams<{ order_no: string }>();
  const navigate = useNavigate();
  const { fetchOrderDetails, updateOrderStatus, isLoading } = useOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [fullAddressText, setFullAddressText] = useState<string | null>(null);
  const [orderTransaction, setOrderTransaction] = useState<any | null>(null);

  // Define OrderStatus array with proper type assertion
  const progressSteps: OrderStatus[] = [
    "Order Placed", 
    "Processing", 
    "Packaging", 
    "Sent To Courier" as OrderStatus,
    "Ready To Courier" as OrderStatus,
    "On The Way" as OrderStatus,
    "Delivered", 
    "Returned" as OrderStatus
  ];

  useEffect(() => {
    if (order_no) {
      loadOrderDetails(order_no);
    }
  }, [order_no]);

  const loadOrderDetails = async (no: string) => {
    try {
      const data = await fetchOrderDetails(no);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order details:', error);
    }
  };

  // Address Fetch Logic
  useEffect(() => {
    if (order?.user_address && !isNaN(Number(order.user_address))) {
      const fetchAddress = async () => {
        try {
          const session = sessionStorage.getItem('vendor_session');
          let token = '';
          if (session) {
            token = JSON.parse(session).token;
          }
          const response = await fetch('https://api.goldenlife.my/api/getAll-OderAddress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: order.user_id })
          });
          const data = await response.json();
          if (data.status === 'success' && data.addresses) {
            const addr = data.addresses.find((a: any) => a.id.toString() === order.user_address?.toString());
            if (addr) {
              setFullAddressText(addr.address);
            } else {
              setFullAddressText('Address not found');
            }
          }
        } catch (error) {
          console.error('Failed to fetch addresses:', error);
          setFullAddressText('Address not available');
        }
      };
      fetchAddress();
    } else if (order?.user_address) {
      setFullAddressText(order.user_address);
    } else {
      setFullAddressText('Not provided');
    }
  }, [order?.user_address, order?.user_id]);

  // Transaction Fetch Logic
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const session = sessionStorage.getItem('vendor_session');
        let token = '';
        if (session) {
          token = JSON.parse(session).token;
        }
        const response = await fetch('https://api.goldenlife.my/api/vendor/transactions/history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const data = await response.json();
        if (data.status === true && data.transactions) {
          if (order) {
            const matchingTxn = data.transactions.find((txn: any) =>
              txn.invoice_number?.includes(order.order_no) ||
              txn.Transaction_ID?.includes(order.order_no) ||
              txn.Transaction_ID?.includes(order.id.toString()) ||
              txn.id?.toString() === order.id.toString()
            );
            if (matchingTxn) setOrderTransaction(matchingTxn);
          }
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };
    fetchTransactions();
  }, [order_no, order]);

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    const success = await updateOrderStatus(order.id, newStatus);
    if (success) {
      await loadOrderDetails(order.order_no);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getCurrentStepIndex = () => {
    if (!order) return -1;
    const index = progressSteps.indexOf(order.status as OrderStatus);
    return index === -1 ? 0 : index;
  };

  const currentStepIndex = getCurrentStepIndex();

  if (isLoading && !order) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Order not found</p>
          <Button onClick={() => navigate('/vendor/dashboard/orders')} className="mt-4">
            Back to Orders
          </Button>
        </CardContent>
      </Card>
    );
  }

  const subtotal = parseFloat(order.total) - parseFloat(order.delivery_charge);

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Print Invoice Component */}
      <PrintInvoice order={order} formatDate={formatDate} fullAddressText={fullAddressText} orderTransaction={orderTransaction} />

      {/* Screen Only Content */}
      <div className="screen-only">
        <Button onClick={() => navigate('/vendor/dashboard/orders')} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Button>
      </div>

      <div className="screen-only flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_no}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-gray-500 mt-1">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => window.print()} variant="outline" className="gap-2">
            <Printer className="w-4 h-4" /> Print
          </Button>
          <Button onClick={() => setIsStatusModalOpen(true)} className="bg-primary-light hover:bg-primary-light/90 text-white">
            Update Status
          </Button>
        </div>
      </div>

      {/* Order Progress Timeline */}
      <div className="screen-only bg-white rounded-xl border p-6 overflow-x-auto custom-scrollbar">
        <h3 className="font-semibold text-lg mb-6 text-gray-900 uppercase tracking-tight">ORDER PROGRESS</h3>
        <div className="flex items-center min-w-[1100px] md:min-w-[1200px] gap-2">
          {progressSteps.map((step, index) => {
            const isCompleted = index < currentStepIndex || order.status === step;
            const isActive = index === currentStepIndex;
            return (
              <div key={step} className="flex-1 flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 flex-shrink-0 ${isActive
                    ? 'bg-primary-light text-white shadow-lg scale-110'
                    : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                    }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <span className="font-semibold">{index + 1}</span>}
                </div>
                <span className={`ml-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-primary-light font-bold' : 'text-gray-500'}`}>
                  {step}
                </span>
                {index < progressSteps.length - 1 && (
                  <div className={`flex-1 h-px mx-2 md:mx-4 transition-all duration-300 min-w-[20px] ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="screen-only">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Package className="w-5 h-5" /> Order Items ({order.products?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.products && order.products.length > 0 ? (
                <div className="space-y-4">
                  {order.products.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border">
                        <img
                          src={product.product_image.startsWith('http') ? product.product_image : `https://api.goldenlife.my/uploads/ecommarce/product_image/${product.product_image}`}
                          alt={product.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/80?text=No+Image'; }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.product_name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="font-medium">
                            Price: ৳{product.price ? parseFloat(product.price).toFixed(2) : (parseFloat(product.subtotal) / parseFloat(product.quantity?.toString() || '1')).toFixed(2)}
                          </span>
                          <span className="flex items-center gap-1">
                            Quantity: <Badge variant="secondary" className="font-semibold">{product.quantity}</Badge>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="text-xl font-bold text-primary-light">৳{parseFloat(product.subtotal).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No products in this order</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="screen-only">
            <CardHeader><CardTitle className="text-lg font-bold">BUYER PROFILE</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600"><User className="w-4 h-4" /><span className="text-sm font-medium">Customer Name</span></div>
                <p className="text-base font-semibold text-gray-900 pl-6">{order.user_name}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" /><span className="text-sm font-medium">Contact Number</span></div>
                <p className="text-base font-semibold text-gray-900 pl-6">{order.user_phone}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-start gap-2 text-gray-600"><MapPin className="w-4 h-4 mt-1" /><span className="text-sm font-medium">Delivery Address</span></div>
                <p className="text-base text-gray-900 pl-6">{fullAddressText || "Loading address..."}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="screen-only">
            <CardHeader><CardTitle className="text-lg font-bold">Order Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-medium">৳{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span className="font-medium">৳{parseFloat(order.delivery_charge).toFixed(2)}</span></div>
                <div className="border-t pt-3 space-y-3">
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary-light">৳{parseFloat(order.total).toFixed(2)}</span></div>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-3">
                      <CreditCard size={16} className="text-blue-600" />
                      <div>
                        <div className="font-semibold text-blue-900">{orderTransaction?.payment_method || (order as any).payment?.payment_method || '—'}</div>
                        <div className="text-xs text-blue-600/80">TXN: {orderTransaction?.Transaction_ID || (order as any).payment?.transaction_number || '—'}</div>
                      </div>
                    </div>
                    <Button onClick={() => window.print()} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                      <Printer size={14} /> PRINT RECEIPT
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {orderTransaction && (
            <Card className="screen-only border-green-200">
              <CardHeader className="bg-green-50 rounded-t-xl border-b border-green-100 pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-green-800">
                  <Receipt className="w-5 h-5" /> Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Invoice Ref</span><span className="font-medium text-gray-900">{orderTransaction.invoice_number}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-gray-900">৳{parseFloat(orderTransaction.amount).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Transaction ID</span><span className="font-medium text-gray-900">{orderTransaction.Transaction_ID}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-500">Status</span><Badge variant={orderTransaction.status === 'approved' ? 'default' : 'secondary'} className={orderTransaction.status === 'approved' ? 'bg-green-100 text-green-800' : ''}>{(orderTransaction.status || 'Pending').toUpperCase()}</Badge></div>
                  <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-medium text-gray-900 capitalize">{orderTransaction.payment_method}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Acct No.</span><span className="font-medium text-gray-900">{orderTransaction.number}</span></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={order.status}
        onUpdate={handleUpdateStatus} 
        orderNo={order.order_no}
      />
    </div>
  );
}