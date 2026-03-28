import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, User, Phone, MapPin, Printer, Check } from 'lucide-react';
import { useOrders } from './hooks/useOrders';
import { Order, OrderStatus } from './types/order.types';
import { OrderStatusBadge } from './components/OrderStatusBadge';
import { StatusUpdateModal } from './components/StatusUpdateModal';

/* ─── Print-only Invoice ─────────────────────────────────────── */
const PrintInvoice = ({ order, formatDate }: { order: Order; formatDate: (d: string) => string }) => {
  const subtotal = parseFloat(order.total) - parseFloat(order.delivery_charge);
  const baseURL = 'https://api.goldenlife.my';

  return (
    <div className="print-only" style={{ display: 'none', fontFamily: 'Arial, sans-serif', color: '#111', background: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #f5d800', paddingBottom: '16px', marginBottom: '24px' }}>
        <div>
          <img src="/image/logo/logo.jpg" alt="Golden Life" style={{ height: '48px', objectFit: 'contain', marginBottom: '6px' }} />
          <p style={{ fontSize: '11px', color: '#555', margin: 0 }}>No #1 Digital Business &amp; Reseller Platform in Bangladesh</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 800, fontSize: '15px', margin: '0 0 4px' }}>Creative Software</p>
          <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>+1 (555) 123-4567</p>
          <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>support@goldenlife.my</p>
        </div>
      </div>

      {/* Invoice Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 4px', color: '#111' }}>Invoice</h1>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#333', margin: 0 }}>#{order.order_no}</h2>
        <p style={{ fontSize: '12px', color: '#777', marginTop: '6px' }}>
          Date: {formatDate(order.created_at)} &nbsp;|&nbsp; Status: {order.status}
        </p>
      </div>

      {/* Billing + Shipping */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', borderTop: '1px solid #eee', paddingTop: '20px', marginBottom: '28px' }}>
        <div>
          <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: '10px' }}>Billing Address</p>
          <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px' }}>{order.user_name}</p>
          <p style={{ fontSize: '13px', color: '#444', margin: '0 0 3px' }}>{order.user_address}</p>
          <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>{order.user_phone}</p>
        </div>
        <div>
          <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', color: '#888', textTransform: 'uppercase', marginBottom: '10px' }}>Shipping Address</p>
          <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px' }}>{order.user_name}</p>
          <p style={{ fontSize: '13px', color: '#444', margin: '0 0 3px' }}>{order.user_address}</p>
          <p style={{ fontSize: '13px', color: '#444', margin: 0 }}>{order.user_phone}</p>
        </div>
      </div>

      {/* Product Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#f5d800' }}>
            <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Description</th>
            <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '80px' }}>Qty</th>
            <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '110px' }}>Unit Price</th>
            <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '110px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.products?.map((product: any, idx: number) => (
            <tr key={product.id} style={{ borderBottom: '1px solid #f0f0f0', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
              <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={product.product_image?.startsWith('http') ? product.product_image : `${baseURL}/uploads/ecommarce/product_image/${product.product_image}`}
                    alt={product.product_name}
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee', flexShrink: 0 }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/40?text=?'; }}
                  />
                  <span style={{ fontWeight: 600, color: '#222' }}>{product.product_name}</span>
                </div>
              </td>
              <td style={{ padding: '12px 14px', textAlign: 'center', color: '#444' }}>{product.quantity}</td>
              <td style={{ padding: '12px 14px', textAlign: 'right', color: '#444' }}>৳{parseFloat(product.price).toFixed(2)}</td>
              <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700 }}>৳{parseFloat(product.subtotal).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '36px' }}>
        <div style={{ width: '280px', fontSize: '13px' }}>
          {[
            { label: 'Subtotal', value: `৳${subtotal.toFixed(2)}` },
            { label: 'Delivery Fee', value: `৳${parseFloat(order.delivery_charge).toFixed(2)}` },
            { label: 'Total Amount Paid', value: `৳${parseFloat(order.total).toFixed(2)}`, bold: true },
            { label: 'Total Due', value: '৳0', bold: true },
          ].map(({ label, value, bold }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ color: bold ? '#111' : '#555', fontWeight: bold ? 800 : 500 }}>{label}</span>
              <span style={{ fontWeight: bold ? 800 : 600 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '11px', color: '#777', lineHeight: 1.7 }}>
        <p style={{ margin: '0 0 4px' }}>Please note that depending on the availability of your products, your order will be shipped within 5 to 7 business days.</p>
        <p style={{ margin: '0 0 4px' }}>Please go through the return instructions as well as warranty period of the products upon receiving.</p>
        <p style={{ margin: '0 0 10px' }}>For any additional queries please call 654-123-123 or send us an email at support@goldenlife.my</p>
        <p style={{ fontWeight: 700, color: '#333', margin: 0 }}>Thank you for shopping!</p>
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

  useEffect(() => {
    if (order_no) {
      loadOrderDetails(order_no);
    }
  }, [order_no]);

  const loadOrderDetails = async (no: string) => {
    try {
      console.log('🔵 [OrderDetails] Loading order:', no);
      const data = await fetchOrderDetails(no);
      console.log('🟢 [OrderDetails] Order loaded:', data);
      setOrder(data);
    } catch (error) {
      console.error('❌ [OrderDetails] Failed to load order details:', error);
    }
  };

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    
    // Use order.id (primary key) for status update, not order_no
    console.log('🔵 [OrderDetails] Updating status:', { orderId: order.id, orderNo: order.order_no, newStatus });
    const success = await updateOrderStatus(order.id, newStatus);
    console.log('🟢 [OrderDetails] Update result:', success);
    if (success) {
      await loadOrderDetails(order.order_no);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Order progress steps
  const progressSteps: OrderStatus[] = ['Order Placed', 'Processing', 'Packaging'];
  
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Print styles */}
      <style>{`
        @media print {
          @page { margin: 12mm; size: auto; }
          .screen-only, header, nav, footer, .fixed, .backdrop-blur { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; }
        }
      `}</style>

      {/* Print invoice — hidden on screen */}
      <PrintInvoice order={order} formatDate={formatDate} />

      {/* Back Button */}
      <div className="screen-only">
        <Button
          onClick={() => navigate('/vendor/dashboard/orders')}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Button>
      </div>

      {/* Order Header */}
      <div className="screen-only flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_no}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-gray-500 mt-1">
            {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button
            onClick={() => setIsStatusModalOpen(true)}
            className="bg-primary-light hover:bg-primary-light/90 text-white"
          >
            Update Status
          </Button>
        </div>
      </div>

      {/* Order Progress Timeline */}
      <div className="screen-only bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-lg mb-6 text-gray-900">ORDER PROGRESS</h3>
        <div className="flex items-center gap-2 md:gap-4">
          {progressSteps.map((step, index) => {
            const isCompleted = index < currentStepIndex || order.status === step;
            const isActive = index === currentStepIndex;
            
            return (
              <div key={step} className="flex-1 flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-light text-white shadow-lg scale-110'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`ml-2 md:ml-3 text-sm font-medium hidden sm:block ${
                    isActive ? 'text-primary-light font-semibold' : 'text-gray-600'
                  }`}
                >
                  {step}
                </span>
                {index < progressSteps.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 md:mx-4 transition-all duration-300 ${
                      index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Order Items */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Items Table */}
          <Card className="screen-only">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items ({order.products?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.products && order.products.length > 0 ? (
                <div className="space-y-4">
                  {order.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border">
                        <img
                          src={
                            product.product_image.startsWith('http')
                              ? product.product_image
                              : `https://api.goldenlife.my/uploads/ecommarce/product_image/${product.product_image}`
                          }
                          alt={product.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://via.placeholder.com/80?text=No+Image';
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {product.product_name}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span className="font-medium">
                            Price: ৳{parseFloat(product.price).toFixed(2)}
                          </span>
                          <span className="flex items-center gap-1">
                            Quantity:{' '}
                            <Badge variant="secondary" className="font-semibold">
                              {product.quantity}
                            </Badge>
                          </span>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="text-xl font-bold text-primary-light">
                          ৳{parseFloat(product.subtotal).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No products in this order
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer & Summary */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="screen-only">
            <CardHeader>
              <CardTitle className="text-lg font-bold">BUYER PROFILE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Customer Name</span>
                </div>
                <p className="text-base font-semibold text-gray-900 pl-6">
                  {order.user_name}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">Contact Number</span>
                </div>
                <p className="text-base font-semibold text-gray-900 pl-6">
                  {order.user_phone}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 mt-1" />
                  <span className="text-sm font-medium">Delivery Address</span>
                </div>
                <p className="text-base text-gray-900 pl-6">
                  {order.user_address}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="screen-only">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium">৳{parseFloat(order.delivery_charge).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 space-y-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary-light">৳{parseFloat(order.total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 bg-gray-50 p-2 rounded">
                    <span>Payment Method</span>
                    <span className="font-medium">Wallet</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status History */}
      {order.status_history && order.status_history.length > 0 ? (
        <Card className="screen-only">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Status History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.status_history.map((history) => (
                <div
                  key={history.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <OrderStatusBadge status={history.status as OrderStatus} />
                  <span className="text-sm text-gray-600">
                    {formatDate(history.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="screen-only">
          <CardContent className="py-6">
            <p className="text-center text-gray-500 text-sm">
              No status history available
            </p>
          </CardContent>
        </Card>
      )}

      {/* Status Update Modal */}
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
