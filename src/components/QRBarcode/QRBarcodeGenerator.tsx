import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

interface QRBarcodeGeneratorProps {
  orderId: string;
  showQR?: boolean;
  showBarcode?: boolean;
  qrSize?: number;
  barcodeWidth?: number;
  barcodeHeight?: number;
  trackingUrl?: string;
}

const QRBarcodeGenerator: React.FC<QRBarcodeGeneratorProps> = ({
  orderId,
  showQR = true,
  showBarcode = true,
  qrSize = 100,
  barcodeWidth = 200,
  barcodeHeight = 60,
  trackingUrl,
}) => {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);

  const finalTrackingUrl = trackingUrl || `${window.location.origin}/order-tracking/${orderId}`;

  // Generate QR Code
  useEffect(() => {
    if (showQR && qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, finalTrackingUrl, {
        width: qrSize,
        margin: 1,
        color: { dark: '#1e293b', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      }, (error) => {
        if (error) console.error('QR Code generation error:', error);
      });
    }
  }, [finalTrackingUrl, qrSize, showQR]);

  // Generate Barcode
  useEffect(() => {
    if (showBarcode && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, orderId, {
          format: 'CODE128',
          width: 2,
          height: barcodeHeight,
          displayValue: true,
          fontSize: 12,
          font: 'monospace',
          textMargin: 4,
          margin: 10,
          background: '#ffffff',
          lineColor: '#1e293b',
        });
      } catch (error) {
        console.error('Barcode generation error:', error);
      }
    }
  }, [orderId, barcodeHeight, showBarcode]);

  if (!showQR && !showBarcode) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      {showQR && (
        <canvas 
          ref={qrCanvasRef} 
          width={qrSize} 
          height={qrSize} 
          style={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
      )}
      {showBarcode && (
        <svg ref={barcodeRef} style={{ width: barcodeWidth, height: barcodeHeight }} />
      )}
    </div>
  );
};

export default QRBarcodeGenerator;