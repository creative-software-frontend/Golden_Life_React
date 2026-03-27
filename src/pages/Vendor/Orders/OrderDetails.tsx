import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, User, Phone, MapPin, Calendar, DollarSign, Truck } from 'lucide-react';
import { useOrders } from './hooks/useOrders';
import { Order, OrderStatus } from './types/order.types';
import { OrderStatusBadge } from './components/OrderStatusBadge';
import { StatusUpdateModal } from './components/StatusUpdateModal';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate('/vendor/dashboard/orders')}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-sm text-gray-500">Order #{order.order_no}</p>
        </div>
        <Button
          onClick={() => setIsStatusModalOpen(true)}
          className="bg-primary-light hover:bg-primary-light/90"
        >
          Update Status
        </Button>
      </div>

      {/* Order Information */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Order Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-primary-light">#{order.order_no}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Order Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base font-semibold">{formatDate(order.created_at)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-green-600">৳{parseFloat(order.total).toFixed(2)}</p>
            <p className="text-xs text-gray-500">Delivery: ৳{parseFloat(order.delivery_charge).toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusBadge status={order.status} />
          </CardContent>
        </Card>
      </div>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Customer Name</p>
              <p className="text-base font-semibold text-gray-900">{order.user_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Phone Number</p>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-base font-semibold text-gray-900">{order.user_phone}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Delivery Address</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <p className="text-base text-gray-900">{order.user_address}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Items ({order.products?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.products && order.products.length > 0 ? (
            <div className="space-y-4">
              {order.products.map((product: any) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={product.product_image.startsWith('http') 
                        ? product.product_image 
                        : `https://api.goldenlife.my/uploads/ecommarce/product_image/${product.product_image}`
                      }
                      alt={product.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.product_name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Price: ৳{parseFloat(product.price).toFixed(2)}</span>
                      <span className="flex items-center gap-1">
                        Quantity: <Badge variant="secondary" className="font-semibold">{product.quantity}</Badge>
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
            <p className="text-center text-gray-500 py-8">No products in this order</p>
          )}
        </CardContent>
      </Card>

      {/* Status History (if available) */}
      {order.status_history && order.status_history.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Status History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.status_history.map((history: any) => (
                <div key={history.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
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
        <Card>
          <CardContent className="py-6">
            <p className="text-center text-gray-500 text-sm">No status history available</p>
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
