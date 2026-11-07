import {LoginForm} from '@/components/write/LoginForm';
import {NotConfigured} from '@/components/write/NotConfigured';
import {isSupabaseConfigured} from '@/lib/supabase/env';

export default async function LoginPage({searchParams}: {searchParams: Promise<{error?: string}>}) {
  if (!isSupabaseConfigured) return <NotConfigured />;
  const {error} = await searchParams;
  return <LoginForm hasLinkError={error === 'link'} />;
}
