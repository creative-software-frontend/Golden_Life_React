import { OrderForPrint } from '@/hooks/usePrintInvoice';
import { formatBDT, formatDate, formatAddress, getCurrentDateTime } from '@/utils/invoiceFormatter';

interface PrintInvoiceProps {
  order: OrderForPrint;
  fullAddressText?: string | null;
}

/**
 * Print Invoice Component
 * Clean, simple invoice design for printing
 * Hidden on screen, visible only when printing
 */
export default function PrintInvoice({ order, fullAddressText }: PrintInvoiceProps) {
  const subtotal = order.products?.reduce((sum, item) => {
    return sum + Number(item.subtotal || 0);
  }, 0) || 0;

  const deliveryCharge = Number(order.delivery_charge || 0);
  const total = Number(order.total || 0);
  const invoiceNumber = order.invoice_no || order.order_no;
  const orderDate = formatDate(order.created_at);
  const printDateTime = getCurrentDateTime();

  // Get user email from order
  const userEmail = (order as any).user_email || (order as any).email || order.user_email || '—';

  return (
    <>
      {/* Print-specific CSS */}
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

      {/* Invoice Content - Only visible when printing */}
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
          {/* Left: Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/image/logo/logo.jpg" 
              alt="Golden Life" 
              style={{ height: '55px', width: '55px', objectFit: 'contain', borderRadius: '10px' }} 
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 4px', color: '#111827' }}>
                GOLDEN LIFE
              </h1>
              <p style={{ fontSize: '10px', color: '#6b7280', margin: 0, lineHeight: 1.4 }}>
                No #1 Digital Business & Reseller Platform<br />in Bangladesh
              </p>
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

        {/* ========== TWO COLUMNS: Billing (Left) + Shipping (Right) ========== */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          gap: '40px', 
          marginBottom: '28px' 
        }}>
          
          {/* LEFT COLUMN - Billing Address */}
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              fontSize: '11px', 
              fontWeight: 700, 
              letterSpacing: '1px', 
              color: '#9ca3af', 
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>BILLING ADDRESS</h3>
            <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px', color: '#111827' }}>
              {order.user_name}
            </p>
            <p style={{ fontSize: '12px', color: '#4b5563', margin: '4px 0' }}>
              {fullAddressText || formatAddress(order.user_address)}
            </p>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>
              {order.user_phone}
            </p>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>
              {userEmail}
            </p>
          </div>

          {/* RIGHT COLUMN - Shipping Address */}
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              fontSize: '11px', 
              fontWeight: 700, 
              letterSpacing: '1px', 
              color: '#9ca3af', 
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>SHIPPING ADDRESS</h3>
            <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px', color: '#111827' }}>
              {order.user_name}
            </p>
            <p style={{ fontSize: '12px', color: '#4b5563', margin: '4px 0' }}>
              {fullAddressText || formatAddress(order.user_address)}
            </p>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>
              {order.user_phone}
            </p>
          </div>
        </div>

        {/* ========== PRODUCTS LIST (No Table Headers) ========== */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ 
            fontSize: '11px', 
            fontWeight: 700, 
            letterSpacing: '1px', 
            color: '#9ca3af', 
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>PRODUCTS</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {order.products?.map((product, idx) => {
              const unitPrice = product.price ? parseFloat(String(product.price)) : (parseFloat(String(product.subtotal)) / parseFloat(String(product.quantity || '1')));
              return (
                <div 
                  key={product.id || idx} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: idx === (order.products?.length || 0) - 1 ? 'none' : '1px solid #f0f0f0'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 500, fontSize: '13px', color: '#111827' }}>
                      {product.product_name}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#6b7280', minWidth: '50px' }}>
                    x{product.quantity}
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: 600, color: '#4b5563', minWidth: '90px' }}>
                    {formatBDT(unitPrice)}
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#111827', minWidth: '100px' }}>
                    {formatBDT(product.subtotal)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========== DIVIDER ========== */}
        <div style={{ height: '1px', background: 'linear-gradient(to right, #e5e7eb, #d1d5db, #e5e7eb)', margin: '16px 0' }}></div>

        {/* ========== TOTALS SECTION ========== */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <div style={{ width: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Subtotal</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{formatBDT(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Delivery</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{formatBDT(deliveryCharge)}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0 8px', 
              borderTop: '2px solid #e5e7eb',
              marginTop: '4px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>Total</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#f5b800' }}>{formatBDT(total)}</span>
            </div>
          </div>
        </div>

        {/* ========== PAYMENT METHOD SECTION ========== */}
        <div style={{ 
          background: '#fefce8', 
          border: '1px solid #fef08a', 
          borderRadius: '10px', 
          padding: '12px 16px',
          marginBottom: '24px'
        }}>
          <div style={{ marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>
              Payment Method:
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#a16207', marginLeft: '8px' }}>
              {order.payment?.payment_method || '—'}
            </span>
          </div>
          {order.payment?.transaction_number && (
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>
                Transaction ID:
              </span>
              <span style={{ fontSize: '12px', color: '#a16207', marginLeft: '8px', fontFamily: 'monospace' }}>
                {order.payment.transaction_number}
              </span>
            </div>
          )}
        </div>

        {/* ========== FOOTER ========== */}
        <div style={{ 
          borderTop: '1px solid #e5e7eb', 
          paddingTop: '16px', 
          textAlign: 'center',
          fontSize: '10px',
          color: '#9ca3af'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#6b7280' }}>
            Thank you for shopping with Golden Life!
          </p>
          <p style={{ margin: 0, fontStyle: 'italic' }}>
            Printed on: {printDateTime}
          </p>
        </div>
      </div>
    </>
  );
}
