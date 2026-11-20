import { getCurrentSession, getRoleDashboardPath } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getCurrentSession();
  if (session) {
    redirect(getRoleDashboardPath(session.role));
  } else {
    redirect('/login');
  }
}
