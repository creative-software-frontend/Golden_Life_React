import React from 'react';
import QRBarcodeGenerator from '@/components/QRBarcode/QRBarcodeGenerator';
import './printStyles.css';

interface Product {
  product_name: string;
  quantity: string | number;
  subtotal: string | number;
  price?: string | number;
}

interface OrderData {
  id: number | string;
  order_no: string;
  invoice_no?: string;
  created_at: string;
  status: string;
  total: string | number;
  delivery_charge?: string | number;
  products?: Product[];
  payment?: {
    payment_method: string;
    transaction_number?: string;
  } | null;
  customer?: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  shipping_address?: {
    name: string;
    phone: string;
    address?: string;
  };
}

interface PrintReceiptProps {
  order: OrderData;
  companyName?: string;
  companyTagline?: string;
  companyAddress?: string;
  onClose?: () => void;
}

/**
 * Print Receipt Component
 * Generates a professional invoice/receipt for printing
 */
const PrintReceipt: React.FC<PrintReceiptProps> = ({
  order,
  companyName = 'GOLDEN LIFE',
  companyTagline = 'No #1 Digital Business & Reseller Platform in Bangladesh',
  companyAddress = 'Bangladesh',
  onClose,
}) => {
  const invoiceNumber = order.invoice_no || order.order_no;
  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const printDateTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const subtotal = order.products?.reduce((sum, item) => {
    return sum + Number(item.subtotal || 0);
  }, 0) || 0;

  const deliveryCharge = Number(order.delivery_charge || 0);
  const total = Number(order.total || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-receipt-container">
      {/* Print Controls - Hidden when printing */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={handlePrint}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Receipt
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-lg transition-all"
          >
            Close
          </button>
        )}
      </div>

      {/* Receipt Content */}
      <div className="receipt-paper">
        {/* Header */}
        <div className="receipt-header">
          <div className="company-info">
            <h1 className="company-name">{companyName}</h1>
            <p className="company-tagline">{companyTagline}</p>
            <p className="company-address">{companyAddress}</p>
          </div>
          <div className="qr-barcode-section">
            <QRBarcodeGenerator
              orderId={invoiceNumber}
              showQR={true}
              showBarcode={true}
              qrSize={100}
              barcodeWidth={200}
              barcodeHeight={60}
            />
          </div>
        </div>

        {/* Invoice Info */}
        <div className="invoice-info">
          <div className="invoice-number">
            <span className="label">INVOICE:</span>
            <span className="value">#{invoiceNumber}</span>
          </div>
          <div className="invoice-details">
            <span>Date: {orderDate}</span>
            <span className="status-badge status-{order.status.toLowerCase().replace(/\s+/g, '-')}">
              {order.status}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="divider"></div>

        {/* Addresses */}
        <div className="addresses-section">
          <div className="address-box">
            <h3 className="address-title">BILLING ADDRESS</h3>
            <div className="address-content">
              <p className="name">{order.customer?.name || 'N/A'}</p>
              {order.customer?.address && <p className="address">{order.customer.address}</p>}
              {order.customer?.email && <p className="email">{order.customer.email}</p>}
              {order.customer?.phone && <p className="phone">{order.customer.phone}</p>}
            </div>
          </div>
          <div className="address-box">
            <h3 className="address-title">SHIPPING ADDRESS</h3>
            <div className="address-content">
              <p className="name">{order.shipping_address?.name || order.customer?.name || 'N/A'}</p>
              {order.shipping_address?.address && <p className="address">{order.shipping_address.address}</p>}
              {order.shipping_address?.phone && <p className="phone">{order.shipping_address.phone}</p>}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider"></div>

        {/* Products Table */}
        <div className="products-section">
          <h3 className="section-title">PRODUCTS</h3>
          <table className="products-table">
            <thead>
              <tr>
                <th className="col-sl">SL</th>
                <th className="col-product">PRODUCT NAME</th>
                <th className="col-qty">QTY</th>
                <th className="col-price">PRICE</th>
                <th className="col-total">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {order.products?.map((item, index) => {
                const unitPrice = Number(item.subtotal) / Number(item.quantity);
                return (
                  <tr key={index}>
                    <td className="col-sl">{index + 1}</td>
                    <td className="col-product">{item.product_name}</td>
                    <td className="col-qty">{item.quantity}</td>
                    <td className="col-price">৳{unitPrice.toFixed(2)}</td>
                    <td className="col-total">৳{Number(item.subtotal).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Divider */}
        <div className="divider"></div>

        {/* Payment Summary */}
        <div className="payment-summary">
          <div className="summary-row">
            <span className="label">SUBTOTAL:</span>
            <span className="value">৳{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="label">SHIPPING:</span>
            <span className="value">৳{deliveryCharge.toFixed(2)}</span>
          </div>
          <div className="summary-row total-row">
            <span className="label">TOTAL:</span>
            <span className="value total-value">৳{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="divider"></div>

        {/* Payment Method */}
        <div className="payment-method-section">
          <div className="payment-row">
            <span className="label">PAYMENT METHOD:</span>
            <span className="value">{order.payment?.payment_method || 'N/A'}</span>
          </div>
          {order.payment?.transaction_number && (
            <div className="payment-row">
              <span className="label">TRANSACTION ID:</span>
              <span className="value">{order.payment.transaction_number}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="receipt-footer">
          <p className="thank-you">Thank you for shopping with {companyName}!</p>
          <div className="divider"></div>
          <p className="print-date">Printed on: {printDateTime}</p>
        </div>
      </div>
    </div>
  );
};

export default PrintReceipt;
