import type {Metadata} from 'next';
import {VStack} from '@astryxdesign/core/Layout';
import {Chapter} from '@/components/editorial/Chapter';
import {EditorialHero} from '@/components/editorial/EditorialHero';
import {ContactForm} from '@/components/contact/ContactForm';
import {ContactDirect} from '@/components/contact/ContactDirect';
import {ContactClosing} from '@/components/contact/ContactClosing';
import {contactClosing, contactDirect, contactForm, contactHero} from '@/content/contact';

export const metadata: Metadata = {
  title: 'Contact',
  description: contactHero.description,
  alternates: {canonical: '/contact'},
};

/**
 * Contact (V2): a page for starting a conversation, for recruiters and
 * clients alike. Hero, a short form, the direct route (email and LinkedIn)
 * and a one-line sign-off.
 */
export default function ContactPage() {
  return (
    <VStack gap={0}>
      <EditorialHero {...contactHero} align="center" />

      {/* 01 The form */}
      <Chapter label={contactForm.label}>
        <ContactForm />
      </Chapter>

      {/* 02 The direct route */}
      <Chapter tone="muted" label={contactDirect.label}>
        <ContactDirect />
      </Chapter>

      {/* Sign-off */}
      <Chapter label={contactClosing.label} className="closing-section">
        <ContactClosing />
      </Chapter>
    </VStack>
  );
}
