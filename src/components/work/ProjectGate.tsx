'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import {useRouter} from 'next/navigation';
import {motion, useReducedMotion} from 'framer-motion';
import {Dialog} from '@astryxdesign/core/Dialog';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Icon} from '@astryxdesign/core/Icon';
import {ArrowUpRight, Crown, Plane, RotateCcw, X} from 'lucide-react';
import {Lines} from '@/components/storytelling/Lines';
import {boardingPass as copy} from '@/content/work';
import {springs} from '@/motion/springs';
import {typeRole} from '@/theme/typeScale';
import {EYEBROW_STYLE} from '@/theme/eyebrow';

type Gate = {
  /** Opens the boarding pass for a project. */
  open: (project: string) => void;
  /** A click handler for a project link: stays on the page and opens the pass. */
  onProjectClick: (project: string) => (event: MouseEvent) => void;
};

const GateContext = createContext<Gate | null>(null);

export function useProjectGate(): Gate {
  const gate = useContext(GateContext);
  if (!gate) throw new Error('useProjectGate must be used inside <ProjectGateProvider>');
  return gate;
}

/** idle: the pass as issued; boarded: stub torn, stamped; lounge: flipped to the VIP card. */
type Stage = 'idle' | 'boarded' | 'lounge';

/** How long the tear and the stamp play before the visitor is taken to the gate. */
const GATE_DELAY = 1700;

const QUIET_LABEL = {...EYEBROW_STYLE, color: 'var(--color-text-secondary)'} as const;

/** "Mamily × Visit Health" → "MAM". */
const codeOf = (project: string) => project.replace(/[^a-z]/gi, '').slice(0, 3).toUpperCase();

function Field({label, value}: {label: string; value: string}) {
  return (
    <VStack gap={1}>
      <Text type="supporting" style={QUIET_LABEL}>
        {label}
      </Text>
      <Text weight="semibold" textWrap="balance">
        {value}
      </Text>
    </VStack>
  );
}

/**
 * The route, as on a real pass: YOU, a dotted flight path with the plane on
 * it, then the project's code. Once boarded the plane takes off along it.
 */
function Route({project, isBoarded}: {project: string; isBoarded: boolean}) {
  const reduceMotion = useReducedMotion();
  return (
    <Grid columns={1} className="pass-route">
      <VStack gap={1}>
        <Text type="supporting" style={QUIET_LABEL}>
          {copy.from.label}
        </Text>
        <Text style={{...typeRole('display-s'), ...EYEBROW_STYLE, color: 'var(--color-text-primary)', letterSpacing: '0.02em'}}>
          {copy.from.code}
        </Text>
        <Text type="supporting" color="secondary">
          {copy.from.place}
        </Text>
      </VStack>
      <HStack className="pass-route-path" vAlign="center" aria-hidden>
        <motion.span
          className="pass-route-plane"
          initial={false}
          animate={
            isBoarded && !reduceMotion
              ? {x: '120%', y: -14, rotate: -12, opacity: 0}
              : {x: 0, y: 0, rotate: 0, opacity: 1}
          }
          transition={isBoarded ? {duration: 0.9, ease: [0.5, 0, 0.75, 0]} : springs.spatial.default}>
          <Icon icon={Plane} size="md" color="inherit" />
        </motion.span>
      </HStack>
      <VStack gap={1} hAlign="end" style={{textAlign: 'end'}}>
        <Text type="supporting" style={QUIET_LABEL}>
          {copy.to.label}
        </Text>
        <Text style={{...typeRole('display-s'), ...EYEBROW_STYLE, color: 'var(--color-brand-text)', letterSpacing: '0.02em'}}>
          {codeOf(project)}
        </Text>
        <Text type="supporting" color="secondary" textWrap="balance">
          {project}
        </Text>
      </VStack>
    </Grid>
  );
}

/** A decorative barcode in the current text colour (.pass-barcode in globals.css). */
function Barcode() {
  return <HStack className="pass-barcode" aria-hidden />;
}

/**
 * The case studies are locked for now, and every project link opens this
 * boarding pass instead. It is a ticket: the main pass and a stub on a
 * perforated edge with notches, side by side on wider screens and stacked
 * on phones (.pass in globals.css).
 *
 * - Book a walkthrough: the stub is torn off and falls away, the pass is
 *   stamped "Boarded" and the plane takes off, then the visitor is taken to
 *   Contact, the gate.
 * - I'll wait: the pass flips over to the back, a VIP lounge card.
 */
