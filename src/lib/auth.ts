import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Role, UserSession } from './types';
import { getDatabase } from './data-store';

const SESSION_COOKIE_NAME = 'valencia_session';

export function getRoleDashboardPath(role: Role): string {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'TEACHER':
      return '/teacher';
    case 'PARENT':
      return '/parent';
    case 'STUDENT':
      return '/student';
  }
}

export async function getCurrentSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8')) as UserSession;
    if (!parsed || !parsed.userId || !parsed.role) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function setServerSession(session: UserSession): Promise<void> {
  const cookieStore = await cookies();
  const serialized = Buffer.from(JSON.stringify(session)).toString('base64');

  cookieStore.set(SESSION_COOKIE_NAME, serialized, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearServerSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(): Promise<UserSession> {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export async function requireRole(allowedRoles: Role[]): Promise<UserSession> {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.role)) {
    // Redirect to user's authorized home portal with access denied query
    const target = getRoleDashboardPath(session.role);
    redirect(`${target}?access_denied=1`);
  }

  return session;
}

// Server-enforced student record authorization
export async function assertStudentAccess(session: UserSession, targetStudentId: string): Promise<boolean> {
  if (session.role === 'ADMIN') {
    return true;
  }

  const db = getDatabase();

  if (session.role === 'PARENT') {
    const parent = db.parents.find((p) => p.userId === session.userId || p.id === session.associatedId);
    if (!parent) return false;
    return parent.childrenStudentIds.includes(targetStudentId);
  }

  if (session.role === 'STUDENT') {
    const student = db.students.find((s) => s.userId === session.userId || s.id === session.associatedId);
    if (!student) return false;
    return student.id === targetStudentId;
  }

  if (session.role === 'TEACHER') {
    const teacher = db.teachers.find((t) => t.userId === session.userId || t.id === session.associatedId);
    if (!teacher) return false;
    const student = db.students.find((s) => s.id === targetStudentId);
    if (!student) return false;
    return teacher.assignedClassIds.includes(student.classId);
  }

  return false;
}

// Server-enforced teacher class authorization
export async function assertClassAccess(session: UserSession, classId: string): Promise<boolean> {
  if (session.role === 'ADMIN') return true;

  if (session.role === 'TEACHER') {
    const db = getDatabase();
    const teacher = db.teachers.find((t) => t.userId === session.userId || t.id === session.associatedId);
    if (!teacher) return false;
    return teacher.assignedClassIds.includes(classId);
  }

  return false;
}

export async function loginWithCredentials(
  email: string,
  pass: string
): Promise<{ success: boolean; session?: UserSession; error?: string }> {
  const db = getDatabase();
  const normalizedEmail = email.trim().toLowerCase();

  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user || user.password !== pass) {
    return { success: false, error: 'Invalid email address or password' };
  }

  let associatedId: string | undefined;
  if (user.role === 'TEACHER') {
    associatedId = db.teachers.find((t) => t.userId === user.id)?.id;
  } else if (user.role === 'PARENT') {
    associatedId = db.parents.find((p) => p.userId === user.id)?.id;
  } else if (user.role === 'STUDENT') {
    associatedId = db.students.find((s) => s.userId === user.id)?.id;
  }

  const session: UserSession = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    associatedId,
  };

  await setServerSession(session);
  return { success: true, session };
}
