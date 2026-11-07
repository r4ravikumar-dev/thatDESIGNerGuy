import {VStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Banner} from '@astryxdesign/core/Banner';

/** Shown in /write until the Supabase keys are set (see supabase/README.md). */
export function NotConfigured() {
  return (
    <VStack gap={6} className="studio-centered">
      <Heading level={1}>Connect Supabase to start writing</Heading>
      <Banner
        status="info"
        title="The studio needs its backend"
        description="Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and ADMIN_EMAIL to .env.local (and to Vercel), run supabase/migrations/0001_case_studies.sql once, then reload."
        collapsible={false}
      />
      <Text color="secondary">The full five-minute setup is in supabase/README.md.</Text>
    </VStack>
  );
}
