'use client';

import {useId, type CSSProperties} from 'react';
import {motion} from 'framer-motion';
import {ACCENT, Dot, Illustration, MUTED, Pulse, Stroke, Surface, Travel} from './Illustration';

type SceneProps = {label?: string; maxWidth?: number};

const TANGLE =
  'M16 130 C 30 50, 120 40, 104 118 S 26 186, 70 104 S 176 46, 152 140 S 84 176, 136 96 S 228 80, 206 132 C 196 156, 236 154, 260 130';

/**
 * Hero: a tangle that resolves into one straight line. In the loop, a blue
 * pulse works its way through the tangle and comes out straight at the node,
 * which breathes: making sense of it, over and over.
 */
export function TangleToLine({label, maxWidth = 560}: SceneProps) {
  return (
    <Illustration viewBox="0 0 480 220" label={label} maxWidth={maxWidth}>
      <Stroke order={0} d={TANGLE} />
      <Stroke order={6} d="M260 130 L 440 130" />
      <Stroke
        order={8}
        weight="fine"
        stroke={MUTED}
        d="M300 116 L 300 144 M 360 116 L 360 144 M 420 116 L 420 144"
      />
      <Travel d={`${TANGLE} L 452 130`} duration={9} />
      <Pulse cx={452} cy={130} r={8} />
      <Pulse cx={452} cy={130} r={8} delay={1.5} />
      <Dot order={11} cx={452} cy={130} r={7} />
    </Illustration>
  );
}

/**
 * Problem: planes stacking up. In the loop they drift apart and settle at
 * offset rhythms, and the top layer tilts out of line before it returns.
 */
export function StackedLayers({label, maxWidth = 420}: SceneProps) {
  const plane = 'M200 40 L320 100 L200 160 L80 100 Z';
  const layers = [
    {dy: 120, rotate: 0},
    {dy: 80, rotate: -3},
    {dy: 40, rotate: 5},
    {dy: 0, rotate: -9},
  ];
  return (
    <Illustration viewBox="0 0 400 300" label={label} maxWidth={maxWidth}>
      {layers.map((layer, index) => {
        const isTop = index === layers.length - 1;
        return (
          <g key={layer.dy} transform={`translate(0 ${layer.dy}) rotate(${layer.rotate} 200 100)`}>
            <g
              className={`ill-loop ${isTop ? 'ill-tilt' : 'ill-float'}`}
              style={{
                animationDelay: `${-index * 1.6}s`,
                ['--float' as string]: `${4 + index * 3}px`,
              }}>
              <Surface order={index * 2} d={plane} />
              <Stroke
                order={index * 2}
                d={plane}
                stroke={isTop ? ACCENT : undefined}
                strokeDasharray={isTop ? '6 8' : undefined}
              />
              {isTop && (
                <>
                  <Pulse cx={200} cy={100} r={6} />
                  <Dot order={9} cx={200} cy={100} r={5} />
                </>
              )}
            </g>
          </g>
        );
      })}
    </Illustration>
  );
}

/**
 * A system: mixed shapes held in a calm grid. In the loop a blue highlight
 * snakes cell by cell through the system, with a pulse along the connectors.
 */
