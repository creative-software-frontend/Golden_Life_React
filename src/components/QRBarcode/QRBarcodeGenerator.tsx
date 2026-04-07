import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

interface QRBarcodeGeneratorProps {
  orderId: string;
  baseUrl?: string;
  showQR?: boolean;
  showBarcode?: boolean;
  qrSize?: number;
  barcodeWidth?: number;
  barcodeHeight?: number;
}

/**
 * QR Code & Barcode Generator Component
 * Generates both QR Code and Barcode for order tracking
 */
const QRBarcodeGenerator: React.FC<QRBarcodeGeneratorProps> = ({
  orderId,
  baseUrl = window.location.origin,
  showQR = true,
  showBarcode = true,
  qrSize = 100,
  barcodeWidth = 200,
  barcodeHeight = 60,
}) => {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);

  // Generate tracking URL
  const trackingUrl = `${baseUrl}/order-tracking/${orderId}`;

  // Generate QR Code
  useEffect(() => {
    if (showQR && qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, trackingUrl, {
        width: qrSize,
        margin: 1,
        color: {
          dark: '#1e293b', // slate-800
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M', // Medium error correction
      }, (error) => {
        if (error) {
          console.error('QR Code generation error:', error);
        }
      });
    }
  }, [orderId, trackingUrl, showQR, qrSize]);

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
          margin: 5,
          background: '#ffffff',
          lineColor: '#1e293b',
        });
      } catch (error) {
        console.error('Barcode generation error:', error);
      }
    }
  }, [orderId, showBarcode, barcodeHeight]);

  if (!showQR && !showBarcode) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4 print:gap-3">
      {showQR && (
        <div className="flex flex-col items-center gap-1">
          <canvas
            ref={qrCanvasRef}
            width={qrSize}
            height={qrSize}
            className="rounded-lg shadow-sm border border-slate-200 print:shadow-none print:border"
            aria-label={`QR Code for Order ${orderId}`}
          />
          <span className="text-[10px] text-slate-500 font-medium print:text-[8px]">Scan to Track</span>
        </div>
      )}

      {showBarcode && (
        <div className="flex flex-col items-center gap-1">
          <svg
            ref={barcodeRef}
            className="print:w-full"
            style={{ maxWidth: `${barcodeWidth}px`, height: `${barcodeHeight + 20}px` }}
            aria-label={`Barcode for Order ${orderId}`}
          />
          <span className="text-[10px] text-slate-500 font-mono font-medium print:text-[8px]">
            {orderId}
          </span>
        </div>
      )}
    </div>
  );
};

export default QRBarcodeGenerator;
