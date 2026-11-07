"""
Builds the hero's design-story animation as a Lottie file:
src/components/illustrations/lottie/design-story.json

    python3 scripts/lottie/design-story.py

(needs fontTools for the "Ravi" name tag: pip install fonttools)

The story, 12 seconds at 30fps, looping:
  1. Ravi's cursor (a Figma-style multiplayer cursor) arrives on the dot grid.
  2. It drags out a design frame from the top left corner.
  3. Five ideas for the app pop up around it (who it's for, the idea, a
     wireframe, components, a tap).
  4. The cursor visits each one, selecting it.
  5. The ideas fall into one tidy row, joined by a line.
  6. The cursor builds a simple mobile app on the frame: the phone, a
     header, a banner card and two list rows. It taps the banner's button.
  7. A short hold, then everything fades and it starts again.

Drawn in the site's illustration language: monoline line art (1.75 for the
subject, 1 for supporting lines, round caps), a soft surface, one brand-blue
accent (the cursor and its selection). The dot grid is the container's CSS
background, not part of the file.

Colours are placeholders that the site's CSS maps onto theme tokens, so the
animation follows light and dark mode (.design-story-lottie in globals.css):
  rgb(1,2,3)    ink      -> --color-text-primary
  rgb(4,5,6)    muted    -> --color-text-secondary
  rgb(7,8,9)    accent   -> --color-brand (the cursor) / --color-brand-text
  rgb(10,11,12) surface  -> --color-background-surface
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'src/components/illustrations/lottie/design-story.json'

W, H, FR, OP = 400, 420, 30, 360


def color(r, g, b):
    # lottie-web writes floor(k * 255); the +0.5 keeps each channel exact.
    return [(r + 0.5) / 255, (g + 0.5) / 255, (b + 0.5) / 255, 1]


INK = color(1, 2, 3)
MUTED = color(4, 5, 6)
ACCENT = color(7, 8, 9)
SURFACE = color(10, 11, 12)
WHITE = [1, 1, 1, 1]

# Cubic easing handles: (out x, out y, in x, in y).
EASES = {
    'inout': (0.65, 0, 0.35, 1),
    'out': (0.16, 1, 0.3, 1),
    'in': (0.7, 0, 0.84, 0),
    'back': (0.34, 1.56, 0.64, 1),
    'linear': (0, 0, 1, 1),
}


def static(v):
    return {'a': 0, 'k': v}


def anim(frames):
    """frames: [(t, value, ease?), ...]; ease 'hold' jumps to the next value."""
    keys = []
    for index, frame in enumerate(frames):
        t, v = frame[0], frame[1]
        ease = frame[2] if len(frame) > 2 else 'inout'
        v = v if isinstance(v, list) else [v]
        key = {'t': t, 's': v}
        if index < len(frames) - 1:
            if ease == 'hold':
                key['h'] = 1
            else:
                ox, oy, ix, iy = EASES[ease]
                n = len(v)
                key['o'] = {'x': [ox] * n, 'y': [oy] * n}
                key['i'] = {'x': [ix] * n, 'y': [iy] * n}
        keys.append(key)
    return {'a': 1, 'k': keys}


def prop(v):
    return anim(v) if isinstance(v, list) and v and isinstance(v[0], tuple) else static(v)


# ---------- shapes ----------


def rect(cx, cy, w, h, r=0):
    return {'ty': 'rc', 'd': 1, 'p': static([cx, cy]), 's': static([w, h]), 'r': static(r)}


def ellipse(cx, cy, d):
    return {'ty': 'el', 'd': 1, 'p': static([cx, cy]), 's': static([d, d])}


def path(points, closed=False, ins=None, outs=None):
    n = len(points)
    return {
        'ty': 'sh',
        'ks': static({
            'i': ins or [[0, 0]] * n,
            'o': outs or [[0, 0]] * n,
            'v': [list(p) for p in points],
            'c': closed,
        }),
    }


def stroke(c, w=1.75, opacity=100):
    return {'ty': 'st', 'c': static(c), 'o': static(opacity), 'w': static(w), 'lc': 2, 'lj': 2, 'ml': 4}


def fill(c, opacity=100):
    return {'ty': 'fl', 'c': static(c), 'o': static(opacity), 'r': 1}


def trim(end):
    """end: 0..100, static or keyframes (draws the line on)."""
    return {'ty': 'tm', 's': static(0), 'e': prop(end), 'o': static(0), 'm': 1}


def transform(p=(0, 0), a=(0, 0), s=100, r=0, o=100):
    return {
        'ty': 'tr',
        'p': prop(list(p) if isinstance(p, tuple) else p),
        'a': static(list(a)),
        's': prop([s, s] if isinstance(s, (int, float)) else s),
        'r': prop(r),
        'o': prop(o),
    }


def group(name, items, tr=None):
    return {'ty': 'gr', 'nm': name, 'it': items + [tr or transform()]}


def draw(start, end, ease='inout'):
    """Trim keyframes that draw a line on between two frames."""
    return [(0, 0, 'hold'), (start, 0, ease), (end, 100)]


# ---------- layers ----------

LAYERS = []

#: Every layer fades out together at the end of the loop.
FADE = [(0, 100, 'hold'), (330, 100), (346, 0, 'hold'), (OP, 0)]


def layer(name, shapes, ks=None):
    ks = ks or {}
    LAYERS.append({
        'ddd': 0,
        'ind': len(LAYERS) + 1,
        'ty': 4,
        'nm': name,
        'sr': 1,
        'ks': {
            'o': prop(ks.get('o', FADE)),
            'r': prop(ks.get('r', 0)),
            'p': prop(ks.get('p', [0, 0, 0])),
            'a': prop(ks.get('a', [0, 0, 0])),
            's': prop(ks.get('s', [100, 100, 100])),
        },
        'ao': 0,
        'shapes': shapes,
        'ip': 0,
        'op': OP,
        'st': 0,
        'bm': 0,
    })


# ---------- the "Ravi" name tag, as outlines ----------


def text_outline(text, size, x, baseline):
    """The text as Lottie paths (Arial Bold outlines), and its width."""
    from fontTools.pens.basePen import BasePen
    from fontTools.ttLib import TTFont

    font = TTFont('/System/Library/Fonts/Supplemental/Arial Bold.ttf')
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    scale = size / font['head'].unitsPerEm
    shapes = []

    class LottiePen(BasePen):
        def __init__(self, offset):
            super().__init__(glyphs)
            self.offset = offset
            self.contours = []

        def pt(self, p):
            return [x + (self.offset + p[0]) * scale, baseline - p[1] * scale]

        def _moveTo(self, p):
            self.contours.append({'v': [self.pt(p)], 'i': [[0, 0]], 'o': [[0, 0]]})

        def _lineTo(self, p):
            c = self.contours[-1]
            c['v'].append(self.pt(p))
            c['i'].append([0, 0])
            c['o'].append([0, 0])

        def _curveToOne(self, p1, p2, p3):
            c = self.contours[-1]
            prev = c['v'][-1]
            a, b, end = self.pt(p1), self.pt(p2), self.pt(p3)
            c['o'][-1] = [a[0] - prev[0], a[1] - prev[1]]
            c['v'].append(end)
            c['i'].append([b[0] - end[0], b[1] - end[1]])
            c['o'].append([0, 0])

        def _closePath(self):
            c = self.contours[-1]
            if len(c['v']) > 1 and all(abs(m - n) < 1e-6 for m, n in zip(c['v'][0], c['v'][-1])):
                c['i'][0] = c['i'][-1]
                for key in ('v', 'i', 'o'):
                    c[key].pop()

    advance = 0
    for char in text:
        name = cmap[ord(char)]
        pen = LottiePen(advance)
        glyphs[name].draw(pen)
        for c in pen.contours:
            shapes.append(path(c['v'], closed=True, ins=c['i'], outs=c['o']))
        advance += font['hmtx'][name][0]
    return shapes, advance * scale


# ---------- the story ----------

FRAME = {'x': 70, 'y': 80, 'w': 260, 'h': 300}
NOTE = {'w': 40, 'h': 30}

# Ideas: centre in the scattered phase (with a tilt), then in the tidy row.
IDEAS = [
    {'name': 'people', 'from': (52, 128, -9), 'to': (108, 112)},
    {'name': 'idea', 'from': (346, 124, 7), 'to': (154, 112)},
    {'name': 'wireframe', 'from': (200, 212, -4), 'to': (200, 112)},
    {'name': 'components', 'from': (60, 290, 6), 'to': (246, 112)},
    {'name': 'tap', 'from': (340, 270, -6), 'to': (292, 112)},
]
POP = 96  # first idea pops up
VISIT = 142  # cursor reaches the first idea
STRUCTURE = (196, 222)


def idea_icon(name):
    """A small line-art icon, centred on (0, 0)."""
    if name == 'people':
        return [ellipse(0, -4, 7), path([(-6, 7), (-3.5, 2.5), (3.5, 2.5), (6, 7)])]
    if name == 'idea':
        return [ellipse(0, -2.5, 10), path([(-2.5, 5), (2.5, 5)]), path([(-1.5, 7.5), (1.5, 7.5)])]
    if name == 'wireframe':
        # A phone with a header line and a block.
        return [rect(0, 0, 11, 18, 2.5), path([(-2, -6), (2, -6)]), rect(0, 1, 6, 5, 1)]
    if name == 'components':
        return [rect(-3.5, -3.5, 6, 6, 1.5), rect(3.5, -3.5, 6, 6, 1.5), rect(-3.5, 3.5, 6, 6, 1.5), ellipse(3.5, 3.5, 6)]
    # tap: a touch point with its ripple
    return [ellipse(0, 1, 4), ellipse(0, 1, 11), path([(-6, -6), (-4.5, -4.5)]), path([(6, -6), (4.5, -4.5)]), path([(0, -8), (0, -6)])]


# 1. The frame, dragged out from its top left corner.
frame_shapes = [
    group('frame', [
        rect(FRAME['x'] + FRAME['w'] / 2, FRAME['y'] + FRAME['h'] / 2, FRAME['w'], FRAME['h'], 10),
        stroke(INK, 1, 55),
        fill(INK, 4),
    ]),
]
label_shapes = [
    group('frame label', [
        ellipse(73, 68, 3),
        path([(80, 68), (122, 68)]),
        trim(draw(86, 96)),
        stroke(MUTED, 1),
    ]),
]

# 2. The finished screen: a complete mobile app, built piece by piece inside
# the frame (listed top first).
PHONE = {'x': 130, 'y': 90, 'w': 140, 'h': 282}


def list_row(index, y, start):
    """A list row: an icon tile and one line of text."""
    return group(f'row {index + 1}', [
        group('tile', [rect(153, y, 16, 16, 4), trim(draw(start, start + 7)), stroke(INK, 1.25)]),
        group('title', [path([(168, y), (236, y)]), trim(draw(start + 3, start + 10)), stroke(MUTED, 1.75)]),
    ])


# Kept simple: the phone, a header, one banner card, two list rows.
ui = [
    # The device.
    group('phone', [
        rect(PHONE['x'] + PHONE['w'] / 2, PHONE['y'] + PHONE['h'] / 2, PHONE['w'], PHONE['h'], 20),
        trim(draw(234, 250)),
        stroke(INK, 1.75),
    ]),
    group('island', [rect(200, 101, 34, 8, 4), trim(draw(248, 255)), stroke(INK, 1.25)]),
    # Header: avatar and greeting.
    group('avatar', [ellipse(152, 128, 16), trim(draw(254, 263)), stroke(INK, 1.25)]),
    group('greeting', [path([(167, 128), (214, 128)]), trim(draw(257, 265)), stroke(INK, 2.5)]),
    # The banner card, with its button.
    group('banner surface', [rect(200, 182, 116, 60, 10), fill(INK, 5)],
          transform(o=[(0, 0, 'hold'), (266, 0), (276, 100)])),
    group('banner', [rect(200, 182, 116, 60, 10), trim(draw(264, 276)), stroke(INK, 1.5)]),
    group('banner title', [path([(152, 170), (214, 170)]), trim(draw(272, 280)), stroke(INK, 2.5)]),
    group('banner button', [
        group('pill', [rect(0, 0, 36, 13, 6.5), trim(draw(278, 287)), stroke(INK, 1.5)]),
        group('label', [path([(-9, 0), (9, 0)]), trim(draw(283, 289)), stroke(INK, 1.5)]),
    ], transform(p=(170, 196), s=[(0, [100, 100], 'hold'), (312, [100, 100]), (316, [90, 90]), (320, [100, 100])])),
    # Two list rows, and the home indicator.
    list_row(0, 238, 288),
    list_row(1, 266, 293),
    group('home indicator', [path([(182, 360), (218, 360)]), trim(draw(298, 306)), stroke(INK, 2)]),
]

# 3. The ideas: each pops up where it lands, is selected when the cursor
# reaches it, then moves into the row and fades as the screen begins.
notes = []
for index, idea in enumerate(IDEAS):
    fx, fy, fr = idea['from']
    tx, ty = idea['to']
    pop = POP + index * 6
    arrive = VISIT + index * 12
    s0, s1 = STRUCTURE
    note = group(idea['name'], [
        # Listed top first: the selection, the icon, then the card under them.
        group('selection', [rect(0, 0, NOTE['w'] + 8, NOTE['h'] + 8, 8), stroke(ACCENT, 1.25)],
              transform(o=[(0, 0, 'hold'), (arrive, 100, 'hold'), (s0 + 16, 100), (s0 + 22, 0)])),
        group('icon', idea_icon(idea['name']) + [stroke(INK, 1.25)]),
        group('card', [rect(0, 0, NOTE['w'], NOTE['h'], 6), stroke(INK, 1), fill(SURFACE)]),
    ], transform(
        p=[(0, [fx, fy], 'hold'), (s0 + index * 2, [fx, fy]), (s1 + index * 2, [tx, ty], 'hold'),
           (226 + index * 2, [tx, ty]), (236 + index * 2, [tx, ty - 6])],
        r=[(0, fr, 'hold'), (s0 + index * 2, fr), (s1 + index * 2, 0)],
        s=[(0, [0, 0], 'hold'), (pop, [0, 0], 'back'), (pop + 8, [100, 100])],
        o=[(0, 0, 'hold'), (pop, 0), (pop + 4, 100, 'hold'), (226 + index * 2, 100), (236 + index * 2, 0)],
    ))
    notes.append(note)

connector = [group('connector', [
    path([(88, 112), (312, 112)]),
    trim(draw(206, 224)),
    stroke(MUTED, 1),
], transform(o=[(0, 100, 'hold'), (226, 100), (236, 0)]))]

# 4. Ravi's cursor, in the Figma multiplayer style: a blue arrow with a
# white edge, and the name tag below and to the right of its tip.
name_shapes, name_width = text_outline('Ravi', 9, 0, 0)
tag_w = name_width + 12
cursor_shapes = [
    # Listed top first: the arrow over its tag, the label over the tag body.
    group('arrow', [
        path([(0, 0), (16.5, 6.2), (8.8, 8.8), (6.2, 16.5)], closed=True),
        stroke(WHITE, 1.5),
        fill(ACCENT),
    ]),
    group('tag', [
        group('tag label', name_shapes + [fill(WHITE)], transform(p=(20, 30.5))),
        group('tag body', [rect(14 + tag_w / 2, 27, tag_w, 17, 4), fill(ACCENT)]),
    ]),
]
# Where the tip goes, in order.
cursor_path = [
    (0, [430, 410], 'hold'),
    (8, [430, 410], 'out'),
    (38, [226, 232]),
    (40, [226, 232]),
    (52, [70, 80], 'hold'),
    (56, [70, 80]),
    (86, [330, 380]),
    (124, [330, 380]),
]
for index, idea in enumerate(IDEAS):
    fx, fy, _ = idea['from']
    arrive = VISIT + index * 12
    cursor_path += [(arrive - 10, cursor_path[-1][1]), (arrive, [fx + 8, fy + 6])]
cursor_path += [
    (196, cursor_path[-1][1]),
    (222, [300, 150]),
    (226, [300, 150]),
    (234, [PHONE['x'], PHONE['y']], 'hold'),
    (236, [PHONE['x'], PHONE['y']]),
    (250, [PHONE['x'] + PHONE['w'], PHONE['y'] + PHONE['h']]),
    (252, [PHONE['x'] + PHONE['w'], PHONE['y'] + PHONE['h']]),
    (264, [218, 132]),
    (266, [218, 132]),
    (278, [258, 212]),
    (280, [258, 212]),
    (296, [240, 270]),
    (298, [240, 270]),
    # The last move: a tap on the banner's button.
    (312, [176, 199], 'hold'),
    (330, [176, 199], 'in'),
    (352, [430, 410]),
]
# Tidy the list: every key but the last gets an ease.
cursor_path = [k if len(k) == 3 else (k[0], k[1], 'inout') for k in cursor_path[:-1]] + [cursor_path[-1]]

# Layers, bottom to top.
layer('frame', frame_shapes, {
    'a': [FRAME['x'], FRAME['y'], 0],
    'p': [FRAME['x'], FRAME['y'], 0],
    's': [(0, [0, 0, 100], 'hold'), (56, [0, 0, 100]), (86, [100, 100, 100])],
})
layer('frame label', label_shapes)
layer('screen', ui)
layer('connector', connector)
layer('ideas', notes)
layer('cursor', cursor_shapes, {'p': [(t, v + [0], *e) for t, v, *e in cursor_path]})

LAYERS.reverse()  # Lottie draws the first layer on top.
for index, item in enumerate(LAYERS):
    item['ind'] = index + 1

animation = {
    'v': '5.12.0',
    'fr': FR,
    'ip': 0,
    'op': OP,
    'w': W,
    'h': H,
    'nm': 'Design story',
    'ddd': 0,
    'assets': [],
    'layers': LAYERS,
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(animation, separators=(',', ':')))
print(f'wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.1f} KB)')
