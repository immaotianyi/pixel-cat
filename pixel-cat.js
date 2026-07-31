/* ============================================
   PIXEL CAT v2.0 — Golden Chinchilla Edition
   8-bit Interactive Pixel Cat Component
   License: MIT
   ============================================
   NEW in v2.0:
   - Golden Chinchilla British Shorthair design
   - 5 skin themes: golden / orange / black / white / calico / gray
   - Body-part click detection (head/tail/belly/ears/cheeks)
   - Mood & affection system with event callbacks
   - New states: lick, yawn, stretch, puffed, nuzzle, sit, blink-slow
   - Fish snack feeding
   - Draggable (desktop pet mode)
   - Accessories: bell, bowtie, glasses, crown
   - Sleeping Zzz particles
   - Enhanced eye tracking with pupil dilation
   ============================================ */

(function (global) {
  'use strict';

  /* ========================================
     COLOR PALETTES (SKIN SYSTEM)
     ======================================== */

  var SKINS = {
    golden: {
      name: '金渐层',
      nameEn: 'Golden Chinchilla',
      outline:  '#2a1a0e',
      dark:     '#6b4423',  // dark tipping
      mid:      '#c8944a',  // golden main
      light:    '#e0ba6e',  // light gold
      pale:     '#f0d89a',  // cream gold
      cream:    '#f8ecc8',  // near-white cream
      white:    '#fdf6e3',  // white (chest/paws)
      eyeOut:   '#1a4a2e',  // dark green
      eyeMid:   '#2d8f52',  // emerald
      eyeIn:    '#5cc47a',  // light emerald
      eyeHi:    '#a8f0c0',  // eye highlight
      nose:     '#c47a5a',  // pink-brown nose
      noseLine: '#8b4a30',  // nose outline
      cheek:    '#e89090',  // blush
      innerEar: '#f0a8a8',  // pink inner ear
      pawPad:   '#8b4a30',  // dark paw pads
      collar:   '#c42a2a',  // red collar
      bell:     '#ffd700',  // gold bell
      bellShine:'#fff8b0',
      tailRing: '#5c3d2e',  // dark tail rings
      mMark:    '#5c3d2e',  // forehead M mark
    },
    orange: {
      name: '橘猫',
      nameEn: 'Orange Tabby',
      outline:  '#5c2d0a',
      dark:     '#78350f',
      mid:      '#f59e0b',
      light:    '#fbbf24',
      pale:     '#fde68a',
      cream:    '#fef3c7',
      white:    '#fef9c3',
      eyeOut:   '#1a1a2e',
      eyeMid:   '#1a1a2e',
      eyeIn:    '#1a1a2e',
      eyeHi:    '#60a5fa',
      nose:     '#ec4899',
      noseLine: '#9d174d',
      cheek:    '#f9a8d4',
      innerEar: '#f472b6',
      pawPad:   '#78350f',
      collar:   '#7c3aed',
      bell:     '#fbbf24',
      bellShine:'#fef3c7',
      tailRing: '#78350f',
      mMark:    '#92400e',
    },
    black: {
      name: '黑猫',
      nameEn: 'Black Cat',
      outline:  '#0a0a0a',
      dark:     '#1a1a1a',
      mid:      '#2d2d2d',
      light:    '#404040',
      pale:     '#555555',
      cream:    '#6a6a6a',
      white:    '#e8e8e8',
      eyeOut:   '#0a0a0a',
      eyeMid:   '#fbbf24',
      eyeIn:    '#fde68a',
      eyeHi:    '#ffffff',
      nose:     '#6b4423',
      noseLine: '#3a2515',
      cheek:    '#c07070',
      innerEar: '#8b5a5a',
      pawPad:   '#3a2515',
      collar:   '#8b5cf6',
      bell:     '#c0c0c0',
      bellShine:'#ffffff',
      tailRing: '#0a0a0a',
      mMark:    '#404040',
    },
    white: {
      name: '白猫',
      nameEn: 'White Cat',
      outline:  '#a0a0b0',
      dark:     '#c0c0d0',
      mid:      '#e8e8f0',
      light:    '#f0f0f8',
      pale:     '#f8f8ff',
      cream:    '#ffffff',
      white:    '#ffffff',
      eyeOut:   '#1e3a5f',
      eyeMid:   '#3b82f6',
      eyeIn:    '#93c5fd',
      eyeHi:    '#dbeafe',
      nose:     '#f472b6',
      noseLine: '#db2777',
      cheek:    '#f9a8d4',
      innerEar: '#fbcfe8',
      pawPad:   '#ec4899',
      collar:   '#10b981',
      bell:     '#ffd700',
      bellShine:'#fff8b0',
      tailRing: '#d0d0e0',
      mMark:    '#d0d0e0',
    },
    calico: {
      name: '三花',
      nameEn: 'Calico',
      outline:  '#2a1a0e',
      dark:     '#5c2d0a',
      mid:      '#f59e0b',
      light:    '#fbbf24',
      pale:     '#fde68a',
      cream:    '#fef3c7',
      white:    '#ffffff',
      eyeOut:   '#1a1a2e',
      eyeMid:   '#1a1a2e',
      eyeIn:    '#1a1a2e',
      eyeHi:    '#60a5fa',
      nose:     '#ec4899',
      noseLine: '#9d174d',
      cheek:    '#f9a8d4',
      innerEar: '#f472b6',
      pawPad:   '#78350f',
      collar:   '#ef4444',
      bell:     '#ffd700',
      bellShine:'#fff8b0',
      tailRing: '#5c2d0a',
      mMark:    '#78350f',
    },
    gray: {
      name: '英短蓝猫',
      nameEn: 'British Blue',
      outline:  '#2a3540',
      dark:     '#4a5f75',
      mid:      '#7a94a8',
      light:    '#9bb0c4',
      pale:     '#b8c8d8',
      cream:    '#d0dde8',
      white:    '#e4ecf2',
      eyeOut:   '#5c3d00',
      eyeMid:   '#d97706',
      eyeIn:    '#fbbf24',
      eyeHi:    '#fef3c7',
      nose:     '#a07060',
      noseLine: '#6b4423',
      cheek:    '#d09090',
      innerEar: '#c08080',
      pawPad:   '#5c4030',
      collar:   '#7c3aed',
      bell:     '#ffd700',
      bellShine:'#fff8b0',
      tailRing: '#4a5f75',
      mMark:    '#5a6f85',
    }
  };

  /* ========================================
     SVG TEMPLATES
     ======================================== */

  // Helper: color a rect with skin palette
  function r(x, y, w, h, color, opacity) {
    var attrs = 'x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + color + '"';
    if (opacity !== undefined) attrs += ' opacity="' + opacity + '"';
    return '<rect ' + attrs + '/>';
  }

  // Build the golden chinchilla cat SVG with skin color variables
  function buildCatSVG(skin) {
    var s = SKINS[skin] || SKINS.golden;
    var svg = '<svg class="pixel-cat-svg" viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">';

    // Shadow
    svg += '<ellipse cx="70" cy="115" rx="40" ry="4" fill="#000" opacity="0.15"/>';

    // ===== TAIL (curled up, with ring markings) =====
    svg += '<g class="cat-tail">';
    // Tail base
    svg += r(105, 62, 6, 6, s.dark);
    svg += r(105, 68, 6, 6, s.mid);
    svg += r(111, 56, 6, 6, s.dark);
    svg += r(111, 62, 6, 6, s.mid);
    svg += r(111, 68, 6, 6, s.dark);
    svg += r(117, 50, 6, 6, s.dark);
    svg += r(117, 56, 6, 6, s.mid);
    svg += r(117, 62, 6, 6, s.light);
    svg += r(123, 44, 6, 6, s.dark);
    svg += r(123, 50, 6, 6, s.light);
    svg += r(123, 56, 6, 6, s.pale);
    svg += r(123, 38, 6, 6, s.dark);
    svg += r(129, 38, 6, 6, s.dark);
    svg += r(129, 44, 6, 6, s.dark);
    svg += r(129, 32, 6, 6, s.dark);
    // Tail tip (white for golden)
    svg += r(123, 38, 6, 4, s.pale);
    svg += r(129, 32, 4, 4, s.white);
    // Tail rings
    svg += r(111, 60, 6, 2, s.tailRing, 0.4);
    svg += r(117, 54, 6, 2, s.tailRing, 0.35);
    svg += r(123, 48, 6, 2, s.tailRing, 0.3);
    svg += '</g>';

    // ===== BODY (chubby British Shorthair) =====
    svg += '<g class="cat-body">';
    // Collar + bell (on top of body)
    svg += '<g class="cat-collar">';
    svg += r(38, 52, 64, 5, s.collar);
    svg += r(38, 52, 64, 2, s.dark, 0.3);
    // Bell
    svg += r(65, 55, 10, 8, s.bell);
    svg += r(66, 56, 8, 2, s.bellShine);
    svg += r(69, 62, 2, 3, s.dark, 0.5);
    svg += r(67, 57, 2, 2, s.bellShine, 0.7);
    svg += '</g>';

    // Body outline
    svg += r(18, 56, 6, 40, s.outline);
    svg += r(116, 56, 6, 40, s.outline);
    svg += r(24, 56, 92, 3, s.dark);
    // Body main fur
    svg += r(24, 59, 92, 37, s.mid);
    // Back fur gradient (tipping effect)
    svg += r(24, 59, 92, 4, s.dark, 0.3);
    svg += r(24, 63, 92, 3, s.light, 0.25);
    // Cream chest/bib
    svg += r(40, 62, 60, 28, s.cream, 0.5);
    svg += r(46, 66, 48, 20, s.white, 0.35);
    // Belly
    svg += r(52, 76, 36, 12, s.pale, 0.3);
    // White front paws
    svg += r(24, 92, 22, 7, s.white);
    svg += r(94, 92, 22, 7, s.white);
    // Paw outline
    svg += r(24, 92, 22, 2, s.outline, 0.2);
    svg += r(94, 92, 22, 2, s.outline, 0.2);
    // Toe beans
    svg += r(28, 95, 4, 3, s.pawPad, 0.6);
    svg += r(35, 95, 4, 3, s.pawPad, 0.6);
    svg += r(99, 95, 4, 3, s.pawPad, 0.6);
    svg += r(106, 95, 4, 3, s.pawPad, 0.6);
    // Back legs
    svg += r(24, 88, 20, 6, s.dark);
    svg += r(96, 88, 20, 6, s.dark);
    svg += r(24, 88, 20, 2, s.mid);
    svg += r(96, 88, 20, 2, s.mid);
    // White back paws
    svg += r(26, 94, 16, 4, s.white);
    svg += r(98, 94, 16, 4, s.white);
    // Fur texture (pixel dots)
    svg += r(30, 65, 3, 2, s.light, 0.2);
    svg += r(107, 65, 3, 2, s.light, 0.2);
    svg += r(35, 75, 2, 2, s.dark, 0.15);
    svg += r(103, 78, 2, 2, s.dark, 0.15);
    svg += '</g>';

    // ===== HEAD (round British Shorthair face) =====
    svg += '<g class="cat-head">';
    // Head top outline
    svg += r(12, 10, 116, 6, s.outline);
    // Cheeks (chubby!)
    svg += r(8, 16, 8, 40, s.outline);
    svg += r(124, 16, 8, 40, s.outline);
    svg += r(10, 52, 120, 5, s.outline);
    // Head main
    svg += r(16, 16, 108, 36, s.mid);
    // Head top gradient (tipping)
    svg += r(16, 16, 108, 5, s.dark, 0.35);
    svg += r(16, 21, 108, 3, s.light, 0.2);

    // ===== EARS =====
    // Left ear
    svg += '<g class="cat-ear-l">';
    svg += r(18, 0, 6, 5, s.outline);
    svg += r(24, 0, 8, 5, s.outline);
    svg += r(14, 5, 6, 6, s.outline);
    svg += r(20, 5, 8, 6, s.mid);
    svg += r(28, 5, 8, 6, s.mid);
    svg += r(36, 5, 6, 6, s.outline);
    svg += r(20, 5, 8, 2, s.light);
    svg += r(28, 5, 8, 2, s.light);
    // Inner ear
    svg += r(22, 7, 6, 4, s.innerEar, 0.5);
    svg += r(30, 7, 6, 4, s.innerEar, 0.5);
    svg += r(24, 6, 4, 2, s.innerEar, 0.3);
    // Ear tip highlight
    svg += r(22, 2, 5, 3, s.light, 0.3);
    svg += '</g>';

    // Right ear
    svg += '<g class="cat-ear-r">';
    svg += r(96, 0, 8, 5, s.outline);
    svg += r(104, 0, 6, 5, s.outline);
    svg += r(90, 5, 6, 6, s.outline);
    svg += r(96, 5, 8, 6, s.mid);
    svg += r(104, 5, 8, 6, s.mid);
    svg += r(112, 5, 6, 6, s.outline);
    svg += r(96, 5, 8, 2, s.light);
    svg += r(104, 5, 8, 2, s.light);
    svg += r(100, 7, 6, 4, s.innerEar, 0.5);
    svg += r(108, 7, 6, 4, s.innerEar, 0.5);
    svg += r(102, 6, 4, 2, s.innerEar, 0.3);
    svg += r(101, 2, 5, 3, s.light, 0.3);
    svg += '</g>';

    // Forehead M marking (tipped pattern)
    svg += r(50, 14, 4, 6, s.mMark, 0.25);
    svg += r(56, 12, 4, 8, s.mMark, 0.2);
    svg += r(62, 14, 4, 6, s.mMark, 0.15);
    svg += r(68, 12, 4, 8, s.mMark, 0.2);
    svg += r(74, 14, 4, 6, s.mMark, 0.15);
    svg += r(80, 12, 4, 8, s.mMark, 0.2);
    svg += r(86, 14, 4, 6, s.mMark, 0.25);

    // Cheeks (chubby!)
    svg += '<g class="cat-cheek-l">';
    svg += r(14, 30, 10, 18, s.light);
    svg += r(16, 35, 8, 10, s.pale);
    svg += '</g>';
    svg += '<g class="cat-cheek-r">';
    svg += r(116, 30, 10, 18, s.light);
    svg += r(116, 35, 8, 10, s.pale);
    svg += '</g>';

    // Blush
    svg += r(20, 36, 10, 5, s.cheek, 0.25);
    svg += r(110, 36, 10, 5, s.cheek, 0.25);

    // ===== EYES (emerald green for golden, round and big) =====
    svg += '<g class="eye-open">';
    // Left eye
    svg += '<g class="cat-eye-l">';
    svg += r(30, 24, 28, 20, s.outline);
    svg += r(32, 26, 24, 16, '#ffffff');
    // Iris
    svg += '<g class="cat-pupil-l">';
    svg += r(36, 28, 16, 12, s.eyeOut);
    svg += r(38, 30, 12, 8, s.eyeMid);
    svg += r(40, 31, 8, 6, s.eyeIn);
    // Pupil (vertical slit, dilates)
    svg += '<rect class="cat-pupil-slit-l" x="42" y="30" width="4" height="8" fill="#000"/>';
    // Eye highlight
    svg += r(39, 29, 4, 4, s.eyeHi, 0.8);
    svg += r(46, 33, 3, 3, '#ffffff', 0.9);
    svg += '</g>';
    svg += '</g>';
    // Right eye
    svg += '<g class="cat-eye-r">';
    svg += r(82, 24, 28, 20, s.outline);
    svg += r(84, 26, 24, 16, '#ffffff');
    svg += '<g class="cat-pupil-r">';
    svg += r(88, 28, 16, 12, s.eyeOut);
    svg += r(90, 30, 12, 8, s.eyeMid);
    svg += r(92, 31, 8, 6, s.eyeIn);
    svg += '<rect class="cat-pupil-slit-r" x="94" y="30" width="4" height="8" fill="#000"/>';
    svg += r(91, 29, 4, 4, s.eyeHi, 0.8);
    svg += r(98, 33, 3, 3, '#ffffff', 0.9);
    svg += '</g>';
    svg += '</g>';
    // Eye shine dots
    svg += r(35, 28, 3, 3, '#ffffff', 0.6);
    svg += r(87, 28, 3, 3, '#ffffff', 0.6);
    svg += '</g>';

    // Closed eyes (sleeping/blinking)
    svg += '<g class="eye-closed">';
    svg += r(32, 32, 24, 5, s.outline);
    svg += r(34, 32, 20, 3, s.mid);
    // ^ shaped closed eyes (happy sleep)
    svg += '<path d="M34,34 Q44,28 54,34" stroke="' + s.outline + '" stroke-width="2" fill="none"/>';
    svg += r(84, 32, 24, 5, s.outline);
    svg += r(86, 32, 20, 3, s.mid);
    svg += '<path d="M86,34 Q96,28 106,34" stroke="' + s.outline + '" stroke-width="2" fill="none"/>';
    svg += '</g>';

    // Yawning mouth (open)
    svg += '<g class="cat-mouth-yawn" style="display:none">';
    svg += r(60, 42, 20, 14, s.outline);
    svg += r(62, 44, 16, 10, '#c44040');
    svg += r(64, 46, 12, 6, '#e06060');
    svg += r(66, 44, 8, 4, '#ff8080');
    // Tongue
    svg += r(66, 50, 8, 5, '#f472b6');
    svg += r(67, 50, 6, 3, '#f9a8d4');
    // Teeth
    svg += r(63, 44, 2, 3, '#ffffff');
    svg += r(75, 44, 2, 3, '#ffffff');
    svg += '</g>';

    // ===== NOSE (pink-brown, brick shaped) =====
    svg += '<g class="cat-nose">';
    svg += r(62, 38, 16, 5, s.noseLine);
    svg += r(63, 39, 14, 4, s.nose);
    svg += r(65, 39, 10, 2, s.nose, 0.7);
    svg += r(66, 40, 8, 2, '#f0a090', 0.3);
    svg += '</g>';

    // Mouth line
    svg += '<g class="cat-mouth">';
    svg += r(69, 43, 2, 3, s.noseLine, 0.6);
    svg += '<path d="M60,46 Q70,52 80,46" stroke="' + s.noseLine + '" stroke-width="1.5" fill="none" opacity="0.5"/>';
    svg += '</g>';

    // Whiskers
    svg += '<g class="cat-whisker-l">';
    svg += r(0, 32, 12, 2, s.dark, 0.4);
    svg += r(0, 37, 14, 2, s.dark, 0.35);
    svg += r(2, 42, 12, 2, s.dark, 0.3);
    svg += '</g>';
    svg += '<g class="cat-whisker-r">';
    svg += r(128, 32, 12, 2, s.dark, 0.4);
    svg += r(126, 37, 14, 2, s.dark, 0.35);
    svg += r(126, 42, 12, 2, s.dark, 0.3);
    svg += '</g>';

    // Lick tongue (shown during grooming state)
    svg += '<g class="cat-tongue" style="display:none">';
    svg += r(66, 46, 8, 6, '#f472b6');
    svg += r(67, 46, 6, 3, '#f9a8d4');
    svg += '</g>';

    svg += '</g>'; // end cat-head

    // ===== ZZZ PARTICLES (sleeping) =====
    svg += '<g class="cat-zzz" style="display:none">';
    svg += '<text class="sleep-z" x="100" y="20" fill="' + s.light + '" font-family="monospace" font-size="10" font-weight="bold">z</text>';
    svg += '<text class="sleep-z" x="108" y="12" fill="' + s.pale + '" font-family="monospace" font-size="12" font-weight="bold">Z</text>';
    svg += '<text class="sleep-z" x="116" y="4" fill="' + s.white + '" font-family="monospace" font-size="14" font-weight="bold">Z</text>';
    svg += '</g>';

    // ===== FOOD BUBBLE (when hungry/eating) =====
    svg += '<g class="cat-food" style="display:none">';
    // Fish shape
    svg += '<ellipse cx="115" cy="25" rx="8" ry="5" fill="#60a5fa"/>';
    svg += '<polygon points="123,25 130,20 130,30" fill="#60a5fa"/>';
    svg += '<circle cx="112" cy="23" r="1.5" fill="#1a1a2e"/>';
    svg += '</g>';

    // ===== HEART EYES (super happy) =====
    svg += '<g class="cat-heart-eyes" style="display:none">';
    // Heart left
    svg += '<path d="M38,30 C34,26 28,28 32,34 L44,44 L56,34 C60,28 54,26 50,30 L44,36 Z" fill="#ec4899"/>';
    // Heart right
    svg += '<path d="M90,30 C86,26 80,28 84,34 L96,44 L108,34 C112,28 106,26 102,30 L96,36 Z" fill="#ec4899"/>';
    svg += '</g>';

    svg += '</svg>';
    return svg;
  }

  // Heart SVG for particles
  var HEART_SVG = '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<rect x="3" y="2" width="3" height="2" fill="#ec4899"/><rect x="10" y="2" width="3" height="2" fill="#ec4899"/>' +
    '<rect x="2" y="4" width="5" height="2" fill="#ec4899"/><rect x="9" y="4" width="5" height="2" fill="#ec4899"/>' +
    '<rect x="2" y="6" width="12" height="2" fill="#ec4899"/>' +
    '<rect x="3" y="8" width="10" height="2" fill="#ec4899"/>' +
    '<rect x="4" y="10" width="8" height="2" fill="#ec4899"/>' +
    '<rect x="5" y="12" width="6" height="2" fill="#ec4899"/>' +
    '<rect x="6" y="14" width="4" height="1" fill="#ec4899"/>' +
    '</svg>';

  // Star SVG
  var STAR_SVG = '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<rect x="6" y="0" width="4" height="2" fill="#fbbf24"/>' +
    '<rect x="4" y="2" width="8" height="2" fill="#fbbf24"/>' +
    '<rect x="2" y="4" width="12" height="2" fill="#fbbf24"/>' +
    '<rect x="0" y="6" width="16" height="4" fill="#fbbf24"/>' +
    '<rect x="2" y="10" width="12" height="2" fill="#fbbf24"/>' +
    '<rect x="2" y="12" width="4" height="2" fill="#fbbf24"/>' +
    '<rect x="10" y="12" width="4" height="2" fill="#fbbf24"/>' +
    '<rect x="0" y="14" width="4" height="2" fill="#fbbf24"/>' +
    '<rect x="12" y="14" width="4" height="2" fill="#fbbf24"/>' +
    '</svg>';

  // Fish SVG for feeding
  var FISH_SVG = '<svg viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<ellipse cx="8" cy="7" rx="7" ry="5" fill="#60a5fa"/>' +
    '<polygon points="15,7 20,2 20,12" fill="#60a5fa"/>' +
    '<circle cx="5" cy="6" r="1.5" fill="#1a1a2e"/>' +
    '<rect x="7" y="6" width="3" height="1" fill="#93c5fd" opacity="0.5"/>' +
    '</svg>';

  /* ========================================
     STATE DEFINITIONS
     ======================================== */

  var ALL_STATES = [
    'cat-idle', 'cat-sit', 'cat-curious', 'cat-walking', 'cat-alert',
    'cat-sleeping', 'cat-happy', 'cat-lick', 'cat-yawn',
    'cat-stretch', 'cat-puffed', 'cat-nuzzle', 'cat-eating'
  ];

  var STATE_INFO = {
    'cat-idle':     { label: '待机', labelEn: 'Idle',     sub: '呼吸·眨眼·摇尾' },
    'cat-sit':      { label: '蹲坐', labelEn: 'Sit',      sub: '安静蹲坐' },
    'cat-curious':  { label: '好奇', labelEn: 'Curious',  sub: '歪头·探究' },
    'cat-walking':  { label: '行走', labelEn: 'Walking',  sub: '巡逻·移动' },
    'cat-alert':    { label: '警觉', labelEn: 'Alert',    sub: '竖耳·瞪瞳' },
    'cat-sleeping': { label: '睡觉', labelEn: 'Sleeping', sub: '闭眼·Zzz' },
    'cat-happy':    { label: '开心', labelEn: 'Happy',    sub: '跳舞·爱心眼' },
    'cat-lick':     { label: '舔毛', labelEn: 'Grooming', sub: '理毛·舔爪' },
    'cat-yawn':     { label: '打哈欠', labelEn: 'Yawn',   sub: '张嘴·伸懒腰' },
    'cat-stretch':  { label: '伸懒腰', labelEn: 'Stretch',sub: '舒展身体' },
    'cat-puffed':   { label: '炸毛', labelEn: 'Startled', sub: '受惊·炸毛' },
    'cat-nuzzle':   { label: '蹭蹭', labelEn: 'Nuzzle',   sub: '撒娇·蹭你' },
    'cat-eating':   { label: '吃鱼', labelEn: 'Eating',   sub: '咀嚼·满足' }
  };

  /* ========================================
     PIXEL CAT CLASS
     ======================================== */

  function PixelCat(el, opts) {
    opts = opts || {};

    if (typeof el === 'string') {
      el = document.querySelector(el);
    }
    if (!el) {
      console.warn('[PixelCat] Element not found');
      return null;
    }

    this.el = el;
    this.opts = opts;
    this._petCount = 0;
    this._feedCount = 0;
    this._lickCount = 0;
    this._speechTimer = null;
    this._cycleTimer = null;
    this._idleTimer = null;
    this._stateTimer = null;
    this._isInteracting = false;
    this._isDragging = false;
    this._dragOffset = {x:0, y:0};

    // Mood system
    this.mood = opts.mood || 'calm'; // calm/happy/excited/sleepy/startled/hungry/annoyed
    this.affection = opts.affection != null ? opts.affection : 50; // 0-100
    this.hunger = opts.hunger != null ? opts.hunger : 30; // 0-100, higher = hungrier
    this.energy = opts.energy != null ? opts.energy : 80; // 0-100

    // Config
    this.skin = opts.skin || 'golden';
    this.speeches = opts.speeches || getDefaultSpeeches(this.skin);
    this.idlePhrases = opts.idlePhrases || getDefaultIdlePhrases(this.skin);
    this.petThreshold = opts.petThreshold || 5;
    this.interactive = opts.interactive !== false;
    this.eyeTrack = opts.eyeTrack !== false;
    this.autoCycle = opts.autoCycle || false;
    this.cycleInterval = opts.cycleInterval || 7000;
    this.idleSpeech = opts.idleSpeech || false;
    this.idleSpeechInterval = opts.idleSpeechInterval || 10000;
    this.draggable = opts.draggable || false;
    this.accessories = opts.accessories || ['bell']; // bell, bowtie, glasses, crown
    this.onEvent = opts.onEvent || null; // event callback

    // Prevent double init
    if (el.hasAttribute('data-pc-init') && !opts._force) {
      return this; // Already built, just return reference
    }
    el.setAttribute('data-pc-init', 'true');

    this._build();
    if (this.interactive) this._bind();
    this._startTimers();

    if (opts.state) this.setState(opts.state);
    if (opts.size) this.setSize(opts.size);
    this.setSkin(this.skin);
  }

  // --- Build DOM ---
  PixelCat.prototype._build = function () {
    if (this.el.querySelector('.pixel-cat-svg')) return;

    // Mood indicator
    var mood = document.createElement('div');
    mood.className = 'cat-mood';
    mood.textContent = '★';
    mood.title = this.mood;
    this.el.appendChild(mood);

    // Affection bar
    var bar = document.createElement('div');
    bar.className = 'cat-affection-bar';
    var fill = document.createElement('div');
    fill.className = 'cat-affection-bar-fill';
    fill.style.width = this.affection + '%';
    bar.appendChild(fill);
    this.el.appendChild(bar);

    // Speech bubble
    var bubble = document.createElement('div');
    bubble.className = 'cat-speech';
    this.el.appendChild(bubble);

    // SVG
    var svgContainer = document.createElement('div');
    svgContainer.className = 'cat-svg-container';
    svgContainer.innerHTML = buildCatSVG(this.skin);
    this.el.appendChild(svgContainer);

    // Ensure classes
    this.el.classList.add('cat-interactive');
    if (!ALL_STATES.some(function(s){ return this.el.classList.contains(s); }.bind(this))) {
      this.el.classList.add('cat-idle');
    }

    // Hit zones for body-part detection
    this._setupHitZones();
    this._updateMoodUI();
  };

  PixelCat.prototype._setupHitZones = function() {
    // Data attributes on click will be detected via position math
    // We'll use bounding box regions
  };

  PixelCat.prototype._getBodyPart = function(e) {
    var rect = this.el.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width;
    var y = (e.clientY - rect.top) / rect.height;

    if (y < 0.15) return 'ear';
    if (y < 0.45) {
      if (x < 0.3) return 'cheek';
      if (x > 0.7) return 'cheek';
      return 'head';
    }
    if (y < 0.55) return 'collar';
    if (x < 0.15 || x > 0.85) return 'tail';
    if (y > 0.7) return 'paw';
    return 'belly';
  };

  // --- Bind events ---
  PixelCat.prototype._bind = function () {
    var self = this;
    var pupils = function() { return self.el.querySelectorAll('.cat-pupil-slit-l, .cat-pupil-slit-r'); };

    // Eye tracking
    if (this.eyeTrack) {
      this.el.addEventListener('mousemove', function(e) {
        if (self._isDragging) return;
        var ps = pupils();
        if (ps.length === 0) return;
        var rect = self.el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) / rect.width;
        var dy = (e.clientY - cy) / rect.height;
        var maxMove = 3;
        var tx = Math.max(-maxMove, Math.min(maxMove, dx * maxMove * 2));
        var ty = Math.max(-maxMove, Math.min(maxMove, dy * maxMove * 1.5));
        ps.forEach(function(p) {
          p.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px)';
        });
      });
    }

    // Hover = purr
    this.el.addEventListener('mouseenter', function() {
      if (self._isDragging) return;
      self._isInteracting = true;
      self.el.classList.add('cat-purring');
      if (Math.random() > 0.5) {
        self._createStarParticles(1 + Math.floor(Math.random() * 2));
      }
      if (self.mood !== 'sleeping' && Math.random() > 0.6) {
        self._sayBubble(self.idlePhrases[Math.floor(Math.random()*self.idlePhrases.length)], 1500);
      }
      self._emit('hover', {});
    });

    this.el.addEventListener('mouseleave', function() {
      self._isInteracting = false;
      self.el.classList.remove('cat-purring');
      pupils().forEach(function(p){ p.style.transform = ''; });
    });

    // Click = pet with body-part detection
    this.el.addEventListener('click', function(e) {
      if (self._isDragging) return;
      var part = self._getBodyPart(e);
      self._onPet(part, e);
    });

    // Double click = excited meow
    this.el.addEventListener('dblclick', function(e) {
      e.preventDefault();
      self._petCount += 2;
      self.affection = Math.min(100, self.affection + 8);
      self.setState('happy');
      self._sayBubble('喵呜!!!', 2000);
      self._createHeartParticles(e, 6);
      self._createStarParticles(4);
      self._emit('dblclick', { affection: self.affection });
      setTimeout(function(){ self.setState('idle'); }, 2500);
    });

    // Context menu (right click) = feed fish
    this.el.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      self.feed();
    });

    // Draggable
    if (this.draggable) {
      this.el.addEventListener('mousedown', function(e) {
        if (e.button !== 0) return;
        self._isDragging = true;
        self.el.style.position = 'fixed';
        self.el.style.zIndex = '9999';
        var rect = self.el.getBoundingClientRect();
        self._dragOffset.x = e.clientX - rect.left;
        self._dragOffset.y = e.clientY - rect.top;
        self.el.style.transition = 'none';

        function onMove(ev) {
          self.el.style.left = (ev.clientX - self._dragOffset.x) + 'px';
          self.el.style.top = (ev.clientY - self._dragOffset.y) + 'px';
        }
        function onUp() {
          self._isDragging = false;
          self.el.style.transition = '';
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          // After being held, cat is slightly annoyed
          if (Math.random() > 0.5) {
            self._sayBubble('喵? 放开我!', 1500);
          }
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    }
  };

  // --- Pet interaction by body part ---
  PixelCat.prototype._onPet = function(part, e) {
    this._petCount++;
    this.el.classList.add('cat-petted');
    setTimeout(function(){ this.el.classList.remove('cat-petted'); }.bind(this), 600);

    this.affection = Math.min(100, this.affection + 3);

    var reactions = {
      head:    { msgs: ['呼噜呼噜~','好舒服~','再摸摸头!','喵~','★ 喜欢摸头'], hearts: 3, state: 'cat-nuzzle', aff: 5 },
      cheek:   { msgs: ['蹭蹭~','喵呜~','脸脸好痒~','呼噜~','最喜欢你了'], hearts: 4, state: 'cat-happy', aff: 6 },
      ear:     { msgs: ['耳朵!','喵?','好痒喵~','嗯?'], hearts: 2, state: 'cat-curious', aff: 2 },
      belly:   { msgs: ['肚子!!!','咕噜咕噜~','喵~好软','哈哈好痒!','再摸再摸!'], hearts: 5, state: 'cat-happy', aff: 8 },
      paw:     { msgs: ['爪爪~','喵...','不要碰爪!','喵呜~'], hearts: 2, state: 'cat-idle', aff: 2 },
      tail:    { msgs: ['尾巴!','别碰尾巴!','喵!','哼!'], hearts: 0, state: 'cat-alert', aff: -3 },
      collar:  { msgs: ['铃铛~','叮铃~','好看吗?','喵~'], hearts: 3, state: 'cat-happy', aff: 4 },
    };

    var r = reactions[part] || reactions.head;
    if (this.affection < 20 && part === 'belly') {
      r = { msgs: ['还不熟呢...','喵...(躲开)','...'], hearts: 0, state: 'cat-alert', aff: 0 };
    }

    // Update affection
    this.affection = Math.max(0, Math.min(100, this.affection + r.aff));

    // Show reaction
    if (Math.random() > 0.15) {
      this._sayBubble(r.msgs[Math.floor(Math.random()*r.msgs.length)], 1800);
    }

    // Particles
    if (r.hearts > 0) this._createHeartParticles(e, r.hearts);
    if (part === 'cheek' || part === 'belly') this._createStarParticles(2);

    // State change
    if (r.state && r.state !== 'cat-idle') {
      clearTimeout(this._stateTimer);
      this.setState(r.state.replace('cat-',''));
      this._stateTimer = setTimeout(function(){
        this.setState('idle');
      }.bind(this), 1500);
    }

    // Threshold = super happy
    if (this._petCount >= this.petThreshold) {
      this._petCount = 0;
      this._superHappy();
    }

    this._updateMoodUI();
    this._emit('pet', { part: part, affection: this.affection, mood: this.mood });
  };

  PixelCat.prototype._superHappy = function() {
    this.mood = 'excited';
    this.setState('happy');
    this._showHeartEyes(true);
    this._sayBubble('★ 最喜欢你了!!!', 3000);
    this._createHeartParticles(null, 8);
    this._createStarParticles(6);
    var self = this;
    setTimeout(function(){
      self._showHeartEyes(false);
      self.setState('idle');
      self.mood = 'happy';
    }, 3000);
    this._emit('superhappy', { affection: this.affection });
  };

  PixelCat.prototype._showHeartEyes = function(show) {
    var he = this.el.querySelector('.cat-heart-eyes');
    var eo = this.el.querySelector('.eye-open');
    if (he) he.style.display = show ? 'block' : 'none';
    if (eo) eo.style.display = show ? 'none' : 'block';
  };

  // --- Feed ---
  PixelCat.prototype.feed = function() {
    this.hunger = Math.max(0, this.hunger - 20);
    this.affection = Math.min(100, this.affection + 5);
    this._feedCount++;
    this._showFood(true);
    this.setState('eating');
    this._sayBubble('鱼!!! 喵~', 1200);
    var self = this;
    setTimeout(function(){
      self._sayBubble('好吃~ ★', 1500);
      self._createHeartParticles(null, 4);
    }, 1200);
    setTimeout(function(){
      self._showFood(false);
      self.setState('happy');
    }, 2500);
    setTimeout(function(){
      self.setState('idle');
      self.mood = 'happy';
    }, 4000);
    this._updateMoodUI();
    this._emit('feed', { hunger: this.hunger, affection: this.affection });
  };

  PixelCat.prototype._showFood = function(show) {
    var f = this.el.querySelector('.cat-food');
    if (f) f.style.display = show ? 'block' : 'none';
  };

  // --- Timers ---
  PixelCat.prototype._startTimers = function() {
    var self = this;

    if (this.autoCycle) {
      var cycleStates = ['cat-idle','cat-sit','cat-curious','cat-idle','cat-sit','cat-alert','cat-idle','cat-lick','cat-idle'];
      var cycleIdx = 0;
      this._cycleTimer = setInterval(function(){
        if (self._isInteracting || self.mood === 'excited') return;
        cycleIdx = (cycleIdx + 1) % cycleStates.length;
        var s = cycleStates[cycleIdx];
        // Energy-based: if low energy, more likely to sleep
        if (self.energy < 30 && Math.random() > 0.5) s = 'cat-sleeping';
        // Hunger-based: if hungry, show food
        if (self.hunger > 70 && Math.random() > 0.6) {
          self._sayBubble('...饿了 鱼呢?', 2000);
        }
        self.setState(s);
      }, this.cycleInterval);
    }

    if (this.idleSpeech) {
      this._idleTimer = setInterval(function(){
        if (self._isInteracting || self.mood === 'excited') return;
        if (Math.random() > 0.75) {
          self._sayBubble(self.idlePhrases[Math.floor(Math.random()*self.idlePhrases.length)], 2000);
        }
      }, this.idleSpeechInterval);
    }

    // Mood decay
    setInterval(function(){
      self.hunger = Math.min(100, self.hunger + 1);
      self.energy = Math.max(0, self.energy - 0.5);
      if (self.energy < 20 && Math.random() > 0.7) {
        self.setState('sleeping');
        self.mood = 'sleepy';
        self._showZzz(true);
      }
      if (self.hunger > 80 && Math.random() > 0.7) {
        self.mood = 'hungry';
      }
    }, 15000);
  };

  PixelCat.prototype._showZzz = function(show) {
    var zzz = this.el.querySelector('.cat-zzz');
    if (zzz) zzz.style.display = show ? 'block' : 'none';
  };

  PixelCat.prototype._updateMoodUI = function() {
    var moodEl = this.el.querySelector('.cat-mood');
    var barEl = this.el.querySelector('.cat-affection-bar-fill');
    var moodEmoji = {
      calm: '★', happy: '♥', excited: '♥', sleepy: 'zZ',
      startled: '!', hungry: '?', annoyed: '×', curious: '?'
    };
    var moodColor = {
      calm: '#c8944a', happy: '#ec4899', excited: '#f472b6', sleepy: '#818cf8',
      startled: '#fbbf24', hungry: '#fb923c', annoyed: '#ef4444', curious: '#60a5fa'
    };
    if (moodEl) {
      moodEl.textContent = moodEmoji[this.mood] || '★';
      moodEl.style.background = moodColor[this.mood] || '#c8944a';
      moodEl.title = this.mood + ' · 好感度:' + this.affection;
    }
    if (barEl) {
      barEl.style.width = this.affection + '%';
    }
  };

  // --- Particles ---
  PixelCat.prototype._createHeartParticles = function(e, count) {
    count = count || 3;
    var rect = this.el.getBoundingClientRect();
    var x, y;
    if (e) {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    } else {
      x = rect.width / 2;
      y = rect.height * 0.4;
    }
    for (var i = 0; i < count; i++) {
      var h = document.createElement('div');
      h.className = 'heart-particle';
      h.style.left = (x - 9 + (Math.random()*20-10)) + 'px';
      h.style.top = (y - 9) + 'px';
      h.style.setProperty('--hx', (Math.random()*70-35)+'px');
      h.style.animationDelay = (i*80)+'ms';
      h.innerHTML = HEART_SVG;
      this.el.appendChild(h);
      (function(h){ setTimeout(function(){ if(h.parentNode) h.parentNode.removeChild(h); }, 1600); })(h);
    }
  };

  PixelCat.prototype._createStarParticles = function(count) {
    count = count || 2;
    var rect = this.el.getBoundingClientRect();
    for (var i = 0; i < count; i++) {
      var s = document.createElement('div');
      s.className = 'star-particle';
      s.style.left = (rect.width*0.3 + Math.random()*rect.width*0.4)+'px';
      s.style.top = (rect.height*0.2 + Math.random()*rect.height*0.3)+'px';
      s.style.setProperty('--sx', (Math.random()*40-20)+'px');
      s.style.setProperty('--sy', (Math.random()*-30-20)+'px');
      s.style.animationDelay = (i*100)+'ms';
      s.innerHTML = STAR_SVG;
      this.el.appendChild(s);
      (function(s){ setTimeout(function(){ if(s.parentNode) s.parentNode.removeChild(s); }, 1200); })(s);
    }
  };

  PixelCat.prototype._createFishParticle = function() {
    var rect = this.el.getBoundingClientRect();
    var f = document.createElement('div');
    f.className = 'fish-particle';
    f.style.left = (rect.width*0.3)+'px';
    f.style.top = '-20px';
    f.innerHTML = FISH_SVG;
    this.el.appendChild(f);
    (function(f){ setTimeout(function(){ if(f.parentNode) f.parentNode.removeChild(f); }, 2000); })(f);
  };

  // --- Speech ---
  PixelCat.prototype._sayBubble = function(text, duration) {
    var bubble = this.el.querySelector('.cat-speech');
    if (!bubble) return;
    bubble.textContent = text;
    this.el.classList.add('cat-talking');
    clearTimeout(this._speechTimer);
    this._speechTimer = setTimeout(function(){
      this.el.classList.remove('cat-talking');
    }.bind(this), duration || 1800);
  };

  PixelCat.prototype.say = function(text, duration) {
    this._sayBubble(text, duration);
  };

  // --- State management ---
  PixelCat.prototype.setState = function(state) {
    var cls = state.startsWith('cat-') ? state : 'cat-' + state;
    ALL_STATES.forEach(function(s){ this.el.classList.remove(s); }.bind(this));
    this.el.classList.add(cls);
    this.mood = stateToMood(state);

    // Show/hide Zzz
    this._showZzz(state === 'sleeping');

    // Show/hide tongue for lick
    var tongue = this.el.querySelector('.cat-tongue');
    if (tongue) tongue.style.display = (state === 'lick' || state === 'eating') ? 'block' : 'none';

    // Show/hide yawn mouth
    var yawnMouth = this.el.querySelector('.cat-mouth-yawn');
    var normalMouth = this.el.querySelector('.cat-mouth');
    if (yawnMouth) yawnMouth.style.display = (state === 'yawn') ? 'block' : 'none';
    if (normalMouth) normalMouth.style.display = (state === 'yawn') ? 'none' : 'block';

    // Puffed = fur standing up
    if (state === 'puffed') {
      this.el.classList.add('cat-puffed-fur');
    } else {
      this.el.classList.remove('cat-puffed-fur');
    }

    this._emit('state', { state: state, mood: this.mood });
    this._updateMoodUI();
  };

  PixelCat.prototype.getState = function() {
    for (var i = 0; i < ALL_STATES.length; i++) {
      if (this.el.classList.contains(ALL_STATES[i])) return ALL_STATES[i];
    }
    return null;
  };

  // --- Skin ---
  PixelCat.prototype.setSkin = function(skinName) {
    if (!SKINS[skinName]) return;
    this.skin = skinName;
    var container = this.el.querySelector('.cat-svg-container');
    if (container) {
      container.innerHTML = buildCatSVG(skinName);
    }
    this.speeches = getDefaultSpeeches(skinName);
    this.idlePhrases = getDefaultIdlePhrases(skinName);
    // Re-sync current state after skin rebuild
    var curState = this.getState();
    if (curState) {
      var stateName = curState.replace('cat-', '');
      this.setState(stateName);
    }
    this._updateMoodUI();
    this._emit('skin', { skin: skinName });
  };

  // --- Size ---
  PixelCat.prototype.setSize = function(size) {
    ['xs','sm','md','lg','xl'].forEach(function(s){
      this.el.classList.remove('cat-size-'+s);
    }.bind(this));
    this.el.classList.add('cat-size-'+size);
  };

  // --- Event emitter ---
  PixelCat.prototype._emit = function(eventName, data) {
    if (typeof this.onEvent === 'function') {
      this.onEvent(eventName, data);
    }
  };

  PixelCat.prototype.on = function(eventName, handler) {
    var self = this;
    var origHandler = this.onEvent;
    this.onEvent = function(name, data) {
      if (name === eventName) handler(data);
      if (origHandler) origHandler(name, data);
    };
  };

  // --- Destroy ---
  PixelCat.prototype.destroy = function() {
    clearTimeout(this._speechTimer);
    clearTimeout(this._stateTimer);
    clearInterval(this._cycleTimer);
    clearInterval(this._idleTimer);
    var clone = this.el.cloneNode(true);
    if (this.el.parentNode) this.el.parentNode.replaceChild(clone, this.el);
    this.el = null;
  };

  // --- Happy dance ---
  PixelCat.prototype.happy = function(duration) {
    this.mood = 'excited';
    this._showHeartEyes(true);
    this.setState('happy');
    this._sayBubble('★ 好开心!', duration||2500);
    this._createStarParticles(5);
    this._createHeartParticles(null, 4);
    var self = this;
    setTimeout(function(){
      self._showHeartEyes(false);
      self.setState('idle');
      self.mood = 'happy';
    }, duration||2500);
  };

  /* ========================================
     HELPERS
     ======================================== */

  function stateToMood(state) {
    var map = {
      'idle':'calm','sit':'calm','curious':'curious','walking':'calm',
      'alert':'startled','sleeping':'sleepy','happy':'happy','lick':'calm',
      'yawn':'sleepy','stretch':'sleepy','puffed':'startled','nuzzle':'happy','eating':'happy'
    };
    return map[state] || 'calm';
  }

  function getDefaultSpeeches(skin) {
    var base = ['喵~','好舒服~','再摸摸!','呼噜呼噜~','★ 好开心','喵呜~','最喜欢你了','喵喵喵!','~ 蹭蹭 ~','咕噜咕噜~','好痒~','再摸一下!','喵 ♥'];
    if (skin === 'golden') base.push('★ 金渐层最可爱!','铃铛响叮当~','喵~ 朕的江山');
    if (skin === 'black') base.push('...(黑猫凝视)','万圣节快乐~','喵~ 神秘');
    if (skin === 'white') base.push('喵~ 优雅','本猫雪白如雪~');
    if (skin === 'calico') base.push('三色猫最幸运!','★ 招财猫~');
    if (skin === 'gray') base.push('喵~ 英伦绅士','安静如鸡~');
    return base;
  }

  function getDefaultIdlePhrases(skin) {
    return ['...','喵?','★ ...','~ zZ','嗯?','鱼呢?','无聊~'];
  }

  /* ========================================
     STATIC METHODS
     ======================================== */

  PixelCat.SKINS = SKINS;
  PixelCat.STATES = ALL_STATES.map(function(s){
    var info = STATE_INFO[s] || {label:s, sub:''};
    return { cls:s, label:info.label, labelEn:info.labelEn, sub:info.sub };
  });

  PixelCat.buildGallery = function(container) {
    if (typeof container === 'string') container = document.querySelector(container);
    if (!container) return [];
    container.className = 'cat-state-gallery';
    container.innerHTML = '';
    var instances = [];
    PixelCat.STATES.forEach(function(s, i) {
      var card = document.createElement('div');
      card.className = 'cat-state-card';
      var bg = document.createElement('div');
      bg.className = 'cat-state-bg';
      card.appendChild(bg);
      var wrap = document.createElement('div');
      wrap.className = 'cat-state-svg cat-interactive ' + s.cls;
      wrap.setAttribute('data-cat', 'gallery-'+i);
      card.appendChild(wrap);
      var lbl = document.createElement('div');
      lbl.className = 'cat-state-label';
      lbl.textContent = s.label + ' · ' + s.labelEn;
      card.appendChild(lbl);
      var sub = document.createElement('div');
      sub.className = 'cat-state-sub';
      sub.textContent = s.sub;
      card.appendChild(sub);
      container.appendChild(card);
      var cat = new PixelCat(wrap, { interactive:true, eyeTrack:false, skin:'golden' });
      instances.push(cat);
      card.addEventListener('mouseenter', function(){
        wrap.style.animation = 'none';
        void wrap.offsetWidth;
        wrap.style.animation = '';
        cat.setState(s.cls.replace('cat-',''));
      });
    });
    return instances;
  };

  PixelCat.autoInit = function(opts) {
    opts = opts || {};
    var elements = document.querySelectorAll('.cat-interactive:not([data-pc-init]):not([data-pc-skip])');
    var instances = [];
    elements.forEach(function(el) {
      var stateOpts = Object.assign({}, opts);
      ALL_STATES.forEach(function(s) {
        if (el.classList.contains(s) && !stateOpts.state) {
          stateOpts.state = s.replace('cat-','');
        }
      });
      var cat = new PixelCat(el, stateOpts);
      if (cat) instances.push(cat);
    });
    return instances;
  };

  /* ========================================
     EXPORT
     ======================================== */

  global.PixelCat = PixelCat;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ PixelCat.autoInit(); });
  } else {
    PixelCat.autoInit();
  }

  console.log('%c★ PixelCat v2.0 — Golden Chinchilla Edition loaded', 'color:#c8944a;font-weight:bold;font-size:12px');

})(typeof window !== 'undefined' ? window : this);
