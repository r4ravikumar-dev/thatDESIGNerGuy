'use server';

import {redirect} from 'next/navigation';
import {createSupabaseServerClient, ownerEmail} from '@/lib/supabase/server';
import {isSupabaseConfigured} from '@/lib/supabase/env';

export type LoginState = {
  status: 'idle' | 'sent' | 'error';
  /** The email the code was sent to, kept for the verify step. */
  email?: string;
  message?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Step 1: emails a one-time sign-in code, but only to the owner's email.
 * Anyone else sees the same "check your inbox" reply, so the form never
 * reveals which email works.
 */
export async function sendCode(_: LoginState, formData: FormData): Promise<LoginState> {
  if (!isSupabaseConfigured) return {status: 'error', message: 'Supabase is not connected yet.'};
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!EMAIL.test(email)) return {status: 'error', message: 'That email doesn’t look right.'};

  if (email === ownerEmail()) {
    const supabase = await createSupabaseServerClient();
    const {error} = await supabase.auth.signInWithOtp({email});
    if (error) {
      const isRateLimited = /rate|limit|seconds/i.test(error.message);
      return {
        status: 'error',
        email,
        message: isRateLimited
          ? 'Too many codes asked for. Wait a minute, then try again.'
          : 'The code couldn’t be sent. Try again in a minute.',
      };
    }
  }
  return {status: 'sent', email};
}

/**
 * Step 2: checks the code from the email and signs in (the session is set
 * as a cookie on this response), then opens the studio.
 */
export async function verifyCode(state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? state.email ?? '').trim().toLowerCase();
  const token = String(formData.get('code') ?? '').replace(/\s+/g, '');
  if (!/^\d{6,10}$/.test(token)) {
    return {status: 'sent', email, message: 'Enter the code from the email (just the digits).'};
  }
  if (email !== ownerEmail()) {
    return {status: 'sent', email, message: 'That code isn’t right, or it has expired.'};
  }
  const supabase = await createSupabaseServerClient();
  const {error} = await supabase.auth.verifyOtp({email, token, type: 'email'});
  if (error) {
    return {status: 'sent', email, message: 'That code isn’t right, or it has expired. Ask for a new one.'};
  }
  redirect('/write');
}