export function SystemBlocks({label, maxWidth = 440}: SceneProps) {
  const x = (col: number) => 80 + col * 120;
  const y = (row: number) => 60 + row * 90;
  // Snake order: left to right, then right to left, then left to right.
  const order = [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2],
    [1, 1],
    [1, 0],
    [2, 0],
    [2, 1],
    [2, 2],
  ] as const;
  const snake = order
    .map(([row, col], index) => `${index === 0 ? 'M' : 'L'}${x(col)} ${y(row)}`)
    .join(' ');
  const shapePath = (row: number, col: number) => {
    const cx = x(col);
    const cy = y(row);
    const kind = (row + col) % 3;
    if (kind === 0) return `M${cx - 18} ${cy} a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0`;
    if (kind === 1) return `M${cx - 16} ${cy - 16} h32 v32 h-32 Z`;
    return `M${cx} ${cy - 18} L${cx + 18} ${cy + 14} L${cx - 18} ${cy + 14} Z`;
  };
  const duration = 10.8;
  // Each shape lights up the moment the comet's head reaches it. The comet
  // moves at a constant speed and its head runs from 0 to 1.08 of the path
  // (its 0.08 tail has to leave the end too), so a shape's start time is its
  // distance along the snake, as a share of the whole, over 1.08.
  const points = order.map(([row, col]) => [x(col), y(row)] as const);
  const distances = points.map((_, index) =>
    points
      .slice(1, index + 1)
      .reduce((sum, [px, py], k) => sum + Math.hypot(px - points[k]![0], py - points[k]![1]), 0),
  );
  const total = distances[distances.length - 1]!;
  const arrival = (index: number) => ((distances[index]! / total / 1.08) * duration).toFixed(2);
  return (
    <Illustration viewBox="0 0 400 300" label={label} maxWidth={maxWidth}>
      <Stroke
        order={0}
        weight="fine"
        stroke={MUTED}
        d="M80 60 H 320 M 80 150 H 320 M 80 240 H 320 M 80 60 V 240 M 200 60 V 240 M 320 60 V 240"
      />
      <Travel d={snake} duration={duration} isLinear />
      {order.map(([row, col], index) => (
        <g key={`${row}-${col}`}>
          <Surface order={2 + index} d={shapePath(row, col)} />
          <Stroke order={2 + index} d={shapePath(row, col)} />
          {/* The highlight: a blue copy that lights up as the comet arrives. */}
          <path
            className="ill-loop ill-blink"
            d={shapePath(row, col)}
            fill={ACCENT}
            fillOpacity={0.18}
            stroke={ACCENT}
            strokeWidth={1.75}
            strokeLinejoin="round"
            style={{
              animationDuration: `${duration}s`,
              animationDelay: `${arrival(index)}s`,
            }}
          />
        </g>
      ))}
    </Illustration>
  );
}

/**
 * Thinking: a lens over lines of text. In the loop it slowly scans the
 * lines, and whatever sits under the glass turns brand blue.
 */
export function ThinkingLens({label, maxWidth = 420}: SceneProps) {
  const lines = [
    {y: 70, w: 260},
    {y: 110, w: 220},
    {y: 150, w: 280},
    {y: 190, w: 180},
    {y: 230, w: 240},
  ];
  const linesPath = lines.map(line => `M60 ${line.y} h${line.w}`).join(' ');
  return (
    <Illustration viewBox="0 0 400 300" label={label} maxWidth={maxWidth}>
      {({clip}) => (
        <>
          <defs>
            <clipPath id={clip}>
              <circle className="ill-loop ill-scan" cx={188} cy={150} r={60} />
            </clipPath>
          </defs>
          {lines.map((line, index) => (
            <Stroke
              key={line.y}
              order={index}
              weight="fine"
              stroke={MUTED}
              d={`M60 ${line.y} h${line.w}`}
            />
          ))}
          {/* The same lines in blue, visible only through the glass. */}
          <path
            d={linesPath}
            clipPath={`url(#${clip})`}
            fill="none"
            stroke={ACCENT}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <g className="ill-loop ill-scan">
            <Surface order={5} d="M188 150 m-62 0 a62 62 0 1 0 124 0 a62 62 0 1 0 -124 0" />
            <Stroke order={5} d="M188 150 m-62 0 a62 62 0 1 0 124 0 a62 62 0 1 0 -124 0" />
            <Stroke order={7} d="M232 194 L 300 262" strokeWidth={3} />
          </g>
        </>
      )}
    </Illustration>
  );
}

/**
 * Send us a note: a paper plane gliding over a looping dashed trail, with a
 * blue pulse running along the trail.
 */
