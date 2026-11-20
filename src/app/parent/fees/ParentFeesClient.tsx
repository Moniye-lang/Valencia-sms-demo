'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Student, FeeStatement } from '@/lib/types';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { CreditCard, ShieldCheck } from 'lucide-react';

interface ParentFeesClientProps {
  childrenList: Student[];
  activeStudent: Student;
  feeStatement?: FeeStatement;
}

export default function ParentFeesClient({
  childrenList,
  activeStudent,
  feeStatement,
}: ParentFeesClientProps) {
  const router = useRouter();
  const [showPayModal, setShowPayModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Title & Child Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">Term Fee Statements</h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            Itemized school fees, levies, and clearance receipts
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 dark:bg-slate-800 p-1 rounded-xl border border-stone-200 dark:border-slate-700">
          <span className="text-[11px] font-bold uppercase text-stone-500 dark:text-slate-400 px-2">Ward:</span>
          {childrenList.map((child) => {
            const isSelected = child.id === activeStudent.id;
            return (
              <button
                key={child.id}
                onClick={() => router.push(`/parent/fees?studentId=${child.id}`)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isSelected
                    ? 'bg-[#FF1313] text-white shadow-xs'
                    : 'text-stone-700 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-slate-700'
                  }`}
              >
                {child.firstName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Invoice Overview Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-stone-200/90 dark:border-slate-800 p-6 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-stone-400 dark:text-slate-500 font-bold">
                {feeStatement?.invoiceNumber || 'INV/2024/001'}
              </span>
              <StatusBadge status={feeStatement?.status || 'PAID'} />
            </div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white mt-1">
              {feeStatement?.title || 'First Term School Fees'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Student: <strong className="text-stone-800 dark:text-slate-200">{activeStudent.fullName}</strong> ({activeStudent.admissionNo}) &bull; Due Date: {feeStatement?.dueDate}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {feeStatement?.status !== 'PAID' && (
              <Button size="sm" onClick={() => setShowPayModal(true)}>
                <CreditCard className="w-4 h-4 mr-1.5" />
                Pay Remaining Balance
              </Button>
            )}
          </div>
        </div>

        {/* Financial KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/60 border border-stone-100 dark:border-slate-700/80">
            <span className="text-[11px] font-bold uppercase text-stone-500 dark:text-slate-400">Total Billed</span>
            <p className="text-2xl font-bold text-stone-900 dark:text-white mt-1">
              ₦{feeStatement?.totalAmount.toLocaleString() || 0}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/50">
            <span className="text-[11px] font-bold uppercase text-emerald-800 dark:text-emerald-300">Amount Paid</span>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
              ₦{feeStatement?.amountPaid.toLocaleString() || 0}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/60 border border-stone-100 dark:border-slate-700/80">
            <span className="text-[11px] font-bold uppercase text-stone-500 dark:text-slate-400">Balance Due</span>
            <p
              className={`text-2xl font-bold mt-1 ${(feeStatement?.balance || 0) > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-stone-900 dark:text-white'
                }`}
            >
              ₦{feeStatement?.balance.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Itemized Fee Breakdown Table */}
      <Card>
        <CardHeader
          title="Itemized Schedule of Levies"
          subtitle="Breakdown of academic, facility, and extracurricular fees"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-stone-50 dark:bg-slate-800 text-[11px] font-bold uppercase text-stone-500 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Fee Item & Description</th>
                <th className="py-3 px-4 text-right">Amount (NGN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
              {feeStatement?.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 text-xs font-semibold text-stone-400 dark:text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-4 font-semibold text-stone-900 dark:text-white">{item.description}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-stone-800 dark:text-slate-200">
                    ₦{item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-stone-50 dark:bg-slate-800/60 font-bold border-t border-stone-200 dark:border-slate-800 text-stone-900 dark:text-white">
                <td colSpan={2} className="py-3 px-4 text-right uppercase text-xs text-stone-600 dark:text-slate-300">
                  Total Term Assessment:
                </td>
                <td className="py-3 px-4 text-right font-mono text-base text-[#FF1313]">
                  ₦{feeStatement?.totalAmount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Demo Boundary Note */}
      <div className="bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl p-4 text-xs text-stone-600 dark:text-slate-400 flex items-start gap-3 transition-colors">
        <ShieldCheck className="w-5 h-5 text-stone-500 dark:text-slate-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-stone-800 dark:text-slate-200 font-bold">
            Demo Architecture Note (Payments Gateway Boundary):
          </strong>
          As defined in the demo scope agreement, financial statements and balance statuses are genuine database records.
          Direct card/bank processing via Paystack or Flutterwave APIs is stubbed for production staging.
        </div>
      </div>

      {/* Payment Modal Simulation */}
      {showPayModal && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full shadow-2xl">
            <CardHeader
              title="Valencia Payment Gateway"
              subtitle="Paystack / Flutterwave Secure Checkout Simulation"
            />
            <CardBody className="space-y-4 text-xs">
              <div className="p-3 bg-stone-50 dark:bg-slate-800 rounded-lg">
                <span className="text-stone-500 dark:text-slate-400 block">Payment for:</span>
                <strong className="text-stone-900 dark:text-white text-sm">
                  {activeStudent.fullName} &bull; Outstanding ₦{feeStatement?.balance.toLocaleString()}
                </strong>
              </div>
              <p className="text-stone-600 dark:text-slate-300">
                In the live production release, clicking &ldquo;Authorize Transfer&rdquo; loads the verified Paystack checkout modal with NUBAN, USSD, and Mastercard/Visa options.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="ghost" onClick={() => setShowPayModal(false)}>
                  Close
                </Button>
                <Button size="sm" onClick={() => setShowPayModal(false)}>
                  Confirm Simulation
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
