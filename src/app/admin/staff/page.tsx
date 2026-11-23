import React from 'react';
import { requireRole } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { ShieldCheck } from 'lucide-react';

export default async function AdminStaffPage() {
  const session = await requireRole(['ADMIN']);
  const db = getDatabase();

  return (
    <PortalLayout session={session}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
              Staff & Faculty Management
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
              Active academic staff members, subject specializations, and portal access permissions
            </p>
          </div>
          <div className="text-xs bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 border border-stone-200 dark:border-slate-700">
            <ShieldCheck className="w-4 h-4 text-[#FF1313]" />
            <span>Strict Role-Based Server Enforcement</span>
          </div>
        </div>

        {/* Staff Table */}
        <Card>
          <CardHeader
            title={`Academic Staff Roster (${db.teachers.length} Faculty Members)`}
            subtitle="Educators are only permitted to enter scores for their explicitly assigned classes"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 dark:bg-slate-800 text-[11px] font-bold uppercase text-stone-500 dark:text-slate-300 border-b border-stone-200 dark:border-slate-800 tracking-wider">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Staff ID</th>
                  <th className="py-3 px-4">Teacher Name</th>
                  <th className="py-3 px-4">Academic Credentials</th>
                  <th className="py-3 px-4">Subject Specialization</th>
                  <th className="py-3 px-4">Assigned Classes</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 text-center">System Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                {db.teachers.map((tch, idx) => {
                  const assignedClasses = db.classes.filter((c) => tch.assignedClassIds.includes(c.id));
                  return (
                    <tr key={tch.id} className="hover:bg-stone-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 text-xs font-semibold text-stone-400 dark:text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-mono text-xs font-bold text-stone-800 dark:text-slate-200">
                        {tch.staffId}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900 dark:text-white">{tch.fullName}</td>
                      <td className="py-3 px-4 text-xs text-stone-600 dark:text-slate-400">{tch.qualification}</td>
                      <td className="py-3 px-4 text-xs font-medium text-stone-800 dark:text-slate-300">
                        {tch.specialization}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {assignedClasses.map((ac) => (
                            <span
                              key={ac.id}
                              className="text-[11px] bg-[#FF1313]/10 dark:bg-[#FF1313]/25 text-[#FF1313] font-semibold px-2 py-0.5 rounded"
                            >
                              {ac.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-stone-600 dark:text-slate-400">
                        <div>{tch.email}</div>
                        <div className="text-[11px] text-stone-400 dark:text-slate-500 font-mono">{tch.phone}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status="TEACHER" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Security / RBAC Rule Demonstration Alert */}
        <div className="bg-stone-50 dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 p-5 transition-colors">
          <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-1">
            Server-Enforced Access Rule Matrix
          </h4>
          <p className="text-xs text-stone-600 dark:text-slate-400 mb-4">
            Security in Valencia SMS is verified at the query and server action layer, not just by toggling UI elements:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-white dark:bg-slate-800 rounded-lg border border-stone-200 dark:border-slate-700">
              <span className="font-bold text-stone-900 dark:text-white block mb-1">Teacher Scoping</span>
              <p className="text-stone-600 dark:text-slate-400">
                Educators can only fetch and update records where <code>teacherId === session.id</code>. Unauthorized subject writes throw an immediate 403 access denial.
              </p>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-800 rounded-lg border border-stone-200 dark:border-slate-700">
              <span className="font-bold text-stone-900 dark:text-white block mb-1">Parent Scoping</span>
              <p className="text-stone-600 dark:text-slate-400">
                Parents are locked to their declared wards (<code>student.parentId === session.parentId</code>). Transcripts are shielded until officially marked as Published by Admin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
