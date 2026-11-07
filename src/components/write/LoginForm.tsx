'use client';

import {useActionState, useState} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Button} from '@astryxdesign/core/Button';
import {Banner} from '@astryxdesign/core/Banner';
import {sendCode, verifyCode, type LoginState} from '@/app/write/login/actions';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

/**
 * Sign in to the studio with a one-time code sent by email: enter your
 * email, then type the code from the email. Works in any browser, unlike a
 * link that has to open where it was asked for.
 */
export function LoginForm({hasLinkError}: {hasLinkError: boolean}) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, send, isSending] = useActionState<LoginState, FormData>(sendCode, {status: 'idle'});
  const [verified, verify, isVerifying] = useActionState<LoginState, FormData>(verifyCode, {status: 'sent'});
  // Back to step 1 to ask for another code.
  const [isAskingAgain, setIsAskingAgain] = useState(false);

  const isCodeStep = sent.status === 'sent' && !isAskingAgain;

  return (
    <VStack gap={8} className="studio-centered">
      <VStack gap={3}>
        <Text type="supporting" style={EYEBROW_STYLE}>
          Studio
        </Text>
        <Heading level={1}>Sign in to write</Heading>
        <Text color="secondary">
          {isCodeStep
            ? 'If that email can sign in, a code is on its way. Type it below.'
            : 'We’ll email you a one-time sign-in code.'}
        </Text>
      </VStack>

      {hasLinkError && !isCodeStep && (
        <Banner
          status="error"
          title="That sign-in link has expired or was already used"
          description="Ask for a code below instead."
          collapsible={false}
        />
      )}

      {isCodeStep ? (
        <form action={verify}>
          <VStack gap={4}>
            <input type="hidden" name="email" value={sent.email ?? email} />
            <TextInput
              label="Code from the email"
              htmlName="code"
              value={code}
              onChange={value => setCode(value.replace(/[^\d]/g, '').slice(0, 10))}
              autoComplete="one-time-code"
              inputMode="numeric"
              hasAutoFocus
              width="100%"
              description={`Sent to ${sent.email}. It works once and expires in an hour.`}
              status={verified.message ? {type: 'error', message: verified.message} : undefined}
            />
            <HStack gap={2} wrap="wrap">
              <Button type="submit" label="Sign in" variant="primary" isLoading={isVerifying} />
              <Button
                label="Send a new code"
                variant="ghost"
                onClick={() => {
                  setCode('');
                  setIsAskingAgain(true);
                }}
              />
            </HStack>
          </VStack>
        </form>
      ) : (
        <form
          action={formData => {
            setIsAskingAgain(false);
            send(formData);
          }}>
          <VStack gap={4}>
            <TextInput
              type="email"
              label="Email"
              htmlName="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              width="100%"
              isRequired
              status={sent.status === 'error' ? {type: 'error', message: sent.message ?? ''} : undefined}
            />
            <Button type="submit" label="Email me a code" variant="primary" isLoading={isSending} />
          </VStack>
        </form>
      )}
    </VStack>
  );
}