export function PaperPlane({label, maxWidth = 420}: SceneProps) {
  const trail =
    'M20 236 C 90 236, 120 180, 96 150 C 72 120, 30 150, 60 176 C 100 210, 190 150, 250 96';
  return (
    <Illustration viewBox="0 0 400 260" label={label} maxWidth={maxWidth}>
      <Stroke order={0} weight="fine" stroke={MUTED} strokeDasharray="4 10" d={trail} />
      <Travel d={trail} duration={8} />
      <g className="ill-loop ill-glide">
        <Surface order={6} d="M262 90 L 380 30 L 330 150 L 300 112 Z" />
        <Stroke order={6} d="M262 90 L 380 30 L 330 150 L 300 112 Z" />
        <Stroke order={8} stroke={ACCENT} d="M380 30 L 300 112 L 296 150 L 318 126" />
      </g>
    </Illustration>
  );
}

/**
 * How we think: a question that finds its way to a point. In the loop a dot
 * travels from the question mark to the target, which ripples on arrival,
 * while the question mark sways as if still thinking.
 */
export function QuestionPath({label, maxWidth = 420}: SceneProps) {
  const path = 'M96 170 C 150 220, 200 120, 250 170 S 320 210, 340 150';
  return (
    <Illustration viewBox="0 0 400 260" label={label} maxWidth={maxWidth}>
      <g className="ill-loop ill-sway">
        <Stroke order={0} d="M52 74 C 52 40, 108 40, 108 74 C 108 98, 80 100, 80 124" />
        <Dot order={3} cx={80} cy={146} r={4} fill="currentColor" />
      </g>
      <Stroke order={4} weight="fine" stroke={MUTED} strokeDasharray="2 8" d={path} />
      <Travel d={path} duration={7} shape="dot" />
      <Surface order={8} d="M340 150 m-18 0 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0" />
      <Stroke order={8} stroke={ACCENT} d="M340 150 m-18 0 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0" />
      <Pulse cx={340} cy={150} r={18} delay={0.2} />
      <Dot order={10} cx={340} cy={150} r={6} />
    </Illustration>
  );
}

/**
 * Practice: three screens joined by one journey. In the loop a blue dot
 * walks the journey from screen to screen while the screens drift gently,
 * and the final action ripples: design across the whole experience.
 */
export function JourneyScreens({label, maxWidth = 560}: SceneProps) {
  const screens = [
    {x: 20, y: 60},
    {x: 185, y: 30},
    {x: 350, y: 60},
  ];
  const screen = (x: number, y: number) =>
    `M${x + 12} ${y} h86 a12 12 0 0 1 12 12 v126 a12 12 0 0 1 -12 12 h-86 a12 12 0 0 1 -12 -12 v-126 a12 12 0 0 1 12 -12 Z`;
  const journey = 'M75 176 C 120 236, 200 210, 240 146 S 360 120, 405 176';
  return (
    <Illustration viewBox="0 0 480 260" label={label} maxWidth={maxWidth}>
      <Stroke order={4} weight="fine" stroke={MUTED} strokeDasharray="3 7" d={journey} />
      <Travel d={journey} duration={8} shape="dot" />
      {screens.map((s, index) => {
        const isLast = index === screens.length - 1;
        return (
          <g
            key={s.x}
            className="ill-loop ill-float"
            style={{animationDelay: `${-index * 2.4}s`, ['--float' as string]: '6px'}}>
            <Surface order={index} d={screen(s.x, s.y)} />
            <Stroke order={index} d={screen(s.x, s.y)} />
            <Stroke
              order={index + 2}
              weight="fine"
              stroke={MUTED}
              d={`M${s.x + 18} ${s.y + 26} h50 M${s.x + 18} ${s.y + 44} h74 M${s.x + 18} ${s.y + 58} h60`}
            />
            <Stroke
              order={index + 3}
              stroke={isLast ? ACCENT : undefined}
              d={`M${s.x + 30} ${s.y + 108} h50 a8 8 0 0 1 0 16 h-50 a8 8 0 0 1 0 -16 Z`}
            />
            {isLast && <Pulse cx={s.x + 55} cy={s.y + 116} r={10} delay={0.4} />}
          </g>
        );
      })}
    </Illustration>
  );
}

