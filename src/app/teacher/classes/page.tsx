import React from 'react';
import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { getDatabase } from '@/lib/data-store';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ClipboardList, CalendarCheck2, ArrowRight } from 'lucide-react';

export default async function TeacherClassesPage() {
  const session = await requireRole(['TEACHER']);
  const db = getDatabase();

  const teacher = db.teachers.find((t) => t.userId === session.userId) || db.teachers[0];
  const assignedClasses = db.classes.filter((c) => teacher.assignedClassIds.includes(c.id));

  return (
    <PortalLayout session={session}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
            My Assigned Classes & Subjects
          </h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            Server permissions restrict your grading and attendance access exclusively to these classes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignedClasses.map((cls) => {
            const classStudents = db.students.filter((s) => s.classId === cls.id);
            const classSubjects = db.subjects.filter(
              (s) => s.classId === cls.id && teacher.assignedSubjectIds.includes(s.id)
            );

            return (
              <Card key={cls.id} className="border-[#FF1313]/20">
                <CardHeader
                  title={cls.name}
                  subtitle={`${cls.level} &bull; Arm ${cls.arm} &bull; ${cls.roomNumber}`}
                  action={
                    <span className="text-xs font-bold bg-[#FF1313]/10 dark:bg-[#FF1313]/25 text-[#FF1313] px-2.5 py-1 rounded-full">
                      {classStudents.length} Students
                    </span>
                  }
                />
                <CardBody className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-2">
                      Subjects You Teach In This Class:
                    </h4>
                    <div className="space-y-2">
                      {classSubjects.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-3 rounded-lg bg-stone-50 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-700/80 flex items-center justify-between transition-colors"
                        >
                          <div>
                            <span className="font-bold text-sm text-stone-900 dark:text-white">{sub.name}</span>
                            <span className="text-xs text-stone-500 dark:text-slate-400 ml-2 font-mono">({sub.code})</span>
                          </div>
                          <Link href={`/teacher/scores?classId=${cls.id}&subjectId=${sub.id}`}>
                            <Button size="sm" variant="outline">
                              <ClipboardList className="w-3.5 h-3.5 mr-1" />
                              Grade Sheet
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between">
                    <Link href={`/teacher/attendance?classId=${cls.id}`}>
                      <Button size="sm" variant="secondary">
                        <CalendarCheck2 className="w-3.5 h-3.5 mr-1" />
                        Take Class Attendance
                      </Button>
                    </Link>
                    <Link href={`/teacher/scores?classId=${cls.id}`}>
                      <Button size="sm">
                        Enter Scores <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
}
