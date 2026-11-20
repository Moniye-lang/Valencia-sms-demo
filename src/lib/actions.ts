'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  getCurrentSession,
  requireAuth,
  requireRole,
  assertClassAccess,
  setServerSession,
  clearServerSession,
  getRoleDashboardPath,
  loginWithCredentials,
} from './auth';
import { getDatabase, saveDatabase, calculateGrade, resetDatabaseToSeed } from './data-store';
import { Role, AttendanceStatus, UserSession } from './types';

// Authentication Actions
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both email and password' };
  }

  const result = await loginWithCredentials(email, password);
  if (!result.success || !result.session) {
    return { error: result.error || 'Authentication failed' };
  }

  redirect(getRoleDashboardPath(result.session.role));
}

export async function logoutAction() {
  await clearServerSession();
  redirect('/login');
}

export async function switchDemoRoleAction(role: Role) {
  const db = getDatabase();
  let targetUser = db.users.find((u) => u.role === role);

  if (!targetUser) {
    throw new Error(`No demo user found for role ${role}`);
  }

  let associatedId: string | undefined;
  if (role === 'TEACHER') {
    associatedId = db.teachers.find((t) => t.userId === targetUser.id)?.id;
  } else if (role === 'PARENT') {
    associatedId = db.parents.find((p) => p.userId === targetUser.id)?.id;
  } else if (role === 'STUDENT') {
    associatedId = db.students.find((s) => s.userId === targetUser.id)?.id;
  }

  const session: UserSession = {
    userId: targetUser.id,
    name: targetUser.name,
    email: targetUser.email,
    role: targetUser.role,
    associatedId,
  };

  await setServerSession(session);
  redirect(getRoleDashboardPath(role));
}

// Teacher Score Entry & Submission Action
export async function saveScoreAction(data: {
  studentId: string;
  subjectId: string;
  classId: string;
  caScore: number;
  examScore: number;
}) {
  const session = await requireRole(['TEACHER', 'ADMIN']);

  // Server-side authorization check
  const hasAccess = await assertClassAccess(session, data.classId);
  if (!hasAccess) {
    throw new Error('Unauthorized: You are not assigned to grade this class.');
  }

  const db = getDatabase();
  const ca = Math.min(40, Math.max(0, Number(data.caScore) || 0));
  const exam = Math.min(60, Math.max(0, Number(data.examScore) || 0));
  const total = ca + exam;
  const { grade, remark } = calculateGrade(total);

  // Find existing result or create new
  const existingIdx = db.results.findIndex(
    (r) =>
      r.studentId === data.studentId &&
      r.subjectId === data.subjectId &&
      r.classId === data.classId &&
      r.term === '1st Term' &&
      r.session === '2024/2025'
  );

  const teacher = db.teachers.find((t) => t.userId === session.userId);
  const teacherId = teacher?.id || 'tch_adeleke';

  if (existingIdx >= 0) {
    const existing = db.results[existingIdx];
    // Cannot edit if already approved or published unless admin
    if (session.role !== 'ADMIN' && (existing.status === 'APPROVED' || existing.status === 'PUBLISHED')) {
      throw new Error('This result is already approved/published and locked for editing.');
    }

    db.results[existingIdx] = {
      ...existing,
      caScore: ca,
      examScore: exam,
      totalScore: total,
      grade,
      remark,
      status: existing.status === 'REJECTED' ? 'DRAFT' : existing.status,
      updatedAt: new Date().toISOString(),
    };
  } else {
    db.results.push({
      id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId: data.studentId,
      subjectId: data.subjectId,
      classId: data.classId,
      session: '2024/2025',
      term: '1st Term',
      caScore: ca,
      examScore: exam,
      totalScore: total,
      grade,
      remark,
      status: 'DRAFT',
      teacherId,
      updatedAt: new Date().toISOString(),
    });
  }

  saveDatabase(db);
  revalidatePath('/teacher/scores');
  revalidatePath('/teacher/classes');
  revalidatePath('/admin/results');
  return { success: true };
}