/**
 * Studio: one point with ideas in orbit around it. In the loop the rings
 * turn at different speeds while the centre breathes: a small studio with
 * a lot of curiosity.
 */
export function OriginRings({label, maxWidth = 420}: SceneProps) {
  const rings = [
    {r: 44, duration: 14, shape: `M${200 - 6} ${150 - 44 - 6} h12 v12 h-12 Z`},
    {r: 84, duration: 20, shape: `M200 ${150 - 84 - 8} l8 13 h-16 Z`},
    {r: 124, duration: 28, shape: `M${200 - 7} ${150 - 124} a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0`},
  ];
  return (
    <Illustration viewBox="0 0 400 300" label={label} maxWidth={maxWidth}>
      {rings.map((ring, index) => (
        <g key={ring.r}>
          <Stroke
            order={index}
            weight="fine"
            stroke={MUTED}
            strokeDasharray={index === 1 ? '2 8' : undefined}
            d={`M${200 - ring.r} 150 a${ring.r} ${ring.r} 0 1 0 ${ring.r * 2} 0 a${ring.r} ${ring.r} 0 1 0 ${-ring.r * 2} 0`}
          />
          <g
            className="ill-loop ill-orbit"
            style={{
              animationDuration: `${ring.duration}s`,
              animationDirection: index === 1 ? 'reverse' : 'normal',
            }}>
            <Surface order={4 + index} d={ring.shape} />
            <Stroke order={4 + index} d={ring.shape} />
          </g>
        </g>
      ))}
      <Pulse cx={200} cy={150} r={10} />
      <Pulse cx={200} cy={150} r={10} delay={1.5} />
      <Dot order={8} cx={200} cy={150} r={8} />
    </Illustration>
  );
}

/**
 * Start a Project: a conversation. Your note on the left; on the right
 * A reply is being typed. In the loop the bubbles drift and the dots type.
 */
export function Conversation({label, maxWidth = 460}: SceneProps) {
  const left =
    'M40 40 h170 a16 16 0 0 1 16 16 v62 a16 16 0 0 1 -16 16 h-130 l-26 22 v-22 h-14 a16 16 0 0 1 -16 -16 v-62 a16 16 0 0 1 16 -16 Z';
  const right =
    'M200 150 h164 a16 16 0 0 1 16 16 v50 a16 16 0 0 1 -16 16 h-14 v22 l-26 -22 h-124 a16 16 0 0 1 -16 -16 v-50 a16 16 0 0 1 16 -16 Z';
  return (
    <Illustration viewBox="0 0 420 270" label={label} maxWidth={maxWidth}>
      <g className="ill-loop ill-float" style={{['--float' as string]: '5px'}}>
        <Surface order={0} d={left} />
        <Stroke order={0} d={left} />
        <Stroke order={2} weight="fine" stroke={MUTED} d="M48 68 h140 M48 88 h110 M48 108 h126" />
      </g>
      <g
        className="ill-loop ill-float"
        style={{animationDelay: '-4s', ['--float' as string]: '5px'}}>
        <Surface order={3} d={right} />
        <Stroke order={3} stroke={ACCENT} d={right} />
        {[0, 1, 2].map(dot => (
          <circle
            key={dot}
            className="ill-loop ill-typing"
            cx={258 + dot * 22}
            cy={191}
            r={5}
            fill={ACCENT}
            style={{animationDelay: `${dot * 0.3}s`}}
          />
        ))}
      </g>
    </Illustration>
  );
}

/**
 * Start a project: a first conversation. You on the left say hello, a dotted
 * line reaches across to the right, and a reply is on its way.
 * In the loop a message travels the line, the reply types and the hello
 * floats.
 */
