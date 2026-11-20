import { getCurrentSession, getRoleDashboardPath } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const session = await getCurrentSession();
  if (session) {
    redirect(getRoleDashboardPath(session.role));
  }

  return <LoginForm />;
}
