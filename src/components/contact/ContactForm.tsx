'use client';

import {useRef, useState, type FormEvent} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {ToggleButton, ToggleButtonGroup} from '@astryxdesign/core/ToggleButton';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {ArrowUpRight} from 'lucide-react';
import {ChapterHeader} from '@/components/editorial/ChapterHeader';
import {Reveal} from '@/components/motion/Reveal';
import {Lines} from '@/components/storytelling/Lines';
import {MessageFailed, MessageSent} from '@/components/illustrations/scenes';
import {contactForm as copy} from '@/content/contact';
import {site} from '@/content/site';
import {sendContactMessage} from '@/app/contact/actions';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

type Status = 'idle' | 'sending' | 'sent' | 'mailed' | 'error';
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The contact form: name, email, what it's about and a message, and nothing
 * more. Large, understated fields on thin hairlines with the brand blue on
 * the active field (.contact-form in globals.css), the topic as a row of
 * chips, and one Send button. Checked on send, with a short human line
 * under any field that needs another look.
 */
export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  // When the visitor first typed, to tell people from bots (sendContactMessage).
  const startedAt = useRef(0);
  const markStarted = () => {
    if (!startedAt.current) startedAt.current = Date.now();
  };

  const check = (): Errors => {
    const next: Errors = {};
    if (!name.trim()) next.name = copy.required.name;
    if (!email.trim()) next.email = copy.required.email;
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = copy.required.emailFormat;
    if (!message.trim()) next.message = copy.required.message;
    return next;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;
    const found = check();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Take the visitor to the first field that needs another look.
      const first = (['name', 'email', 'message'] as const).find(key => found[key]);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // The site emails Ravi everything filled in (sendContactMessage). If email
    // isn't set up yet, the visitor's own email app opens with it written out.
    setStatus('sending');
    try {
      const result = await sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        topic,
        message: message.trim(),
        website: formRef.current?.querySelector<HTMLInputElement>('[name="website"]')?.value ?? '',
        startedAt: startedAt.current,
      });
      if (result.status === 'unconfigured') {
        const subject = `${topic ?? 'Hello'} · from ${name.trim()}`;
        const body = `${message.trim()}\n\n${name.trim()}\n${email.trim()}`;
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setStatus('mailed');
        return;
      }
      setStatus(result.status === 'sent' ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setName('');
    setEmail('');
    setTopic(null);
    setMessage('');
    setErrors({});
    setStatus('idle');
    startedAt.current = 0;
  };

  const isDone = status === 'sent' || status === 'mailed';

  return (
    <Grid columns={1} className="contact-form-grid">
      <ChapterHeader index={copy.index} label={copy.label} title={copy.title} />

      <VStack gap={0} aria-live="polite">
        {isDone ? (
          <Reveal>
            <VStack gap={6} className="contact-form-done">
              <MessageSent label={copy.illustration.sent} maxWidth={280} />
              <Heading level={3} style={{...typeRole('display-m'), letterSpacing: '-0.03em'}}>
                <Lines text={copy.success.title} />
              </Heading>
              <Text
                type="large"
                color="secondary"
                textWrap="pretty"
                style={{maxInlineSize: '40ch'}}>
                {status === 'mailed' ? copy.mailFallback : copy.success.body}
              </Text>
              <HStack>
                <Button label={copy.success.again} variant="ghost" onClick={reset} />
              </HStack>
            </VStack>
          </Reveal>
        ) : (
          <form ref={formRef} className="contact-form" onSubmit={onSubmit} onInput={markStarted} noValidate>
            {/* A field people never see; bots fill it in. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="cs-pdf-trap" aria-hidden />
            <VStack gap={10}>
              <Text type="large" color="secondary" textWrap="pretty">
                {copy.intro}
              </Text>

              <Grid columns={{minWidth: 260, max: 2}} gap={8}>
                <TextInput
                  label={copy.fields.name.label}
                  placeholder={copy.fields.name.placeholder}
                  value={name}
                  onChange={value => {
                    setName(value);
                    if (errors.name) setErrors(current => ({...current, name: undefined}));
                  }}
                  htmlName="name"
                  autoComplete="name"
                  autoCapitalize="words"
                  size="lg"
                  width="100%"
                  containerClassName="contact-field"
                  status={errors.name ? {type: 'error', message: errors.name} : undefined}
                  statusVariant="detached"
                />
                <TextInput
                  type="email"
                  label={copy.fields.email.label}
                  placeholder={copy.fields.email.placeholder}
                  value={email}
                  onChange={value => {
                    setEmail(value);
                    if (errors.email) setErrors(current => ({...current, email: undefined}));
                  }}
                  htmlName="email"
                  autoComplete="email"
                  hasSpellCheck={false}
                  size="lg"
                  width="100%"
                  containerClassName="contact-field"
                  status={errors.email ? {type: 'error', message: errors.email} : undefined}
                  statusVariant="detached"
                />
              </Grid>

              <VStack gap={4}>
                <Text
                  type="supporting"
                  color="secondary"
                  style={{...EYEBROW_STYLE, color: 'var(--color-text-secondary)'}}>
                  {copy.fields.topic.label}
                </Text>
                <HStack className="contact-topics">
                  <ToggleButtonGroup
                    label={copy.fields.topic.label}
                    type="single"
                    value={topic}
                    onChange={value => setTopic(typeof value === 'string' ? value : null)}
                    size="lg">
                    {copy.topics.map(item => (
                      <ToggleButton key={item} value={item} label={item} />
                    ))}
                  </ToggleButtonGroup>
                </HStack>
              </VStack>

              <TextArea
                label={copy.fields.message.label}
                placeholder={copy.fields.message.placeholder}
                value={message}
                onChange={value => {
                  setMessage(value);
                  if (errors.message) setErrors(current => ({...current, message: undefined}));
                }}
                htmlName="message"
                rows={5}
                size="lg"
                width="100%"
                containerClassName="contact-field"
                status={errors.message ? {type: 'error', message: errors.message} : undefined}
                statusVariant="detached"
              />

              <HStack gap={6} vAlign="center" wrap="wrap">
                <Button
                  type="submit"
                  label={copy.submit}
                  variant="primary"
                  size="lg"
                  isLoading={status === 'sending'}
                  endContent={<Icon icon={ArrowUpRight} size="sm" color="inherit" />}
                />
              </HStack>
              {/* Only when sending fails; fields to fix keep their own short lines. */}
              {status === 'error' && (
                <Reveal>
                  <HStack gap={4} vAlign="center" wrap="wrap" role="alert" className="contact-form-problem">
                    <MessageFailed label={copy.illustration.error} maxWidth={160} />
                    <Text type="large" weight="medium" className="contact-form-error">
                      {copy.error}
                    </Text>
                  </HStack>
                </Reveal>
              )}
            </VStack>
          </form>
        )}
      </VStack>
    </Grid>
  );
}