export function FirstConversation({label, maxWidth = 420}: SceneProps) {
  const avatar = (cx: number, cy: number) =>
    `M${cx - 28} ${cy} a28 28 0 1 0 56 0 a28 28 0 1 0 -56 0`;
  const head = (cx: number, cy: number) => `M${cx - 8} ${cy - 7} a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0`;
  const shoulders = (cx: number, cy: number) => `M${cx - 14} ${cy + 18} a14 12 0 0 1 28 0`;
  const line = 'M108 190 C 180 190, 220 80, 292 80';
  const hello =
    'M46 70 h108 a14 14 0 0 1 14 14 v32 a14 14 0 0 1 -14 14 h-62 l-16 16 v-16 h-30 a14 14 0 0 1 -14 -14 v-32 a14 14 0 0 1 14 -14 Z';
  const reply =
    'M254 140 h52 l16 -16 v16 h34 a14 14 0 0 1 14 14 v24 a14 14 0 0 1 -14 14 h-102 a14 14 0 0 1 -14 -14 v-24 a14 14 0 0 1 14 -14 Z';
  return (
    <Illustration viewBox="0 0 400 240" label={label} maxWidth={maxWidth}>
      {/* You */}
      <Surface order={0} d={avatar(80, 190)} />
      <Stroke order={0} d={avatar(80, 190)} />
      <Stroke order={0} d={head(80, 190)} />
      <Stroke order={0} d={shoulders(80, 190)} />
      {/* The hello */}
      <g className="ill-loop ill-float" style={{['--float' as string]: '4px'}}>
        <Surface order={1} d={hello} />
        <Stroke order={1} d={hello} />
        <Stroke order={2} weight="fine" stroke={MUTED} d="M50 92 h84 M50 108 h56" />
      </g>
      {/* The line reaching across, a message travelling it */}
      <Stroke order={2} weight="fine" stroke={MUTED} strokeDasharray="2 6" d={line} />
      <Travel d={line} duration={6} shape="dot" thickness={7} />
      {/* Reply */}
      <Pulse cx={320} cy={80} r={28} delay={1} />
      <Surface order={3} d={avatar(320, 80)} />
      <Stroke order={3} stroke={ACCENT} d={avatar(320, 80)} />
      <Stroke order={3} stroke={ACCENT} d={head(320, 80)} />
      <Stroke order={3} stroke={ACCENT} d={shoulders(320, 80)} />
      {/* The reply, typing */}
      <g
        className="ill-loop ill-float"
        style={{animationDelay: '-3s', ['--float' as string]: '4px'}}>
        <Surface order={4} d={reply} />
        <Stroke order={4} stroke={ACCENT} d={reply} />
        {[0, 1, 2].map(dot => (
          <circle
            key={dot}
            className="ill-loop ill-typing"
            cx={280 + dot * 25}
            cy={166}
            r={5}
            fill={ACCENT}
            style={{animationDelay: `${dot * 0.3}s`}}
          />
        ))}
      </g>
    </Illustration>
  );
}

/**
 * The portrait: Ravi's photo, cut out and mapped through the brand blues
 * (public/ravi-portrait.webp), on the dot grid in front of a fine blue
 * ring. The photo fades out at the bottom; in the loop a comet circles the
 * ring.
 */