export function ProjectGateProvider({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [project, setProject] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<Stage>('idle');
  // Which way the stub falls: off the side, or off the bottom on phones.
  const [isStacked, setIsStacked] = useState(false);
  const gateTimer = useRef<number | undefined>(undefined);
  const loungeButton = useRef<HTMLButtonElement>(null);
  const boardButton = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const vipTitleId = useId();

  const open = useCallback((name: string) => {
    window.clearTimeout(gateTimer.current);
    setProject(name);
    setStage('idle');
    setIsOpen(true);
  }, []);

  useEffect(() => () => window.clearTimeout(gateTimer.current), []);

  const gate = useMemo<Gate>(
    () => ({
      open,
      onProjectClick: name => event => {
        event.preventDefault();
        open(name);
      },
    }),
    [open],
  );

  const onOpenChange = (next: boolean) => {
    // Once boarded the visitor is already on the way to the gate.
    if (!next && stage === 'boarded') return;
    setIsOpen(next);
  };

  const board = () => {
    setIsStacked(window.matchMedia('(max-width: 639.98px)').matches);
    setStage('boarded');
    gateTimer.current = window.setTimeout(
      () => {
        router.push('/contact');
        setIsOpen(false);
      },
      reduceMotion ? 900 : GATE_DELAY,
    );
  };

  const wait = () => setStage('lounge');
  const flipBack = () => setStage('idle');

  const isBoarded = stage === 'boarded';
  const isLounge = stage === 'lounge';

  // The stub's tear: a small tug at the perforation, then it falls away.
  const torn = isStacked
    ? {x: [0, 0, 18], y: [0, 6, 220], rotate: [0, -1.5, -10], opacity: [1, 1, 0]}
    : {x: [0, 8, 120], y: [0, 0, 260], rotate: [0, 2, 22], opacity: [1, 1, 0]};

  return (
    <GateContext.Provider value={gate}>
      {children}
      <Dialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        width={780}
        maxHeight="94dvh"
        padding={0}
        purpose="info"
        className="pass-dialog"
        aria-labelledby={isLounge ? vipTitleId : titleId}>
        <motion.article
          className="pass"
          data-stage={stage}
          initial={false}
          animate={{rotateY: isLounge ? 180 : 0}}
          transition={reduceMotion ? {duration: 0} : springs.spatial.slow}
          onAnimationComplete={() => {
            if (isLounge) loungeButton.current?.focus();
          }}>
          {/* ---------- Front: the pass and its stub ---------- */}
          <Grid columns={1} className="pass-face pass-front" inert={isLounge} aria-hidden={isLounge}>
            <VStack gap={0} className="pass-main">
              <HStack className="pass-header" justify="between" vAlign="center" gap={4}>
                <HStack gap={2} vAlign="center">
                  <Icon icon={Plane} size="sm" color="inherit" />
                  <Text type="supporting" style={{...EYEBROW_STYLE, color: 'var(--color-text-primary)'}}>
                    {copy.airline}
                  </Text>
                </HStack>
                <HStack gap={3} vAlign="center">
                  <Text type="supporting" style={QUIET_LABEL}>
                    {copy.kind}
                  </Text>
                  <IconButton
                    label={copy.close}
                    icon={<Icon icon={X} size="sm" color="inherit" />}
                    variant="ghost"
                    size="sm"
                    isDisabled={isBoarded}
                    onClick={() => setIsOpen(false)}
                  />
                </HStack>
              </HStack>

              <VStack gap={8} className="pass-body">
                <Route project={project} isBoarded={isBoarded} />

                <VStack gap={3}>
                  <Text type="supporting" style={EYEBROW_STYLE}>
                    {copy.front.eyebrow}
                  </Text>
                  <Heading
                    level={2}
                    id={titleId}
                    textWrap="balance"
                    style={{...typeRole('headline-l'), letterSpacing: '-0.02em'}}>
                    <Lines text={isBoarded ? copy.boarded.title : copy.front.title} />
                  </Heading>
                  <Text color="secondary" textWrap="pretty" style={{maxInlineSize: '46ch'}}>
                    {isBoarded ? copy.boarded.body : copy.front.body}
                  </Text>
                </VStack>

                <Grid columns={3} gap={4} className="pass-fields">
                  {copy.front.fields.map(field => (
                    <Field key={field.label} {...field} />
                  ))}
                </Grid>

                <VStack gap={4}>
                  <Text type="supporting" color="secondary" textWrap="pretty">
                    {copy.front.note}
                  </Text>
                  <HStack gap={3} wrap="wrap" vAlign="center">
                    <Button
                      ref={boardButton}
                      label={copy.front.board}
                      variant="primary"
                      isDisabled={isBoarded}
                      onClick={board}
                      endContent={<Icon icon={ArrowUpRight} size="sm" color="inherit" />}
                    />
                    <Button label={copy.front.wait} variant="ghost" isDisabled={isBoarded} onClick={wait} />
                  </HStack>
                </VStack>
              </VStack>

              {/* The stamp lands once the stub is torn. */}
              <motion.span
                className="pass-stamp"
                aria-hidden={!isBoarded}
                initial={false}
                animate={
                  isBoarded
                    ? {opacity: 1, scale: 1, rotate: -9}
                    : {opacity: 0, scale: reduceMotion ? 1 : 1.8, rotate: -16}
                }
                transition={
                  isBoarded
                    ? {...springs.spatial.fast, delay: reduceMotion ? 0 : 0.45}
                    : {duration: 0}
                }>
                <VStack gap={1} hAlign="center">
                  <Text style={{...typeRole('headline-m'), ...EYEBROW_STYLE, letterSpacing: '0.12em'}}>
                    {copy.boarded.stamp}
                  </Text>
                  <Text type="supporting" style={EYEBROW_STYLE}>
                    {copy.boarded.stampNote}
                  </Text>
                </VStack>
              </motion.span>
            </VStack>

            {/* The stub, on the perforation; torn off on boarding. */}
            <motion.aside
              className="pass-stub"
              aria-hidden
              initial={false}
              animate={isBoarded ? (reduceMotion ? {opacity: 0} : torn) : {x: 0, y: 0, rotate: 0, opacity: 1}}
              transition={
                isBoarded
                  ? {duration: reduceMotion ? 0.2 : 0.95, times: [0, 0.22, 1], ease: [0.45, 0, 0.8, 0.4]}
                  : {duration: 0}
              }>
              <VStack gap={6} className="pass-stub-inner">
                <Text type="supporting" className="pass-stub-airline" style={{...EYEBROW_STYLE, color: 'inherit'}}>
                  {copy.airline}
                </Text>
                <VStack gap={1} className="pass-stub-flight">
                  <Text type="supporting" style={{...EYEBROW_STYLE, color: 'inherit', opacity: 0.75}}>
                    {copy.stub.flight}
                  </Text>
                  <Text style={{...typeRole('headline-s'), ...EYEBROW_STYLE, color: 'inherit', letterSpacing: '0.04em', whiteSpace: 'nowrap'}}>
                    {copy.from.code} → {codeOf(project)}
                  </Text>
                </VStack>
                <Grid columns={2} gap={4} className="pass-stub-seat">
                  {[copy.stub.seat, copy.stub.cabin].map(field => (
                    <VStack key={field.label} gap={1}>
                      <Text type="supporting" style={{...EYEBROW_STYLE, color: 'inherit', opacity: 0.75}}>
                        {field.label}
                      </Text>
                      <Text weight="semibold" style={{color: 'inherit'}}>
                        {field.value}
                      </Text>
                    </VStack>
                  ))}
                </Grid>
                <Barcode />
                <Text type="supporting" className="pass-stub-tear" style={{...EYEBROW_STYLE, color: 'inherit', opacity: 0.75}}>
                  {copy.stub.tear}
                </Text>
              </VStack>
            </motion.aside>
          </Grid>

          {/* ---------- Back: the VIP lounge card ---------- */}
          <VStack gap={0} className="pass-face pass-back" inert={!isLounge} aria-hidden={!isLounge}>
            <Crown className="pass-back-watermark" strokeWidth={1} aria-hidden />
            <HStack className="pass-header pass-back-header" justify="between" vAlign="center" gap={4}>
              <HStack gap={2} vAlign="center">
                <Icon icon={Crown} size="sm" color="inherit" />
                <Text type="supporting" style={{...EYEBROW_STYLE, color: 'inherit'}}>
                  {copy.vip.eyebrow}
                </Text>
              </HStack>
              <IconButton
                label={copy.close}
                icon={<Icon icon={X} size="sm" color="inherit" />}
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              />
            </HStack>
            <VStack gap={8} className="pass-body">
              <VStack gap={3}>
                <Heading
                  level={2}
                  id={vipTitleId}
                  textWrap="balance"
                  style={{...typeRole('display-s'), letterSpacing: '-0.03em'}}>
                  <Lines text={copy.vip.title} />
                </Heading>
                <Text color="secondary" textWrap="pretty" style={{maxInlineSize: '48ch'}}>
                  {copy.vip.body.replace('{project}', project)}
                </Text>
              </VStack>
              <Grid columns={3} gap={4} className="pass-fields">
                {copy.vip.fields.map(field => (
                  <Field key={field.label} {...field} />
                ))}
              </Grid>
              <HStack justify="between" vAlign="center" gap={4} wrap="wrap" className="pass-back-footer">
                <HStack gap={3} wrap="wrap" vAlign="center">
                  <Button
                    ref={loungeButton}
                    label={copy.vip.done}
                    variant="primary"
                    onClick={() => setIsOpen(false)}
                  />
                  <Button
                    label={copy.vip.flipBack}
                    variant="ghost"
                    onClick={flipBack}
                    icon={<Icon icon={RotateCcw} size="sm" color="inherit" />}
                  />
                </HStack>
                <Text type="supporting" style={QUIET_LABEL}>
                  {copy.vip.card}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </motion.article>
      </Dialog>
    </GateContext.Provider>
  );
}
