'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { ShieldCheck, ExternalLink, QrCode as QrIcon } from 'lucide-react';

interface CertificateQRCodeProps {
  certificateId: string;
  studentName?: string;
  size?: number;
  showDetails?: boolean;
}

export function CertificateQRCode({
  certificateId,
  studentName,
  size = 120,
  showDetails = true,
}: CertificateQRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate full URL if in browser
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const fullUrl = `${origin}/verify/${encodeURIComponent(certificateId)}`;

    // Generate high error correction QR code
    QRCode.toDataURL(fullUrl, {
      width: size * 2, // 2x for sharp retina displays
      margin: 1,
      color: {
        dark: '#0F172A', // Slate 900
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed generating QR code:', err);
      });
  }, [certificateId, size]);

  return (
    <div className="flex flex-col items-center text-center">
      <Link
        href={`/verify/${encodeURIComponent(certificateId)}`}
        target="_blank"
        title="Click to open official public verification page"
        className="group relative block p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#FF1313] dark:hover:border-[#FF1313] hover:shadow-md transition-all cursor-pointer"
      >
        <div className="relative">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt={studentName ? `QR Verification Code for ${studentName}` : `QR Verification Code for Certificate ${certificateId}`}
              width={size}
              height={size}
              className="rounded-lg object-contain transition-transform group-hover:scale-102 bg-white p-1"
            />
          ) : (
            <div
              style={{ width: size, height: size }}
              className="bg-slate-50 dark:bg-slate-900 flex items-center justify-center rounded-lg border border-slate-100 dark:border-slate-800"
            >
              <QrIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 animate-pulse" />
            </div>
          )}

          {/* Holographic Security Overlay Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-[#FF1313]/10 backdrop-blur-[1px] rounded-lg transition-opacity">
            <span className="bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1 border border-slate-200 dark:border-slate-700">
              <ExternalLink className="w-2.5 h-2.5 text-[#FF1313]" />
              Verify Live
            </span>
          </div>
        </div>
      </Link>

      {showDetails && (
        <div className="mt-2 space-y-0.5">
          <div className="flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>{certificateId}</span>
          </div>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
            Scan with smartphone camera to verify
          </p>
        </div>
      )}
    </div>
  );
}