export function Portrait({label, maxWidth = 360}: SceneProps) {
  const fadeId = useId();
  const ring = 'M35 140 a115 115 0 1 0 230 0 a115 115 0 1 0 -230 0';
  return (
    <Illustration viewBox="0 0 300 321" label={label} maxWidth={maxWidth}>
      <defs>
        <linearGradient id={`${fadeId}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.78" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <mask id={fadeId}>
          <rect width="300" height="321" fill={`url(#${fadeId}-g)`} />
        </mask>
      </defs>
      <Stroke order={0} weight="fine" stroke={ACCENT} d={ring} />
      <Travel d={ring} duration={20} thickness={2.5} />
      <motion.image
        href="/ravi-portrait.webp"
        width={300}
        height={321}
        mask={`url(#${fadeId})`}
        variants={{
          off: {opacity: 0},
          on: {opacity: 1, transition: {duration: 1.2, delay: 0.2}},
        }}
      />
    </Illustration>
  );
}

/**
 * Privacy: your details, kept safe. A shield with a blue lock inside a dashed
 * boundary. In the loop a comet circles the boundary, the lock floats gently
 * and the keyhole pulses.
 */
export function PrivacyShield({label, maxWidth = 380}: SceneProps) {
  const ring = 'M90 150 a110 110 0 1 0 220 0 a110 110 0 1 0 -220 0';
  const shield =
    'M200 62 C 228 78, 256 84, 282 84 V 150 C 282 196, 246 226, 200 242 C 154 226, 118 196, 118 150 V 84 C 144 84, 172 78, 200 62 Z';
  const lock =
    'M182 140 h36 a6 6 0 0 1 6 6 v28 a6 6 0 0 1 -6 6 h-36 a6 6 0 0 1 -6 -6 v-28 a6 6 0 0 1 6 -6 Z';
  return (
    <Illustration viewBox="0 0 400 300" label={label} maxWidth={maxWidth}>
      <Stroke order={0} weight="fine" stroke={MUTED} strokeDasharray="2 6" d={ring} />
      <Travel d={ring} duration={16} thickness={2.5} />
      <Surface order={1} d={shield} />
      <Stroke order={1} d={shield} />
      <Stroke order={2} weight="fine" stroke={MUTED} d="M200 78 C 222 90, 244 96, 266 97" />
      <g className="ill-loop ill-float" style={{['--float' as string]: '4px'}}>
        <Surface order={3} d={lock} />
        <Stroke order={3} stroke={ACCENT} d="M188 140 V 128 a12 12 0 0 1 24 0 V 140" />
        <Stroke order={3} stroke={ACCENT} d={lock} />
        <Pulse cx={200} cy={156} r={4} delay={0.6} />
        <Dot order={4} cx={200} cy={156} r={4} />
        <Stroke order={4} stroke={ACCENT} d="M200 160 v8" />
      </g>
    </Illustration>
  );
}

/**
 * Terms: an agreement, plainly kept. A document with a short checklist, two
 * items ticked in blue, and a signature being written. In the loop a pulse
 * runs along the signature and the pen floats.
 */
export function TermsDocument({label, maxWidth = 380}: SceneProps) {
  const back =
    'M160 52 h150 a10 10 0 0 1 10 10 v190 a10 10 0 0 1 -10 10 h-150 a10 10 0 0 1 -10 -10 v-190 a10 10 0 0 1 10 -10 Z';
  const front =
    'M130 40 h150 a10 10 0 0 1 10 10 v200 a10 10 0 0 1 -10 10 h-150 a10 10 0 0 1 -10 -10 v-200 a10 10 0 0 1 10 -10 Z';
  const box = (y: number) =>
    `M144 ${y - 8} h12 a2 2 0 0 1 2 2 v12 a2 2 0 0 1 -2 2 h-12 a2 2 0 0 1 -2 -2 v-12 a2 2 0 0 1 2 -2 Z`;
  const signature = 'M142 222 C 152 204, 162 236, 174 218 S 192 206, 200 222 S 222 226, 238 212';
  return (
    <Illustration viewBox="0 0 400 300" label={label} maxWidth={maxWidth}>
      <Surface order={0} d={back} />
      <Stroke order={0} weight="fine" stroke={MUTED} d={back} />
      <Surface order={1} d={front} />
      <Stroke order={1} d={front} />
      <Stroke order={2} d="M142 68 h80" />
      <Stroke order={2} weight="fine" stroke={MUTED} d="M142 84 h126" />
      {[112, 140, 168].map((y, index) => (
        <g key={y}>
          <Stroke order={3} stroke={index < 2 ? ACCENT : undefined} d={box(y)} />
          {index < 2 && <Stroke order={4} stroke={ACCENT} d={`M146 ${y} l3 3 l6 -7`} />}
          <Stroke
            order={3}
            weight="fine"
            stroke={MUTED}
            d={`M168 ${y} h${index === 1 ? 70 : 96}`}
          />
        </g>
      ))}
      <Stroke order={4} weight="fine" stroke={MUTED} d="M142 238 h126" />
      <Stroke order={5} stroke={ACCENT} d={signature} />
      <Travel d={signature} duration={6} thickness={2.5} />
      <g className="ill-loop ill-float" style={{['--float' as string]: '5px'}}>
        <Stroke
          order={6}
          d="M242 208 L 266 172 L 274 178 L 250 214 Z M242 208 L 238 220 L 250 214"
        />
      </g>
    </Illustration>
  );
}

/**
 * Questions, answered: a question on the left, a short answer on the right
 * and a dotted line between them. In the loop the question floats and
 * pulses, and a dot carries it along the line to the answer.
 */
export function FaqQuestion({label, maxWidth = 340}: SceneProps) {
  const question = 'M66 120 a44 44 0 1 0 88 0 a44 44 0 1 0 -88 0';
  const answer =
    'M248 88 h76 a12 12 0 0 1 12 12 v40 a12 12 0 0 1 -12 12 h-76 a12 12 0 0 1 -12 -12 v-40 a12 12 0 0 1 12 -12 Z';
  const line = 'M160 120 H 230';
  return (
    <Illustration viewBox="0 0 400 240" label={label} maxWidth={maxWidth}>
      <g className="ill-loop ill-float" style={{['--float' as string]: '4px'}}>
        <Pulse cx={110} cy={120} r={44} delay={1} />
        <Surface order={0} d={question} />
        <Stroke order={0} d={question} />
        <Stroke order={1} stroke={ACCENT} strokeWidth={3} d="M98 108 a12 12 0 1 1 15 12 v9" />
        <Dot order={2} cx={113} cy={142} r={3} />
      </g>
      <Stroke order={2} weight="fine" stroke={MUTED} strokeDasharray="2 6" d={line} />
      <Travel d={line} duration={4} shape="dot" thickness={6} />
      <Surface order={3} d={answer} />
      <Stroke order={3} stroke={ACCENT} d={answer} />
      <Stroke order={4} d="M254 112 h64" />
      <Stroke order={4} weight="fine" stroke={MUTED} d="M254 128 h44" />
    </Illustration>
  );
}

/**
 * Hero: making sense of it. Loose interface pieces float scattered and
 * tilted on the left; an empty card frame waits on the right. In the loop the
 * pieces glide one by one into place and settle into a clear card (its one
 * action in brand blue), hold, then drift apart again. Each piece is drawn
 * at its settled position; .ill-assemble moves it out by --dx/--dy/--rot.
 * With reduced motion the settled card is all that shows.
 */
export function SenseMaking({label, maxWidth = 560}: SceneProps) {
  const r = (x: number, y: number, w: number, h: number, rad: number) =>
    `M${x + rad} ${y} h${w - 2 * rad} a${rad} ${rad} 0 0 1 ${rad} ${rad} v${h - 2 * rad} a${rad} ${rad} 0 0 1 -${rad} ${rad} h-${w - 2 * rad} a${rad} ${rad} 0 0 1 -${rad} -${rad} v-${h - 2 * rad} a${rad} ${rad} 0 0 1 ${rad} -${rad} Z`;
  const frame = r(276, 46, 212, 208, 16);
  const pieces: {
    d: string;
    dx: number;
    dy: number;
    rot: number;
    isAccent?: boolean;
    isFilled?: boolean;
  }[] = [
    {d: 'M288 90 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0', dx: -236, dy: 52, rot: -18},
    {d: r(326, 80, 104, 12, 6), dx: -250, dy: -34, rot: 24},
    {d: r(326, 100, 64, 8, 4), dx: -190, dy: 118, rot: -32},
    {d: r(292, 124, 180, 54, 10), dx: -232, dy: 22, rot: 10},
    {d: r(292, 190, 52, 18, 9), dx: -170, dy: -86, rot: 38},
    {d: r(352, 190, 64, 18, 9), dx: -276, dy: 96, rot: -46},
    {d: r(400, 220, 72, 22, 11), dx: -210, dy: -150, rot: 16, isAccent: true, isFilled: true},
  ];
  return (
    <Illustration viewBox="0 0 520 300" label={label} maxWidth={maxWidth}>
      <Stroke order={0} weight="fine" stroke={MUTED} d={frame} />
      {pieces.map((piece, index) => (
        <g
          key={piece.d}
          className="ill-loop ill-assemble"
          style={
            {
              '--dx': `${piece.dx}px`,
              '--dy': `${piece.dy}px`,
              '--rot': `${piece.rot}deg`,
              animationDelay: `${index * 0.28}s`,
            } as CSSProperties
          }>
          {piece.isFilled ? (
            <Surface order={1 + index} d={piece.d} fill={ACCENT} fillOpacity={0.9} />
          ) : (
            <Surface order={1 + index} d={piece.d} />
          )}
          <Stroke order={1 + index} stroke={piece.isAccent ? ACCENT : undefined} d={piece.d} />
        </g>
      ))}
    </Illustration>
  );
}

/**
 * 404: the missing page, in as few lines as possible. A page, a line running
 * from it that breaks off, and a dashed empty page with a question mark. In
 * the loop a comet runs the line and stops at the break, and the empty page
 * floats.
 */
export function MissingPage({label, maxWidth = 420}: SceneProps) {
  const page =
    'M40 40 h70 a10 10 0 0 1 10 10 v80 a10 10 0 0 1 -10 10 h-70 a10 10 0 0 1 -10 -10 v-80 a10 10 0 0 1 10 -10 Z';
  const missing =
    'M260 40 h70 a10 10 0 0 1 10 10 v80 a10 10 0 0 1 -10 10 h-70 a10 10 0 0 1 -10 -10 v-80 a10 10 0 0 1 10 -10 Z';
  const line = 'M120 90 H 196';
  return (
    <Illustration viewBox="0 0 380 180" label={label} maxWidth={maxWidth}>
      <Surface order={0} d={page} />
      <Stroke order={0} d={page} />
      {/* The page's structure: a title, two lines of text and its action */}
      <Stroke order={1} d="M46 60 h40" />
      <Stroke order={1} weight="fine" stroke={MUTED} d="M46 76 h58 M46 88 h46" />
      <Stroke
        order={2}
        stroke={ACCENT}
        d="M51 110 h22 a5 5 0 0 1 5 5 a5 5 0 0 1 -5 5 h-22 a5 5 0 0 1 -5 -5 a5 5 0 0 1 5 -5 Z"
      />
      <Stroke order={1} weight="fine" stroke={MUTED} d={line} />
      <Travel d={line} duration={3.5} thickness={2.5} />
      {/* Plain paths: the draw-in would override the dash pattern. */}
      <path
        d="M206 90 H 244"
        fill="none"
        stroke={MUTED}
        strokeWidth={1}
        strokeLinecap="round"
        strokeDasharray="2 6"
      />
      <g className="ill-loop ill-float" style={{['--float' as string]: '5px'}}>
        <path
          d={missing}
          fill="none"
          stroke={ACCENT}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="5 6"
        />
        <Stroke order={4} stroke={ACCENT} strokeWidth={3} d="M288 78 a12 12 0 1 1 15 12 v8" />
        <Dot order={5} cx={303} cy={114} r={3} />
      </g>
    </Illustration>
  );
}
