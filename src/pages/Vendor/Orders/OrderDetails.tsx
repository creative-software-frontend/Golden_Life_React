import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, User, Phone, MapPin, Printer, Check, CreditCard, Receipt } from 'lucide-react';
import { useOrders } from './hooks/useOrders';
import { Order, OrderStatus } from './types/order.types';
import { OrderStatusBadge } from './components/OrderStatusBadge';
import { StatusUpdateModal } from './components/StatusUpdateModal';
import { log } from 'node:console';

// Helper function to format address
const formatAddress = (address: string | undefined) => {
  if (!address) return 'Not provided';
  if (!isNaN(Number(address))) {
    return 'Address not available';
  }
  return address;
};

/* ─── Print-only Invoice ─────────────────────────────────────── */
const PrintInvoice = ({ order, formatDate, fullAddressText, orderTransaction }: { order: Order; formatDate: (d: string) => string; fullAddressText?: string | null; orderTransaction?: any }) => {
  const subtotal = parseFloat(order.total) - parseFloat(order.delivery_charge);
  const baseURL = 'https://api.goldenlife.my';

  return (
    <div className="print-only" style={{
      display: 'none',
      fontFamily: 'Arial, sans-serif',
      color: '#111',
      background: '#fff',
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      padding: '12mm',
      margin: '0',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '3px solid #f5d800', paddingBottom: '16px', marginBottom: '24px' }}>
        <div>
          <img src="/image/logo/logo.jpg" alt="Golden Life" style={{ height: '48px', objectFit: 'contain' }} />
        </div>

        <div style={{ textAlign: 'right' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 4px', color: '#111' }}>Invoice</h1>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#333', margin: 0 }}>#{order.order_no}</h2>
          <p style={{ fontSize: '12px', color: '#777', marginTop: '6px', marginBottom: 0 }}>
            Date: {formatDate(order.created_at)} &nbsp;|&nbsp; Status: {order.status}
          </p>
        </div>
      </div>

      {/* ─── Billing Address Only ─── */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '14px', marginBottom: '24px' }}>
        <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', color: '#111', textTransform: 'uppercase', marginBottom: '10px', marginTop: 0 }}>Billing Address</p>
        <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px', color: '#111' }}>{order.user_name}</p>
        <p style={{ fontSize: '13px', color: '#444', margin: '0 0 3px' }}>{fullAddressText || formatAddress(order.user_address)}</p>
        <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>{order.user_phone}</p>
      </div>

      {/* ─── Product Table ─── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee' }}>
            <th style={{ padding: '10px 14px 10px 0', textAlign: 'left', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Description</th>
            <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '80px' }}>Qty</th>
            <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '110px' }}>Unit Price</th>
            <th style={{ padding: '10px 0 10px 14px', textAlign: 'right', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '110px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.products?.map((product: any) => (
            <tr key={product.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '12px 14px 12px 0', verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={product.product_image?.startsWith('http') ? product.product_image : `${baseURL}/uploads/ecommarce/product_image/${product.product_image}`}
                    alt={product.product_name}
                    style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee', flexShrink: 0 }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/40?text=?'; }}
                  />
                  <span style={{ fontWeight: 700, color: '#111' }}>{product.product_name}</span>
                </div>
              </td>
              <td style={{ padding: '12px 14px', textAlign: 'center', color: '#555' }}>{product.quantity}</td>
              <td style={{ padding: '12px 14px', textAlign: 'right', color: '#555' }}>৳{product.price ? parseFloat(product.price).toFixed(2) : (parseFloat(product.subtotal) / parseFloat(product.quantity?.toString() || '1')).toFixed(2)}</td>
              <td style={{ padding: '12px 0 12px 14px', textAlign: 'right', fontWeight: 800, color: '#111' }}>৳{parseFloat(product.subtotal).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ─── Totals ─── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <div style={{ width: '280px', fontSize: '13px' }}>
          {[
            { label: 'Subtotal', value: `৳${subtotal.toFixed(2)}` },
            { label: 'Delivery Fee', value: `৳${parseFloat(order.delivery_charge).toFixed(2)}` },
            { label: 'Total Amount Paid', value: `৳${parseFloat(order.total).toFixed(2)}`, bold: true },
            { label: 'Total Due', value: '৳0', bold: true },
          ].map(({ label, value, bold }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ color: bold ? '#111' : '#555', fontWeight: bold ? 800 : 500 }}>{label}</span>
              <span style={{ fontWeight: bold ? 800 : 600, color: '#111' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Payment Method (Left Aligned) ─── */}
      <div style={{ padding: '12px', background: '#f0f7ff', border: '1px solid #dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <CreditCard size={16} color="#2563eb" />
        <div>
          <div style={{ fontWeight: 600, color: '#1e3a8a', fontSize: '14px' }}>{orderTransaction?.payment_method || order.payment?.payment_method || '—'}</div>
          <div style={{ fontSize: '12px', color: '#3b82f6' }}>
            TXN: {orderTransaction?.Transaction_ID || order.payment?.transaction_number || '—'}
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '11px', color: '#555', lineHeight: 1.6, marginTop: '24px' }}>
        <p style={{ margin: '0 0 15px 0' }}>
          Please note that depending on the availability of your products, your order will be shipped within 5 to 7 business days. Please go through the return instructions as well as warranty period of the products upon receiving. For any additional queries please call 654-123-123 or send us an email at support@goldenlife.my
        </p>
        <p style={{ fontWeight: 800, color: '#111', fontSize: '12px', margin: 0 }}>
          Thank you for shopping!
        </p>
      </div>
    </div>
  );
};

export default function OrderDetails() {
  const { order_no } = useParams<{ order_no: string }>();
  const navigate = useNavigate();
  const { fetchOrderDetails, updateOrderStatus, isLoading } = useOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [fullAddressText, setFullAddressText] = useState<string | null>(null);

  // New state for transactions
  const [transactions, setTransactions] = useState<any[]>([]);
  const [orderTransaction, setOrderTransaction] = useState<any | null>(null);

  // Added 8 full statuses
  const progressSteps: OrderStatus[] = [
    "Order Placed", "Processing", "Packaging", "Sent To Courier",
    "Ready To Courier", "On The Way", "Delivered", "Returned"
  ];

  // Fetch Order details
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
      console.error('❌ Failed to load order details:', error);
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

          const payload: any = {};
          if (order?.user_id) {
            payload.id = order.user_id;
          }

          const response = await fetch('https://api.goldenlife.my/api/getAll-OderAddress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
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
  }, [order?.user_address]);

  // NEW: Transaction Fetch Logic
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
          console.log(data.transactions);
          setTransactions(data.transactions);

          // Fetch Transactions
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
  }, [order_no]);

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
      <style>{`
        @media print {
          @page { margin: 12mm; size: auto; }
          .screen-only, header, nav, footer, .fixed, .backdrop-blur { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; }
        }
      `}</style>

      <PrintInvoice order={order} formatDate={formatDate} fullAddressText={fullAddressText} orderTransaction={orderTransaction} />

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
                <span
                  className={`ml-3 text-xs md:text-sm font-medium whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-primary-light font-bold' : 'text-gray-500'
                    }`}
                >
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
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 flex items-center gap-3 text-sm">
                    <CreditCard size={16} className="text-blue-600" />
                    <div>
                      <div className="font-semibold text-blue-900">{orderTransaction?.payment_method || order.payment?.payment_method || '—'}</div>
                      <div className="text-xs text-blue-600/80">TXN: {orderTransaction?.Transaction_ID || order.payment?.transaction_number || '—'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Transaction History Card */}
          {orderTransaction && (
            <Card className="screen-only border-green-200">
              <CardHeader className="bg-green-50 rounded-t-xl border-b border-green-100 pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-green-800">
                  <Receipt className="w-5 h-5" /> Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Invoice Ref</span>
                    <span className="font-medium text-gray-900">{orderTransaction.invoice_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-bold text-gray-900">৳{parseFloat(orderTransaction.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="font-medium text-gray-900">{orderTransaction.Transaction_ID}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Status</span>
                    <Badge variant={orderTransaction.status === 'approved' ? 'default' : 'secondary'} className={orderTransaction.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                      {(orderTransaction.status || 'Pending').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Method</span>
                    <span className="font-medium text-gray-900 capitalize">{orderTransaction.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Acct No.</span>
                    <span className="font-medium text-gray-900">{orderTransaction.number}</span>
                  </div>
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