// Single high-speed batch save for 50-student classes
export async function saveBatchScoresAction(
  classId: string,
  subjectId: string,
  items: { studentId: string; caScore: number; examScore: number }[]
) {
  const session = await requireRole(['TEACHER', 'ADMIN']);
  const hasAccess = await assertClassAccess(session, classId);
  if (!hasAccess) {
    throw new Error('Unauthorized: You are not assigned to grade this class.');
  }

  const db = getDatabase();
  const teacher = db.teachers.find((t) => t.userId === session.userId);
  const teacherId = teacher?.id || 'tch_adeleke';

  for (const item of items) {
    const ca = Math.min(40, Math.max(0, Number(item.caScore) || 0));
    const exam = Math.min(60, Math.max(0, Number(item.examScore) || 0));
    const total = ca + exam;
    const { grade, remark } = calculateGrade(total);

    const existingIdx = db.results.findIndex(
      (r) =>
        r.studentId === item.studentId &&
        r.subjectId === subjectId &&
        r.classId === classId &&
        r.term === '1st Term' &&
        r.session === '2024/2025'
    );

    if (existingIdx >= 0) {
      const existing = db.results[existingIdx];
      if (session.role !== 'ADMIN' && (existing.status === 'APPROVED' || existing.status === 'PUBLISHED')) {
        continue;
      }
      db.results[existingIdx] = {
        ...existing,
        caScore: ca,
        examScore: exam,
        totalScore: total,
        grade,
        remark,
        status: existing.status === 'REJECTED' ? 'DRAFT' : existing.status,
        updatedAt: new Date().toISOString(),
      };
    } else {
      db.results.push({
        id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        studentId: item.studentId,
        subjectId,
        classId,
        session: '2024/2025',
        term: '1st Term',
        caScore: ca,
        examScore: exam,
        totalScore: total,
        grade,
        remark,
        status: 'DRAFT',
        teacherId,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  saveDatabase(db);
  revalidatePath('/teacher/scores');
  revalidatePath('/teacher/classes');
  revalidatePath('/admin/results');
  return { success: true };
}

// Teacher Submits Scores for Admin Approval
export async function submitScoresForApprovalAction(classId: string, subjectId: string) {
  const session = await requireRole(['TEACHER', 'ADMIN']);

  const hasAccess = await assertClassAccess(session, classId);
  if (!hasAccess) {
    throw new Error('Unauthorized: You cannot submit scores for this class.');
  }

  const db = getDatabase();
  let updatedCount = 0;

  db.results = db.results.map((r) => {
    if (r.classId === classId && r.subjectId === subjectId && (r.status === 'DRAFT' || r.status === 'REJECTED')) {
      updatedCount++;
      return {
        ...r,
        status: 'PENDING_APPROVAL',
        updatedAt: new Date().toISOString(),
      };
    }
    return r;
  });

  saveDatabase(db);
  revalidatePath('/teacher');
  revalidatePath('/teacher/scores');
  revalidatePath('/admin');
  revalidatePath('/admin/results');
  return { success: true, count: updatedCount };
}

// Admin Approves and Publishes Workflow
export async function approveResultsAction(classId: string, subjectId: string) {
  const session = await requireRole(['ADMIN']);
  const db = getDatabase();

  db.results = db.results.map((r) => {
    if (r.classId === classId && r.subjectId === subjectId && r.status === 'PENDING_APPROVAL') {
      return {
        ...r,
        status: 'APPROVED',
        approvedBy: session.name,
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return r;
  });

  saveDatabase(db);
  revalidatePath('/admin');
  revalidatePath('/admin/results');
  revalidatePath('/teacher');
  return { success: true };
}

export async function publishResultsAction(classId: string, subjectId: string) {
  const session = await requireRole(['ADMIN']);
  const db = getDatabase();

  db.results = db.results.map((r) => {
    if (r.classId === classId && r.subjectId === subjectId && (r.status === 'APPROVED' || r.status === 'PENDING_APPROVAL')) {
      return {
        ...r,
        status: 'PUBLISHED',
        approvedBy: session.name,
        approvedAt: r.approvedAt || new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return r;
  });

  saveDatabase(db);
  revalidatePath('/admin');
  revalidatePath('/admin/results');
  revalidatePath('/teacher');
  revalidatePath('/parent');
  revalidatePath('/parent/results');
  revalidatePath('/student');
  revalidatePath('/student/results');
  return { success: true };
}

export async function rejectResultsAction(classId: string, subjectId: string, reason: string) {
  await requireRole(['ADMIN']);
  const db = getDatabase();

  db.results = db.results.map((r) => {
    if (r.classId === classId && r.subjectId === subjectId && r.status === 'PENDING_APPROVAL') {
      return {
        ...r,
        status: 'REJECTED',
        rejectionReason: reason || 'Please crosscheck the continuous assessment scores.',
        updatedAt: new Date().toISOString(),
      };
    }
    return r;
  });

  saveDatabase(db);
  revalidatePath('/admin');
  revalidatePath('/admin/results');
  revalidatePath('/teacher');
  revalidatePath('/teacher/scores');
  return { success: true };
}

// Attendance Marking Action
export async function saveAttendanceAction(
  classId: string,
  date: string,
  records: { studentId: string; status: AttendanceStatus; remarks?: string }[]
) {
  const session = await requireRole(['TEACHER', 'ADMIN']);
  const hasAccess = await assertClassAccess(session, classId);
  if (!hasAccess) {
    throw new Error('Unauthorized class access');
  }

  const db = getDatabase();

  for (const rec of records) {
    const existingIdx = db.attendances.findIndex((a) => a.studentId === rec.studentId && a.date === date);
    if (existingIdx >= 0) {
      db.attendances[existingIdx].status = rec.status;
      db.attendances[existingIdx].remarks = rec.remarks;
    } else {
      db.attendances.push({
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        studentId: rec.studentId,
        classId,
        date,
        status: rec.status,
        remarks: rec.remarks,
      });
    }
  }

  saveDatabase(db);
  revalidatePath('/teacher/attendance');
  revalidatePath('/parent/attendance');
  return { success: true };
}

// Admin: Add Student Action
export async function createStudentAction(formData: FormData) {
  await requireRole(['ADMIN']);
  const firstName = (formData.get('firstName') as string).trim();
  const lastName = (formData.get('lastName') as string).trim();
  const classId = formData.get('classId') as string;
  const gender = formData.get('gender') as 'Male' | 'Female';
  const parentEmail = (formData.get('parentEmail') as string || 'parent@valencia.edu.ng').trim();

  if (!firstName || !lastName || !classId) {
    return { error: 'Please enter student first name, last name, and assigned class' };
  }

  const db = getDatabase();
  const studentNum = db.students.length + 1;
  const admissionNo = `VAL/2025/${studentNum.toString().padStart(3, '0')}`;
  const userId = `usr_std_${Date.now()}`;
  const studentId = `std_${Date.now()}`;
  const fullName = `${firstName} ${lastName}`;

  // Link to parent or default parent
  let parent = db.parents.find((p) => p.email.toLowerCase() === parentEmail.toLowerCase()) || db.parents[0];

  // Create User
  db.users.push({
    id: userId,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@valencia.edu.ng`,
    password: 'student123',
    name: fullName,
    role: 'STUDENT',
    createdAt: new Date().toISOString(),
  });

  // Create Student
  const newStudent = {
    id: studentId,
    userId,
    admissionNo,
    firstName,
    lastName,
    fullName,
    gender: gender || 'Male',
    dateOfBirth: '2012-05-15',
    classId,
    parentId: parent.id,
  };
  db.students.push(newStudent);
  parent.childrenStudentIds.push(studentId);

  // Seed default fee record
  db.fees.push({
    id: `fee_${studentId}`,
    studentId,
    session: '2024/2025',
    term: '1st Term',
    title: 'First Term Comprehensive School Fees',
    totalAmount: 345000,
    amountPaid: 0,
    balance: 345000,
    status: 'UNPAID',
    dueDate: '2024-09-30',
    invoiceNumber: `INV/2024/${admissionNo.replace(/\//g, '-')}`,
    items: [
      { description: 'Tuition & Instructional Materials', amount: 250000 },
      { description: 'ICT, Coding & Laboratory', amount: 65000 },
      { description: 'Sports, Medical & PTA Levies', amount: 30000 },
    ],
  });

  saveDatabase(db);
  revalidatePath('/admin/students');
  revalidatePath('/admin');
  return { success: true };
}

// Admin: Add Announcement Action
export async function createAnnouncementAction(formData: FormData) {
  const session = await requireRole(['ADMIN']);
  const title = (formData.get('title') as string).trim();
  const content = (formData.get('content') as string).trim();
  const targetAudience = (formData.get('targetAudience') as any) || 'ALL';
  const priority = (formData.get('priority') as any) || 'NORMAL';
  const category = (formData.get('category') as any) || 'Academic';

  if (!title || !content) {
    return { error: 'Please enter title and content' };
  }

  const db = getDatabase();
  db.announcements.unshift({
    id: `anc_${Date.now()}`,
    title,
    content,
    targetAudience,
    priority,
    authorName: `${session.name} (Admin)`,
    createdAt: new Date().toISOString(),
    category,
  });

  saveDatabase(db);
  revalidatePath('/admin/announcements');
  revalidatePath('/student/announcements');
  revalidatePath('/teacher');
  revalidatePath('/parent');
  return { success: true };
}

// Reset Database for demo restart
export async function resetDemoAction() {
  resetDatabaseToSeed();
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/teacher');
  revalidatePath('/parent');
  revalidatePath('/student');
  return { success: true };
}
