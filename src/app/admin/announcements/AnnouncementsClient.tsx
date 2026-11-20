'use client';

import React, { useState, useTransition } from 'react';
import { Announcement } from '@/lib/types';
import { createAnnouncementAction } from '@/lib/actions';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, CheckCircle2, Megaphone } from 'lucide-react';

export default function AnnouncementsClient({ announcements }: { announcements: Announcement[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createAnnouncementAction(formData);
      if (res.success) {
        setSuccessMsg('Announcement published and dispatched to portal dashboards!');
        setShowAdd(false);
        form.reset();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
            School Notices & Announcements
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            Broadcast official circulars to teachers, parents, and students
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Broadcast New Notice
        </Button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-xs text-emerald-700 dark:text-emerald-400 underline font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {showAdd && (
        <Card className="border-[#FF1313]/30 shadow-md">
          <CardHeader
            title="Compose Official School Notice"
            subtitle="Broadcast immediately visible on portal dashboards"
          />
          <CardBody>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">Notice Title *</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. End of First Term Examination Guidelines"
                  className="w-full text-xs border border-stone-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-[#FF1313]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">Target Audience</label>
                  <select
                    name="targetAudience"
                    className="w-full text-xs border border-stone-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-stone-900 dark:text-white"
                  >
                    <option value="ALL">Entire School (All Portals)</option>
                    <option value="TEACHERS">Teachers Only</option>
                    <option value="PARENTS">Parents Only</option>
                    <option value="STUDENTS">Students Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">Priority Level</label>
                  <select
                    name="priority"
                    className="w-full text-xs border border-stone-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-stone-900 dark:text-white"
                  >
                    <option value="NORMAL">Normal Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    name="category"
                    className="w-full text-xs border border-stone-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-stone-900 dark:text-white"
                  >
                    <option value="Academic">Academic Notice</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Sports">Sports & Extracurricular</option>
                    <option value="Event">Event / Assembly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">Notice Body / Content *</label>
                <textarea
                  name="content"
                  required
                  rows={3}
                  placeholder="Enter notice details, instructions, or agenda..."
                  className="w-full text-xs border border-stone-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-stone-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-[#FF1313]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isPending}>
                  Publish Notice
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((anc) => (
          <Card key={anc.id}>
            <CardBody className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-[#FF1313] shrink-0" />
                  <h3 className="text-base font-bold text-stone-900 dark:text-white">{anc.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${anc.priority === 'URGENT'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        : anc.priority === 'HIGH'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : 'bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-slate-300'
                      }`}
                  >
                    {anc.priority}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#FF1313]/10 dark:bg-[#FF1313]/25 text-[#FF1313]">
                    Audience: {anc.targetAudience}
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-700 dark:text-slate-300 mt-3 leading-relaxed">{anc.content}</p>
              <div className="mt-4 pt-2 border-t border-stone-100 dark:border-slate-800 text-[11px] text-stone-400 dark:text-slate-500 flex items-center justify-between">
                <span>Published by {anc.authorName}</span>
                <span>{new Date(anc.createdAt).toLocaleDateString()}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
