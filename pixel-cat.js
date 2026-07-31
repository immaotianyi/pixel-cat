/* ============================================
   PIXEL CAT — 8-bit Interactive Pixel Cat
   Version: 2.6.0 (stable broadcast mode + smart bubble + transparent bg)
   License: MIT
   ============================================
   A reusable, zero-dependency pixel cat component.
   Auto-init, jQuery-free, ES5-compatible.
   ============================================
   Quick start:
     <link rel="stylesheet" href="pixel-cat.css">
     <div class="cat-interactive cat-idle"></div>
     <script src="pixel-cat.js"></script>
   Advanced:
     const cat = new PixelCat(el, { state:'happy', size:'md' });
     cat.setState('sleeping');
     cat.say('喵~');
   ============================================ */

(function (global) {
  'use strict';

  /* ============================================
     1. SVG TEMPLATES
     ============================================ */

  var CAT_SVG =
    '<svg class="pixel-cat-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="60" cy="95" rx="36" ry="3" fill="#000" opacity="0.15"/>' +
    // Tail
    '<g class="cat-tail">' +
    '<rect x="90" y="58" width="5" height="5" fill="#78350f"/><rect x="90" y="63" width="5" height="5" fill="#78350f"/>' +
    '<rect x="95" y="53" width="5" height="5" fill="#78350f"/><rect x="95" y="58" width="5" height="5" fill="#d97706"/><rect x="95" y="63" width="5" height="5" fill="#78350f"/>' +
    '<rect x="100" y="48" width="5" height="5" fill="#78350f"/><rect x="100" y="53" width="5" height="5" fill="#f59e0b"/><rect x="100" y="58" width="5" height="5" fill="#d97706"/>' +
    '<rect x="105" y="43" width="5" height="5" fill="#78350f"/><rect x="105" y="48" width="5" height="5" fill="#f59e0b"/><rect x="105" y="53" width="5" height="5" fill="#fbbf24"/>' +
    '<rect x="105" y="38" width="5" height="5" fill="#78350f"/><rect x="110" y="38" width="5" height="5" fill="#78350f"/><rect x="110" y="43" width="5" height="5" fill="#78350f"/><rect x="110" y="33" width="5" height="5" fill="#78350f"/>' +
    '<rect x="105" y="38" width="5" height="3" fill="#fbbf24"/><rect x="110" y="38" width="3" height="3" fill="#fbbf24"/>' +
    '</g>' +
    // Left ear
    '<g class="cat-ear-l">' +
    '<rect x="20" y="0" width="5" height="5" fill="#78350f"/><rect x="25" y="0" width="5" height="5" fill="#78350f"/>' +
    '<rect x="15" y="5" width="5" height="5" fill="#78350f"/><rect x="20" y="5" width="5" height="5" fill="#f59e0b"/><rect x="25" y="5" width="5" height="5" fill="#f59e0b"/><rect x="30" y="5" width="5" height="5" fill="#78350f"/>' +
    '<rect x="22" y="2" width="4" height="3" fill="#fbbf24"/>' +
    '<rect x="22" y="7" width="5" height="3" fill="#ec4899" opacity="0.55"/><rect x="24" y="5" width="3" height="3" fill="#f472b6" opacity="0.4"/>' +
    '</g>' +
    // Right ear
    '<g class="cat-ear-r">' +
    '<rect x="90" y="0" width="5" height="5" fill="#78350f"/><rect x="95" y="0" width="5" height="5" fill="#78350f"/>' +
    '<rect x="85" y="5" width="5" height="5" fill="#78350f"/><rect x="90" y="5" width="5" height="5" fill="#f59e0b"/><rect x="95" y="5" width="5" height="5" fill="#f59e0b"/><rect x="100" y="5" width="5" height="5" fill="#78350f"/>' +
    '<rect x="94" y="2" width="4" height="3" fill="#fbbf24"/>' +
    '<rect x="93" y="7" width="5" height="3" fill="#ec4899" opacity="0.55"/><rect x="93" y="5" width="3" height="3" fill="#f472b6" opacity="0.4"/>' +
    '</g>' +
    // Head
    '<g class="cat-head">' +
    '<rect x="15" y="10" width="90" height="5" fill="#78350f"/>' +
    '<rect x="15" y="15" width="90" height="30" fill="#f59e0b"/>' +
    '<rect x="20" y="15" width="80" height="2" fill="#fbbf24"/>' +
    '<rect x="10" y="15" width="5" height="30" fill="#78350f"/><rect x="105" y="15" width="5" height="30" fill="#78350f"/>' +
    '<rect x="17" y="37" width="6" height="3" fill="#ec4899" opacity="0.3"/><rect x="97" y="37" width="6" height="3" fill="#ec4899" opacity="0.3"/>' +
    // Eyes open
    '<g class="eye-open">' +
    '<rect x="26" y="22" width="22" height="15" fill="#78350f"/><rect x="28" y="24" width="18" height="11" fill="#ffffff"/>' +
    '<g class="cat-pupil-l"><rect x="32" y="25" width="10" height="9" fill="#1a1a2e"/><rect x="34" y="27" width="4" height="4" fill="#ffffff"/><rect x="38" y="30" width="2" height="2" fill="#60a5fa" opacity="0.7"/></g>' +
    '<rect x="72" y="22" width="22" height="15" fill="#78350f"/><rect x="74" y="24" width="18" height="11" fill="#ffffff"/>' +
    '<g class="cat-pupil-r"><rect x="78" y="25" width="10" height="9" fill="#1a1a2e"/><rect x="80" y="27" width="4" height="4" fill="#ffffff"/><rect x="84" y="30" width="2" height="2" fill="#60a5fa" opacity="0.7"/></g>' +
    '</g>' +
    // Eyes closed
    '<g class="eye-closed"><rect x="28" y="28" width="18" height="4" fill="#1a1a2e"/><rect x="74" y="28" width="18" height="4" fill="#1a1a2e"/></g>' +
    // Nose
    '<rect x="56" y="38" width="6" height="3" fill="#ec4899"/><rect x="57" y="41" width="4" height="2" fill="#f472b6"/>' +
    // Mouth — closed (default)
    '<g class="cat-mouth-closed">' +
    '<rect x="56" y="43" width="2" height="2" fill="#1a1a2e"/><rect x="58" y="44" width="4" height="1" fill="#1a1a2e"/><rect x="62" y="43" width="2" height="2" fill="#1a1a2e"/>' +
    '</g>' +
    // Mouth — open (speaking)
    '<g class="cat-mouth-open">' +
    '<rect x="56" y="42" width="8" height="2" fill="#1a1a2e"/><rect x="55" y="43" width="10" height="3" fill="#1a1a2e"/><rect x="56" y="46" width="8" height="2" fill="#1a1a2e"/>' +
    '<rect x="57" y="44" width="6" height="2" fill="#ec4899" opacity="0.5"/>' +
    '</g>' +
    // Whiskers
    '<g class="cat-whisker-l"><rect x="0" y="28" width="10" height="2" fill="#d97706"/><rect x="0" y="33" width="12" height="2" fill="#d97706"/><rect x="2" y="38" width="10" height="2" fill="#d97706"/></g>' +
    '<g class="cat-whisker-r"><rect x="110" y="28" width="10" height="2" fill="#d97706"/><rect x="108" y="33" width="12" height="2" fill="#d97706"/><rect x="108" y="38" width="10" height="2" fill="#d97706"/></g>' +
    '</g>' +
    // Body
    '<g class="cat-body">' +
    '<rect x="40" y="45" width="40" height="4" fill="#7c3aed"/><rect x="55" y="45" width="10" height="8" fill="#fbbf24"/><rect x="57" y="47" width="6" height="4" fill="#f59e0b"/>' +
    '<rect x="20" y="49" width="5" height="35" fill="#78350f"/><rect x="25" y="49" width="70" height="35" fill="#f59e0b"/><rect x="95" y="49" width="5" height="35" fill="#78350f"/>' +
    '<rect x="25" y="49" width="70" height="2" fill="#fbbf24"/>' +
    '<rect x="38" y="54" width="44" height="25" fill="#fef3c7" opacity="0.35"/><rect x="42" y="57" width="36" height="19" fill="#fef3c7" opacity="0.25"/>' +
    '<rect x="25" y="79" width="20" height="6" fill="#78350f"/><rect x="25" y="79" width="20" height="4" fill="#f59e0b"/>' +
    '<rect x="75" y="79" width="20" height="6" fill="#78350f"/><rect x="75" y="79" width="20" height="4" fill="#f59e0b"/>' +
    '<rect x="29" y="81" width="2" height="4" fill="#d97706" opacity="0.4"/><rect x="34" y="81" width="2" height="4" fill="#d97706" opacity="0.4"/><rect x="39" y="81" width="2" height="4" fill="#d97706" opacity="0.4"/>' +
    '<rect x="79" y="81" width="2" height="4" fill="#d97706" opacity="0.4"/><rect x="84" y="81" width="2" height="4" fill="#d97706" opacity="0.4"/><rect x="89" y="81" width="2" height="4" fill="#d97706" opacity="0.4"/>' +
    '</g>' +
    '</svg>';

  var HEART_SVG =
    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<rect x="3" y="2" width="3" height="2" fill="#ec4899"/><rect x="10" y="2" width="3" height="2" fill="#ec4899"/>' +
    '<rect x="2" y="4" width="5" height="2" fill="#ec4899"/><rect x="9" y="4" width="5" height="2" fill="#ec4899"/>' +
    '<rect x="2" y="6" width="12" height="2" fill="#ec4899"/>' +
    '<rect x="3" y="8" width="10" height="2" fill="#ec4899"/>' +
    '<rect x="4" y="10" width="8" height="2" fill="#ec4899"/>' +
    '<rect x="5" y="12" width="6" height="2" fill="#ec4899"/>' +
    '<rect x="6" y="14" width="4" height="1" fill="#ec4899"/>' +
    '</svg>';

  var STAR_SVG =
    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
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

  /* ============================================
     1.2 POSE PROP SVGs (overlay on cat SVG)
     ============================================ */

  // Glasses — overlay on eyes
  var PROP_GLASSES_SVG =
    '<g class="cat-prop-glasses">' +
    '<rect x="24" y="20" width="26" height="2" fill="#1a1a2e"/><rect x="24" y="20" width="2" height="16" fill="#1a1a2e"/><rect x="48" y="20" width="2" height="16" fill="#1a1a2e"/><rect x="24" y="34" width="26" height="2" fill="#1a1a2e"/>' +
    '<rect x="26" y="22" width="22" height="12" fill="#60a5fa" opacity="0.22"/>' +
    '<rect x="50" y="25" width="20" height="2" fill="#1a1a2e"/>' +
    '<rect x="70" y="20" width="26" height="2" fill="#1a1a2e"/><rect x="70" y="20" width="2" height="16" fill="#1a1a2e"/><rect x="94" y="20" width="2" height="16" fill="#1a1a2e"/><rect x="70" y="34" width="26" height="2" fill="#1a1a2e"/>' +
    '<rect x="72" y="22" width="22" height="12" fill="#60a5fa" opacity="0.22"/>' +
    '</g>';

  // Book — overlay in front of body
  var PROP_BOOK_SVG =
    '<g class="cat-prop-book">' +
    '<rect x="33" y="70" width="54" height="3" fill="#78350f"/>' +
    '<rect x="33" y="73" width="54" height="16" fill="#fef3c7"/>' +
    '<rect x="59" y="73" width="2" height="16" fill="#78350f"/>' +
    '<rect x="36" y="76" width="20" height="1" fill="#d97706"/><rect x="36" y="79" width="16" height="1" fill="#d97706"/><rect x="36" y="82" width="18" height="1" fill="#d97706"/><rect x="36" y="85" width="14" height="1" fill="#d97706"/>' +
    '<rect x="63" y="76" width="20" height="1" fill="#d97706"/><rect x="63" y="79" width="16" height="1" fill="#d97706"/><rect x="63" y="82" width="18" height="1" fill="#d97706"/><rect x="63" y="85" width="14" height="1" fill="#d97706"/>' +
    '</g>';

  // Keyboard — overlay in front of body, flat
  var PROP_KEYBOARD_SVG =
    '<g class="cat-prop-keyboard">' +
    '<rect x="28" y="82" width="64" height="2" fill="#1a1a2e"/>' +
    '<rect x="28" y="84" width="64" height="11" fill="#2a2a4a"/>' +
    '<rect x="31" y="86" width="6" height="2" fill="#4a4a6a"/><rect x="39" y="86" width="6" height="2" fill="#4a4a6a"/><rect x="47" y="86" width="6" height="2" fill="#4a4a6a"/><rect x="55" y="86" width="6" height="2" fill="#4a4a6a"/><rect x="63" y="86" width="6" height="2" fill="#4a4a6a"/><rect x="71" y="86" width="6" height="2" fill="#4a4a6a"/><rect x="79" y="86" width="6" height="2" fill="#4a4a6a"/>' +
    '<rect x="35" y="90" width="50" height="2" fill="#4a4a6a"/>' +
    '<rect x="43" y="86" width="6" height="2" fill="#fbbf24" opacity="0.5"/>' +
    '</g>';

  // Teach pointer — pointer stick overlay
  var PROP_TEACH_SVG =
    '<g class="cat-prop-teach">' +
    '<rect x="42" y="50" width="2" height="25" fill="#78350f"/>' +
    '<rect x="40" y="48" width="6" height="3" fill="#f59e0b"/>' +
    '<rect x="42" y="73" width="3" height="3" fill="#ec4899"/>' +
    '</g>';

  // Think paw — small paw near chin
  var PROP_THINK_SVG =
    '<g class="cat-prop-think">' +
    '<rect x="40" y="40" width="10" height="3" fill="#f59e0b"/>' +
    '<rect x="38" y="43" width="3" height="6" fill="#f59e0b"/><rect x="41" y="43" width="3" height="6" fill="#f59e0b"/><rect x="44" y="43" width="3" height="6" fill="#f59e0b"/><rect x="47" y="43" width="3" height="6" fill="#f59e0b"/>' +
    '<rect x="38" y="49" width="12" height="2" fill="#d97706"/>' +
    '</g>';

  // Present sparkles — decorative stars around cat
  var PROP_PRESENT_SVG =
    '<g class="cat-prop-present">' +
    '<rect x="5" y="25" width="3" height="1" fill="#fbbf24"/><rect x="4" y="26" width="5" height="1" fill="#fbbf24"/><rect x="5" y="27" width="3" height="1" fill="#fbbf24"/>' +
    '<rect x="112" y="20" width="3" height="1" fill="#ec4899"/><rect x="111" y="21" width="5" height="1" fill="#ec4899"/><rect x="112" y="22" width="3" height="1" fill="#ec4899"/>' +
    '<rect x="8" y="55" width="2" height="1" fill="#60a5fa"/><rect x="7" y="56" width="4" height="1" fill="#60a5fa"/><rect x="8" y="57" width="2" height="1" fill="#60a5fa"/>' +
    '<rect x="110" y="50" width="2" height="1" fill="#fbbf24"/><rect x="109" y="51" width="4" height="1" fill="#fbbf24"/><rect x="110" y="52" width="2" height="1" fill="#fbbf24"/>' +
    '</g>';

  /* ============================================
     1.3 EMOTE BUBBLE SVGs (above head, transient)
     ============================================ */

  var EMOTE_QUESTION_SVG =
    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<rect x="5" y="1" width="6" height="2" fill="#60a5fa"/>' +
    '<rect x="3" y="3" width="10" height="2" fill="#60a5fa"/>' +
    '<rect x="3" y="5" width="4" height="2" fill="#60a5fa"/><rect x="9" y="5" width="4" height="2" fill="#60a5fa"/>' +
    '<rect x="9" y="7" width="4" height="2" fill="#60a5fa"/>' +
    '<rect x="7" y="9" width="4" height="2" fill="#60a5fa"/>' +
    '<rect x="7" y="12" width="2" height="2" fill="#60a5fa"/>' +
    '</svg>';

  var EMOTE_SHOCK_SVG =
    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<rect x="6" y="0" width="4" height="10" fill="#ec4899"/>' +
    '<rect x="6" y="12" width="4" height="3" fill="#ec4899"/>' +
    '</svg>';

  var EMOTE_IDEA_SVG =
    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<rect x="5" y="0" width="6" height="2" fill="#fbbf24"/>' +
    '<rect x="3" y="2" width="10" height="2" fill="#fbbf24"/>' +
    '<rect x="3" y="4" width="10" height="4" fill="#fde047"/>' +
    '<rect x="5" y="8" width="6" height="2" fill="#fbbf24"/>' +
    '<rect x="5" y="10" width="6" height="2" fill="#78350f"/>' +
    '<rect x="4" y="12" width="8" height="2" fill="#4a4a6a"/>' +
    '</svg>';

  var EMOTE_THUMBSUP_SVG =
    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<rect x="5" y="0" width="3" height="6" fill="#22c55e"/>' +
    '<rect x="3" y="6" width="8" height="2" fill="#22c55e"/>' +
    '<rect x="3" y="8" width="8" height="6" fill="#22c55e"/>' +
    '<rect x="11" y="8" width="3" height="6" fill="#16a34a"/>' +
    '<rect x="4" y="10" width="2" height="1" fill="#16a34a"/><rect x="4" y="12" width="2" height="1" fill="#16a34a"/>' +
    '</svg>';

  var EMOTE_DENY_SVG =
    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<rect x="3" y="2" width="3" height="2" fill="#ef4444"/><rect x="10" y="2" width="3" height="2" fill="#ef4444"/>' +
    '<rect x="2" y="4" width="4" height="2" fill="#ef4444"/><rect x="9" y="4" width="5" height="2" fill="#ef4444"/>' +
    '<rect x="1" y="6" width="5" height="2" fill="#ef4444"/><rect x="9" y="6" width="6" height="2" fill="#ef4444"/>' +
    '<rect x="1" y="8" width="6" height="2" fill="#ef4444"/><rect x="8" y="8" width="7" height="2" fill="#ef4444"/>' +
    '<rect x="2" y="10" width="6" height="2" fill="#ef4444"/><rect x="7" y="10" width="7" height="2" fill="#ef4444"/>' +
    '<rect x="3" y="12" width="5" height="2" fill="#ef4444"/><rect x="7" y="12" width="6" height="2" fill="#ef4444"/>' +
    '</svg>';

  // Map: emote key → SVG
  var EMOTE_SVGS = {
    question: EMOTE_QUESTION_SVG,
    shock: EMOTE_SHOCK_SVG,
    idea: EMOTE_IDEA_SVG,
    thumbsup: EMOTE_THUMBSUP_SVG,
    deny: EMOTE_DENY_SVG
  };

  // Map: pose key → SVG
  var PROP_SVGS = {
    glasses: PROP_GLASSES_SVG,
    book: PROP_BOOK_SVG,
    keyboard: PROP_KEYBOARD_SVG,
    teach: PROP_TEACH_SVG,
    think: PROP_THINK_SVG,
    present: PROP_PRESENT_SVG
  };

  /* ============================================
     2. CONSTANTS
     ============================================ */

  var DEFAULT_SPEECHES = [
    '喵~', '好舒服~', '再摸摸!', '呼噜呼噜~', '★ 好开心', '喵呜~',
    '最喜欢你了', '喵喵喵!', '~ 蹭蹭 ~', '★ LUCY', '咕噜咕噜~',
    '好痒~', '再摸一下!', '喵 ♥', '★ 想要星星吗?'
  ];

  var DEFAULT_IDLE_PHRASES = ['...', '喵?', '★ ...', '~ zZ', '嗯?'];

  var ALL_STATES = ['cat-idle', 'cat-curious', 'cat-alert', 'cat-sleeping', 'cat-walking', 'cat-happy'];
  var INTERACTION_CLASSES = ['cat-purring', 'cat-petted', 'cat-talking'];
  var SIZE_KEYS = ['xs', 'sm', 'md', 'lg', 'xl'];

  var CYCLE_STATES = ['cat-idle', 'cat-curious', 'cat-idle', 'cat-alert', 'cat-idle', 'cat-idle'];

  var STATE_DEFINITIONS = [
    { cls: 'cat-idle', label: '待机 · Idle', sub: '呼吸 · 眸眼 · 摇尾' },
    { cls: 'cat-curious', label: '好奇 · Curious', sub: '歪头 · 探究' },
    { cls: 'cat-walking', label: '行走 · Walking', sub: '弹跳 · 移动' },
    { cls: 'cat-alert', label: '警觉 · Alert', sub: '竖耳 · 专注' },
    { cls: 'cat-sleeping', label: '睡觉 · Sleeping', sub: '闭眼 · 呼噜' },
    { cls: 'cat-happy', label: '开心 · Happy', sub: '跳舞 · 点击触发' }
  ];

  /* --- v2.0: Pose Actions (persistent props) --- */
  var POSE_ACTIONS = {
    glasses:  { cls: 'cat-pose-glasses',  label: '戴眼镜',  svgKey: 'glasses' },
    teach:    { cls: 'cat-pose-teach',    label: '讲课',    svgKey: 'teach' },
    book:     { cls: 'cat-pose-book',     label: '拿书本',  svgKey: 'book' },
    keyboard: { cls: 'cat-pose-keyboard', label: '敲键盘',  svgKey: 'keyboard' },
    present:  { cls: 'cat-pose-present',  label: '展示',    svgKey: 'present' },
    think:    { cls: 'cat-pose-think',    label: '思考',    svgKey: 'think' }
  };
  var POSE_KEYS = Object.keys(POSE_ACTIONS);

  /* --- v2.0: Emote Actions (transient head bubbles) --- */
  var EMOTE_ACTIONS = {
    question: { cls: 'cat-emote-question', label: '疑问',  duration: 1500 },
    shock:    { cls: 'cat-emote-shock',    label: '震惊',  duration: 1500 },
    idea:     { cls: 'cat-emote-idea',     label: '想到',  duration: 1800 },
    thumbsup: { cls: 'cat-emote-thumbsup', label: '点赞',  duration: 1500 },
    deny:     { cls: 'cat-emote-deny',     label: '否定',  duration: 1500 }
  };
  var EMOTE_KEYS = Object.keys(EMOTE_ACTIONS);

  /* --- v2.6: Action density thresholds (raised for broadcast stability) --- */
  var DENSITY_LOW = 0.6;    // below: no action change (raised from 0.4 to reduce jitter)
  var DENSITY_MID = 0.8;    // mid: micro-expression only; high: full switch (raised from 0.7)
  var DENSITY_EMOTE = 0.75; // emote threshold (higher to prevent spamming ? !)

  /* --- Semantic Rules: keyword → action mapping (expanded v2.0) --- */
  var SEMANTIC_RULES = [
    // Original emotional rules
    { keywords: ['开心', '高兴', '哈哈', '好棒', '太好了', '耶', '★', '♥', '喜欢', '爱', '快乐', '兴奋'], action: 'happy', weight: 1.0, type: 'state' },
    { keywords: ['你好', '嗨', 'hello', 'hi', '早上好', '晚上好', '你好呀', '嘿', '欢迎'], action: 'curious', weight: 0.7, type: 'state' },
    { keywords: ['？', '?', '什么', '为什么', '怎么', '哪里', '谁', '何时', '难道', '是不是', '对吗', '如何'], action: 'question', weight: 0.7, type: 'emote' },
    { keywords: ['困', '累', '睡', 'zz', 'zZ', '休息', '晚安', '疲惫', '犯困', '打哈欠', '梦境'], action: 'sleeping', weight: 0.8, type: 'state' },
    { keywords: ['注意', '危险', '小心', '警告', '警惕', '快跑', '不好', '糟糕', '紧急'], action: 'alert', weight: 0.9, type: 'state' },
    { keywords: ['走', '跑', '来', '去', '散步', '出门', '出发', '前进', '移动', '快走'], action: 'walking', weight: 0.7, type: 'state' },
    { keywords: ['吃', '饿', '美味', '鱼', '猫粮', '零食', '小鱼干', '罐头', '饿了', '馋'], action: 'happy', weight: 0.6, type: 'state' },
    { keywords: ['不', '别', '不要', '不行', '拒绝', '不可以', '不能', '错', '不对', '不是'], action: 'deny', weight: 0.6, type: 'emote' },
    { keywords: ['舒服', '摸摸', '呼噜', '蹭蹭', '撒娇', '亲亲', '抱抱'], action: 'happy', weight: 0.5, type: 'state' },
    { keywords: ['什么', '咦', '嗯', '哦', '呀', '啊'], action: 'curious', weight: 0.3, type: 'state' },
    // v2.0: AI knowledge sharing poses
    { keywords: ['代码', '编程', '算法', '模型', '程序', '函数', '变量', 'bug', '调试', '编译', '终端', '命令行'], action: 'keyboard', weight: 0.8, type: 'pose' },
    { keywords: ['产品', '项目', '开发', '做完了', '完成了', '成果', '作品', '展示', '给大家看', '看看这个'], action: 'present', weight: 0.7, type: 'pose' },
    { keywords: ['思考', '复杂', '理解', '难懂', '原理', '本质', '深入', '为什么这样', '底层'], action: 'think', weight: 0.7, type: 'pose' },
    { keywords: ['书', '资料', '文献', '论文', '文档', '参考', '阅读', '读', '章节'], action: 'book', weight: 0.7, type: 'pose' },
    { keywords: ['眼镜', '认真', '专业', '严肃', '学术', '研究', '分析', '严格'], action: 'glasses', weight: 0.7, type: 'pose' },
    { keywords: ['讲课', '教学', '教', '讲解', '解释', '说明', '演示', '步骤', '第一步', '第二步'], action: 'teach', weight: 0.8, type: 'pose' },
    // v2.0: Emote triggers
    { keywords: ['震惊', '惊讶', '天哪', '我的天', '不会吧', '真的吗', '哇', '想不到', '没想到', '竟然'], action: 'shock', weight: 0.8, type: 'emote' },
    { keywords: ['想到了', '原来如此', '明白了', '懂了', '灵感', '突然', '有了', '就是这个', '找到了'], action: 'idea', weight: 0.8, type: 'emote' },
    { keywords: ['推荐', '赞', '好', '不错', '给力', '牛', '厉害', '点赞', '收藏', '值得'], action: 'thumbsup', weight: 0.7, type: 'emote' },
    { keywords: ['不对', '错误', '辟谣', '纠正', '不是这样', '别这样', '不可以', '禁止'], action: 'deny', weight: 0.7, type: 'emote' },
  ];

  /* --- v2.0: Markup tag aliases (Chinese + English) --- */
  var MARKUP_ALIASES = {
    '戴眼镜': 'glasses', '眼镜': 'glasses', 'glasses': 'glasses',
    '讲课': 'teach', '教学': 'teach', 'teach': 'teach',
    '拿书本': 'book', '书本': 'book', '读书': 'book', '书': 'book', 'book': 'book',
    '敲键盘': 'keyboard', '键盘': 'keyboard', '编程': 'keyboard', 'keyboard': 'keyboard',
    '展示': 'present', '介绍': 'present', 'present': 'present',
    '思考': 'think', '想': 'think', 'think': 'think',
    '疑问': 'question', '问号': 'question', '?': 'question', 'question': 'question',
    '震惊': 'shock', '感叹': 'shock', '!': 'shock', 'shock': 'shock',
    '想到': 'idea', '灯泡': 'idea', '灵感': 'idea', 'idea': 'idea',
    '点赞': 'thumbsup', '赞': 'thumbsup', 'thumbsup': 'thumbsup',
    '否定': 'deny', '摇头': 'deny', '错': 'deny', 'deny': 'deny',
    '正常': 'idle', '恢复': 'idle', 'idle': 'idle', '/': 'idle'
  };

  /* --- Speaking speed: ms per character (natural Chinese oral pace ~3-4 chars/sec) --- */
  var MS_PER_CHAR = 280;        // 每字基础时长 (视频口播约3.5字/秒)
  var SENTENCE_GAP = 750;       // 句间停顿（呼吸感，句号/问号/感叹号后的自然停顿）
  var COMMA_GAP = 280;          // 逗号/顿号/分号后的短暂停顿
  var SHORT_GAP = 150;          // 短句/词组间的极短停顿
  var TRANSITION_GAP = 200;     // 动作过渡（情绪切换的自然瞬间）
  var MIN_DURATION = 1200;      // 单句最短时长（避免短句一闪而过）

  /* ============================================
     2.2 MARKUP PARSER — [action]text[/] syntax
     ============================================ */

  /**
   * Parse markup tags from a line of text.
   * Supports: [戴眼镜]text  [glasses]text  [/]reset
   * Returns: { text: 'cleaned text', pose: 'glasses'|null, emote: 'question'|null, reset: bool }
   *
   * Defensive: unknown tags treated as plain text, no crash.
   */
  function parseMarkupTag(line) {
    var result = { text: line, pose: null, emote: null, reset: false };
    try {
      var match = line.match(/^\[([^\]]+)\]\s*(.*)$/);
      if (!match) return result;

      var rawTag = match[1].trim();
      var rest = match[2];

      // Check for reset tag
      if (rawTag === '/' || rawTag === '正常' || rawTag === '恢复' || rawTag === 'idle') {
        return { text: rest, pose: null, emote: null, reset: true };
      }

      // Look up alias
      var action = MARKUP_ALIASES[rawTag];
      if (!action) {
        // Unknown tag — treat as plain text (defensive: no data loss)
        return { text: line, pose: null, emote: null, reset: false };
      }

      // Classify: pose or emote
      if (POSE_ACTIONS[action]) {
        return { text: rest, pose: action, emote: null, reset: false };
      } else if (EMOTE_ACTIONS[action]) {
        return { text: rest, pose: null, emote: action, reset: false };
      }

      // Fallback: unknown action, keep text
      return { text: line, pose: null, emote: null, reset: false };
    } catch (e) {
      // Defensive: any parse error returns original line untouched
      return { text: line, pose: null, emote: null, reset: false };
    }
  }

  /**
   * Parse a full multi-line text with markup tags.
   * Tracks persistent pose across lines until reset or new pose.
   * Returns: [{ text, pose, emote, reset }] per line
   */
  function parseMarkup(text) {
    var lines = text.split(/\r?\n/).filter(function (l) { return l.trim().length > 0; });
    var results = [];
    var currentPose = null;

    for (var i = 0; i < lines.length; i++) {
      var parsed = parseMarkupTag(lines[i]);
      if (parsed.reset) {
        currentPose = null;
      } else if (parsed.pose) {
        currentPose = parsed.pose;
      }
      // Inherit current pose for this line (pose persists)
      results.push({
        text: parsed.text,
        pose: currentPose,
        emote: parsed.emote,
        reset: parsed.reset
      });
    }
    return results;
  }

  /* ============================================
     3. PIXEL CAT CLASS
     ============================================ */

  /**
   * @class PixelCat
   * @param {HTMLElement|string} el  Target element or CSS selector
   * @param {Object} opts            Configuration options
   * @param {string} opts.state      Initial state: idle|curious|alert|sleeping|walking|happy
   * @param {string} opts.size       Size class: xs|sm|md|lg|xl
   * @param {boolean} opts.interactive  Enable mouse interactions (default true)
   * @param {boolean} opts.eyeTrack  Enable eye tracking (default true)
   * @param {boolean} opts.autoCycle Enable auto state cycling (default false)
   * @param {number} opts.cycleInterval  Auto cycle interval in ms (default 6000)
   * @param {boolean} opts.idleSpeech Enable random idle speech (default false)
   * @param {number} opts.idleSpeechInterval  Idle speech interval in ms (default 8000)
   * @param {string[]} opts.speeches  Custom click speech phrases
   * @param {string[]} opts.idlePhrases  Custom idle speech phrases
   * @param {number} opts.petThreshold  Clicks to trigger happy dance (default 3)
   */
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
    this._speechTimer = null;
    this._cycleTimer = null;
    this._idleTimer = null;
    this._lifeTimer = null;
    this._isInteracting = false;
    this._isDestroyed = false;

    // Speak system state
    this._speakQueue = [];
    this._speakTimer = null;
    this._isSpeaking = false;
    this._lastAction = 'idle';
    this._semanticAnalyzer = null;  // optional external AI analyzer

    // v2.0: Pose & Emote system state
    this._currentPose = null;        // active pose key (glasses/teach/book/...)
    this._emoteTimer = null;         // timer for transient emote cleanup
    this._propLayer = null;          // SVG <g> element for pose props
    this._emoteLayer = null;         // HTML div for emote bubbles above head
    this._bubbleSize = opts.bubbleSize || 'md';  // sm | md | lg
    this._bubblePosition = opts.bubblePosition || 'center'; // left | center | right

    this.speeches = opts.speeches || DEFAULT_SPEECHES;
    this.idlePhrases = opts.idlePhrases || DEFAULT_IDLE_PHRASES;
    this.petThreshold = opts.petThreshold || 3;
    this.interactive = opts.interactive !== false;
    this.eyeTrack = opts.eyeTrack !== false;
    this.autoCycle = opts.autoCycle || false;
    this.cycleInterval = opts.cycleInterval || 6000;
    this.idleSpeech = opts.idleSpeech || false;
    this.idleSpeechInterval = opts.idleSpeechInterval || 8000;

    // Prevent double initialization (autoInit + manual new PixelCat)
    var alreadyBuilt = el.hasAttribute('data-pc-init');
    if (!alreadyBuilt) {
      el.setAttribute('data-pc-init', 'true');
      this._build();
      this._bind();
    }
    this._startTimers();

    if (opts.state) {
      this.setState(opts.state);
    }
    if (opts.size) {
      el.classList.add('cat-size-' + opts.size);
    }
  }

  /* ----- 3.1 PRIVATE: DOM BUILDING ----- */

  PixelCat.prototype._build = function () {
    if (!this.el.querySelector('.pixel-cat-svg')) {
      // Speech bubble
      var bubble = document.createElement('div');
      bubble.className = 'cat-speech cat-bubble-' + this._bubbleSize + ' cat-bubble-' + this._bubblePosition;
      this.el.appendChild(bubble);

      // Cat SVG with empty prop layer (filled dynamically by setPose)
      var svgHtml = CAT_SVG.replace('</svg>', '<g class="cat-prop-layer"></g></svg>');
      this.el.insertAdjacentHTML('beforeend', svgHtml);

      // v2.0: Emote layer (above head, for transient bubbles like ❓💡‼️)
      var emoteLayer = document.createElement('div');
      emoteLayer.className = 'cat-emote-layer';
      this.el.appendChild(emoteLayer);
      this._emoteLayer = emoteLayer;

      // Cache prop layer reference
      this._propLayer = this.el.querySelector('.cat-prop-layer');
    }
    this.el.classList.add('cat-interactive');
    if (!ALL_STATES.some(function (s) { return this.el.classList.contains(s); }.bind(this))) {
      this.el.classList.add('cat-idle');
    }
  };

  /* ----- 3.2 PRIVATE: EVENT BINDING ----- */

  PixelCat.prototype._bind = function () {
    if (!this.interactive) return;
    this._bindEyeTracking();
    this._bindHover();
    this._bindClick();
  };

  PixelCat.prototype._bindEyeTracking = function () {
    if (!this.eyeTrack) return;
    var self = this;
    var pupils = this.el.querySelectorAll('.cat-pupil-l, .cat-pupil-r');
    if (pupils.length === 0) return;

    this.el.addEventListener('mousemove', function (e) {
      var rect = self.el.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = (e.clientX - cx) / rect.width;
      var dy = (e.clientY - cy) / rect.height;
      var maxMove = 4;
      var tx = Math.max(-maxMove, Math.min(maxMove, dx * maxMove * 2));
      var ty = Math.max(-maxMove, Math.min(maxMove, dy * maxMove * 1.5));
      pupils.forEach(function (p) {
        p.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px)';
      });
    });
  };

  PixelCat.prototype._bindHover = function () {
    var self = this;
    var pupils = this.el.querySelectorAll('.cat-pupil-l, .cat-pupil-r');

    this.el.addEventListener('mouseenter', function () {
      self._isInteracting = true;
      self.el.classList.add('cat-purring');
      if (Math.random() > 0.6) {
        self._createStarParticles(2 + Math.floor(Math.random() * 3));
      }
      if (Math.random() > 0.5) {
        self.say(self.idlePhrases[Math.floor(Math.random() * self.idlePhrases.length)], 1500);
      }
    });

    this.el.addEventListener('mouseleave', function () {
      self._isInteracting = false;
      self.el.classList.remove('cat-purring');
      pupils.forEach(function (p) { p.style.transform = ''; });
    });
  };

  PixelCat.prototype._bindClick = function () {
    var self = this;
    this.el.addEventListener('click', function (e) {
      self._petCount++;
      self.el.classList.add('cat-petted');
      setTimeout(function () { self.el.classList.remove('cat-petted'); }, 600);

      // Happy dance after threshold clicks
      if (self._petCount >= self.petThreshold) {
        self._petCount = 0;
        self.setState('happy');
        self.say('★ 好开心!', 2500);
        self._createStarParticles(5);
        setTimeout(function () { self.setState('idle'); }, 2500);
      }

      // Heart particles at click position
      var rect = self.el.getBoundingClientRect();
      self._createHeartParticles(e.clientX - rect.left, e.clientY - rect.top);

      // Random speech
      if (Math.random() > 0.2) {
        var speech = self.speeches[Math.floor(Math.random() * self.speeches.length)];
        self.say(speech, 1800);
      }
    });
  };

  /* ----- 3.3 PRIVATE: TIMERS ----- */

  PixelCat.prototype._startTimers = function () {
    var self = this;

    // Auto state cycling
    if (this.autoCycle) {
      var cycleIdx = 0;
      this._cycleTimer = setInterval(function () {
        if (self._isInteracting || self.el.classList.contains('cat-happy')) return;
        cycleIdx = (cycleIdx + 1) % CYCLE_STATES.length;
        self.setState(CYCLE_STATES[cycleIdx]);
      }, this.cycleInterval);
    }

    // Random idle speech
    if (this.idleSpeech) {
      this._idleTimer = setInterval(function () {
        if (self._isInteracting || self.el.classList.contains('cat-happy')) return;
        if (Math.random() > 0.7) {
          self.say(self.idlePhrases[Math.floor(Math.random() * self.idlePhrases.length)], 2000);
        }
      }, this.idleSpeechInterval);
    }

    // v2.3: Procedural life engine — spontaneous micro-behaviors
    this._startProceduralLife();
  };

  /* ============================================
     3.5 PRIVATE: PROCEDURAL LIFE ENGINE (v2.3)
     Spontaneous micro-behaviors layered ON TOP of
     existing CSS animations via Web Animations API
     with composite:'add'. Breaks repetitive CSS loops
     so each state feels alive and unpredictable.
     NOT new states — just accent variations.
     ============================================ */

  PixelCat.prototype._startProceduralLife = function () {
    var self = this;
    if (this._lifeTimer) clearTimeout(this._lifeTimer);

    function scheduleNext() {
      // v2.4: Natural timing — 70% normal (1.2-3.5s), 20% quick burst (400-800ms), 10% long pause (4-6s)
      var r = Math.random();
      var delay;
      if (r < 0.7) {
        delay = 1200 + Math.random() * 2300;
      } else if (r < 0.9) {
        delay = 400 + Math.random() * 400;
      } else {
        delay = 4000 + Math.random() * 2000;
      }
      self._lifeTimer = setTimeout(function () {
        if (!self._isInteracting && !self._isSpeaking && !self._isDestroyed && self.el) {
          self._fireMicroEvent();
        }
        if (!self._isDestroyed && self.el) scheduleNext();
      }, delay);
    }
    self._lifeTimer = setTimeout(function () {
      if (!self._isInteracting && !self._isSpeaking) self._fireMicroEvent();
      scheduleNext();
    }, 2000 + Math.random() * 2000);
  };

  PixelCat.prototype._fireMicroEvent = function () {
    var state = this.getState();
    if (!state) return;

    // v2.4: Expanded pools with COMBO events (chain existing accents)
    var events = {
      'cat-idle': ['earFlick', 'eyeDart', 'headTurn', 'lookAround', 'tailFlick', 'bodyShift', 'whiskerTwitch', 'comboIdle', 'comboRelax'],
      'cat-curious': ['earFlick', 'eyeDart', 'sniff', 'whiskerTwitch', 'headTurn', 'comboCurious', 'comboSniff'],
      'cat-alert': ['earRotate', 'eyeDart', 'scan', 'whiskerTwitch', 'comboAlert'],
      'cat-sleeping': ['dreamTwitch', 'earFlick', 'pawTwitch', 'comboDream'],
      'cat-walking': ['earFlick', 'eyeDart', 'headTurn', 'comboWalk'],
      'cat-happy': ['earFlick', 'eyeDart', 'extraBounce', 'comboHappy']
    };
    var pool = events[state] || ['earFlick', 'eyeDart'];
    var event = pool[Math.floor(Math.random() * pool.length)];
    try { this['_accent_' + event](); } catch (e) { /* defensive */ }
  };

  /** Play one-shot accent via WAAPI with composite:add (layers on CSS anims) */
  PixelCat.prototype._playAccent = function (selector, keyframes, options) {
    var el = this.el.querySelector(selector);
    if (!el) return;
    try {
      el.animate(keyframes, Object.assign({
        composite: 'add', fill: 'none', easing: 'cubic-bezier(0.4,0,0.2,1)'
      }, options || {}));
    } catch (e) { /* WAAPI unsupported — graceful skip */ }
  };

  PixelCat.prototype._accent_earFlick = function () {
    this._playAccent('.cat-ear-l', [
      { transform: 'rotate(0deg)' }, { transform: 'rotate(-25deg)' },
      { transform: 'rotate(-6deg)' }, { transform: 'rotate(-18deg)' }, { transform: 'rotate(0deg)' }
    ], { duration: 500 });
    this._playAccent('.cat-ear-r', [
      { transform: 'rotate(0deg)' }, { transform: 'rotate(25deg)' },
      { transform: 'rotate(6deg)' }, { transform: 'rotate(18deg)' }, { transform: 'rotate(0deg)' }
    ], { duration: 500, delay: 80 });
  };

  PixelCat.prototype._accent_eyeDart = function () {
    var dir = Math.random() > 0.5 ? 1 : -1;
    var d = 5 + Math.random() * 5;
    var kf = [
      { transform: 'translate(0,0)' }, { transform: 'translate(' + (dir*d) + 'px,-2px)' },
      { transform: 'translate(' + (dir*d*0.5) + 'px,2px)' }, { transform: 'translate(0,0)' }
    ];
    this._playAccent('.cat-pupil-l', kf, { duration: 700, easing: 'cubic-bezier(0.4,0,0.6,1)' });
    this._playAccent('.cat-pupil-r', kf, { duration: 700, easing: 'cubic-bezier(0.4,0,0.6,1)' });
  };

  PixelCat.prototype._accent_headTurn = function () {
    var dir = Math.random() > 0.5 ? 1 : -1;
    this._playAccent('.cat-head', [
      { transform: 'rotate(0deg) translateX(0)' },
      { transform: 'rotate(' + (dir*15) + 'deg) translateX(' + (dir*4) + 'px)' },
      { transform: 'rotate(' + (dir*8) + 'deg) translateX(' + (dir*2) + 'px)' },
      { transform: 'rotate(' + (-dir*5) + 'deg) translateX(0)' },
      { transform: 'rotate(0deg) translateX(0)' }
    ], { duration: 1000 });
  };

  PixelCat.prototype._accent_lookAround = function () {
    var kf = [
      { transform: 'translate(0,0)' }, { transform: 'translate(-8px,0)' },
      { transform: 'translate(-5px,-2px)' }, { transform: 'translate(8px,0)' },
      { transform: 'translate(5px,-2px)' }, { transform: 'translate(0,0)' }
    ];
    this._playAccent('.cat-pupil-l', kf, { duration: 1500, easing: 'cubic-bezier(0.4,0,0.6,1)' });
    this._playAccent('.cat-pupil-r', kf, { duration: 1500, easing: 'cubic-bezier(0.4,0,0.6,1)' });
    this._playAccent('.cat-head', [
      { transform: 'rotate(0deg)' }, { transform: 'rotate(-10deg)' },
      { transform: 'rotate(-5deg)' }, { transform: 'rotate(10deg)' },
      { transform: 'rotate(5deg)' }, { transform: 'rotate(0deg)' }
    ], { duration: 1500, easing: 'cubic-bezier(0.4,0,0.6,1)' });
  };

  PixelCat.prototype._accent_tailFlick = function () {
    this._playAccent('.cat-tail', [
      { transform: 'rotate(0deg)' }, { transform: 'rotate(45deg)' },
      { transform: 'rotate(20deg)' }, { transform: 'rotate(55deg)' },
      { transform: 'rotate(30deg)' }, { transform: 'rotate(0deg)' }
    ], { duration: 800 });
  };

  PixelCat.prototype._accent_bodyShift = function () {
    var dir = Math.random() > 0.5 ? 1 : -1;
    this._playAccent('.cat-body', [
      { transform: 'translateX(0)' }, { transform: 'translateX(' + (dir*4) + 'px)' },
      { transform: 'translateX(' + (dir*2) + 'px)' }, { transform: 'translateX(0)' }
    ], { duration: 1000, easing: 'cubic-bezier(0.4,0,0.6,1)' });
  };

  PixelCat.prototype._accent_sniff = function () {
    this._playAccent('.cat-head', [
      { transform: 'translateY(0)' }, { transform: 'translateY(5px) rotate(4deg)' },
      { transform: 'translateY(2px) rotate(2deg)' }, { transform: 'translateY(7px) rotate(5deg)' },
      { transform: 'translateY(0)' }
    ], { duration: 800 });
    this._playAccent('.cat-whisker-l', [
      { transform: 'rotate(0deg)' }, { transform: 'rotate(-14deg)' },
      { transform: 'rotate(-5deg)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(0deg)' }
    ], { duration: 800 });
    this._playAccent('.cat-whisker-r', [
      { transform: 'rotate(0deg)' }, { transform: 'rotate(14deg)' },
      { transform: 'rotate(5deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(0deg)' }
    ], { duration: 800, delay: 50 });
  };

  PixelCat.prototype._accent_whiskerTwitch = function () {
    this._playAccent('.cat-whisker-l', [
      { transform: 'rotate(0deg)' }, { transform: 'rotate(-12deg)' },
      { transform: 'rotate(-3deg)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(0deg)' }
    ], { duration: 500 });
    this._playAccent('.cat-whisker-r', [
      { transform: 'rotate(0deg)' }, { transform: 'rotate(12deg)' },
      { transform: 'rotate(3deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0deg)' }
    ], { duration: 500, delay: 50 });
  };

  PixelCat.prototype._accent_earRotate = function () {
    this._playAccent('.cat-ear-l', [
      { transform: 'rotate(0deg)' }, { transform: 'rotate(-30deg)' },
      { transform: 'rotate(-15deg)' }, { transform: 'rotate(-38deg)' }, { transform: 'rotate(0deg)' }
    ], { duration: 600 });
    this._playAccent('.cat-ear-r', [
      { transform: 'rotate(0deg)' }, { transform: 'rotate(38deg)' },
      { transform: 'rotate(22deg)' }, { transform: 'rotate(30deg)' }, { transform: 'rotate(0deg)' }
    ], { duration: 600, delay: 100 });
  };

  PixelCat.prototype._accent_scan = function () {
    this._playAccent('.cat-head', [
      { transform: 'rotate(0deg)' }, { transform: 'rotate(-12deg)' },
      { transform: 'rotate(-5deg)' }, { transform: 'rotate(12deg)' },
      { transform: 'rotate(5deg)' }, { transform: 'rotate(0deg)' }
    ], { duration: 1000 });
    var ekf = [
      { transform: 'translate(0,0)' }, { transform: 'translate(-8px,0)' },
      { transform: 'translate(0,-2px)' }, { transform: 'translate(8px,0)' }, { transform: 'translate(0,0)' }
    ];
    this._playAccent('.cat-pupil-l', ekf, { duration: 1000 });
    this._playAccent('.cat-pupil-r', ekf, { duration: 1000 });
  };

  PixelCat.prototype._accent_dreamTwitch = function () {
    this._playAccent('.cat-body', [
      { transform: 'scaleY(1)' }, { transform: 'scaleY(1.04) translateY(2px)' },
      { transform: 'scaleY(1.02) translateY(1px)' }, { transform: 'scaleY(1)' }
    ], { duration: 500 });
    this._playAccent('.cat-ear-l', [
      { transform: 'rotate(6deg)' }, { transform: 'rotate(18deg)' },
      { transform: 'rotate(12deg)' }, { transform: 'rotate(6deg)' }
    ], { duration: 500, delay: 100 });
    this._playAccent('.cat-whisker-l', [
      { transform: 'rotate(2deg)' }, { transform: 'rotate(10deg)' },
      { transform: 'rotate(5deg)' }, { transform: 'rotate(2deg)' }
    ], { duration: 500, delay: 200 });
  };

  PixelCat.prototype._accent_pawTwitch = function () {
    this._playAccent('.cat-body', [
      { transform: 'translateY(0)' }, { transform: 'translateY(-2px)' },
      { transform: 'translateY(0)' }, { transform: 'translateY(-1px)' },
      { transform: 'translateY(0)' }
    ], { duration: 400 });
  };

  PixelCat.prototype._accent_extraBounce = function () {
    this._playAccent('.cat-body', [
      { transform: 'translateY(0)' }, { transform: 'translateY(-12px)' },
      { transform: 'translateY(0)' }
    ], { duration: 400, easing: 'cubic-bezier(0.34,1.56,0.64,1)' });
  };

  /* ============================================
     3.7 COMPOUND MICRO-EVENTS (v2.4)
     Chain EXISTING accents together for richer,
     multi-part micro-behaviors. No new accent
     types — just natural combinations.
     ============================================ */

  // Idle: tail flick + body shift (lazy repositioning)
  PixelCat.prototype._accent_comboIdle = function () {
    this._accent_tailFlick();
    var self = this;
    setTimeout(function () { self._accent_bodyShift(); }, 200);
  };

  // Idle: slow blink + ear flick + whisker twitch (full relaxation moment)
  PixelCat.prototype._accent_comboRelax = function () {
    this._playAccent('.cat-ear-l', [
      { transform: 'rotate(0deg)' }, { transform: 'rotate(-15deg)' },
      { transform: 'rotate(0deg)' }
    ], { duration: 800, easing: 'cubic-bezier(0.4,0,0.2,1)' });
    this._playAccent('.cat-ear-r', [
      { transform: 'rotate(0deg)' }, { transform: 'rotate(15deg)' },
      { transform: 'rotate(0deg)' }
    ], { duration: 800, delay: 100, easing: 'cubic-bezier(0.4,0,0.2,1)' });
    this._accent_whiskerTwitch();
  };

  // Curious: ear flick + eye dart + head turn (full attention sequence)
  PixelCat.prototype._accent_comboCurious = function () {
    this._accent_earFlick();
    var self = this;
    setTimeout(function () { self._accent_eyeDart(); }, 150);
    setTimeout(function () { self._accent_headTurn(); }, 400);
  };

  // Curious: sniff + whisker twitch (investigating scent)
  PixelCat.prototype._accent_comboSniff = function () {
    this._accent_sniff();
    var self = this;
    setTimeout(function () { self._accent_whiskerTwitch(); }, 300);
  };

  // Alert: ear rotate + scan (full threat assessment)
  PixelCat.prototype._accent_comboAlert = function () {
    this._accent_earRotate();
    var self = this;
    setTimeout(function () { self._accent_scan(); }, 200);
  };

  // Sleeping: dream twitch + paw twitch + ear flick (dreaming sequence)
  PixelCat.prototype._accent_comboDream = function () {
    this._accent_dreamTwitch();
    var self = this;
    setTimeout(function () { self._accent_pawTwitch(); }, 300);
    setTimeout(function () { self._accent_earFlick(); }, 600);
  };

  // Walking: ear flick + head turn (checking surroundings while moving)
  PixelCat.prototype._accent_comboWalk = function () {
    this._accent_earFlick();
    var self = this;
    setTimeout(function () { self._accent_headTurn(); }, 200);
  };

  // Happy: extra bounce + ear flick (joy burst)
  PixelCat.prototype._accent_comboHappy = function () {
    this._accent_extraBounce();
    var self = this;
    setTimeout(function () { self._accent_earFlick(); }, 100);
  };

  /* ----- 3.4 PRIVATE: PARTICLE SYSTEM ----- */

  /**
   * Spawn heart particles at given coordinates.
   * @param {number} x  X offset relative to container
   * @param {number} y  Y offset relative to container
   */
  PixelCat.prototype._createHeartParticles = function (x, y) {
    var count = 3 + Math.floor(Math.random() * 2);
    for (var i = 0; i < count; i++) {
      var heart = document.createElement('div');
      heart.className = 'heart-particle';
      heart.style.left = (x - 9 + (Math.random() * 20 - 10)) + 'px';
      heart.style.top = (y - 9) + 'px';
      heart.style.setProperty('--hx', (Math.random() * 70 - 35) + 'px');
      heart.style.animationDelay = (i * 80) + 'ms';
      heart.innerHTML = HEART_SVG;
      this.el.appendChild(heart);
      this._scheduleRemoval(heart, 1600);
    }
  };

  /**
   * Spawn star particles at random positions within the cat.
   * @param {number} count  Number of particles
   */
  PixelCat.prototype._createStarParticles = function (count) {
    var rect = this.el.getBoundingClientRect();
    for (var i = 0; i < count; i++) {
      var star = document.createElement('div');
      star.className = 'star-particle';
      star.style.left = (rect.width * 0.3 + Math.random() * rect.width * 0.4) + 'px';
      star.style.top = (rect.height * 0.2 + Math.random() * rect.height * 0.3) + 'px';
      star.style.setProperty('--sx', (Math.random() * 40 - 20) + 'px');
      star.style.setProperty('--sy', (Math.random() * -30 - 20) + 'px');
      star.style.animationDelay = (i * 100) + 'ms';
      star.innerHTML = STAR_SVG;
      this.el.appendChild(star);
      this._scheduleRemoval(star, 1200);
    }
  };

  /**
   * Remove a DOM element after a delay.
   * @param {HTMLElement} node     Element to remove
   * @param {number} delay         Delay in ms
   */
  PixelCat.prototype._scheduleRemoval = function (node, delay) {
    setTimeout(function () {
      if (node.parentNode) node.parentNode.removeChild(node);
    }, delay);
  };

  /* ============================================
     4. PUBLIC API
     ============================================ */

  /**
   * Set the cat's state.
   * @param {string} state  idle|curious|alert|sleeping|walking|happy
   */
  PixelCat.prototype.setState = function (state) {
    var cls = state.startsWith('cat-') ? state : 'cat-' + state;
    ALL_STATES.forEach(function (s) { this.el.classList.remove(s); }.bind(this));
    this.el.classList.add(cls);
  };

  /**
   * Get current state class name.
   * @returns {string|null}
   */
  PixelCat.prototype.getState = function () {
    for (var i = 0; i < ALL_STATES.length; i++) {
      if (this.el.classList.contains(ALL_STATES[i])) return ALL_STATES[i];
    }
    return null;
  };

  /**
   * Show a speech bubble.
   * @param {string} text      Speech text
   * @param {number} duration  Duration in ms (default 1800)
   */
  PixelCat.prototype.say = function (text, duration) {
    var bubble = this.el.querySelector('.cat-speech');
    if (!bubble) return;
    bubble.textContent = text;
    this.el.classList.add('cat-talking');
    this.el.classList.add('cat-speaking');
    clearTimeout(this._speechTimer);
    this._speechTimer = setTimeout(function () {
      this.el.classList.remove('cat-talking');
      this.el.classList.remove('cat-speaking');
    }.bind(this), duration || 1800);
  };

  /**
   * Trigger happy dance immediately.
   * @param {number} duration  Duration in ms (default 2500)
   */
  PixelCat.prototype.happy = function (duration) {
    this.setState('happy');
    this.say('★ 好开心!', duration || 2500);
    this._createStarParticles(5);
    var self = this;
    setTimeout(function () { self.setState('idle'); }, duration || 2500);
  };

  /**
   * Set size variant.
   * @param {string} size  xs|sm|md|lg|xl
   */
  PixelCat.prototype.setSize = function (size) {
    SIZE_KEYS.forEach(function (s) {
      this.el.classList.remove('cat-size-' + s);
    }.bind(this));
    this.el.classList.add('cat-size-' + size);
  };

  /**
   * Update speech phrases.
   * @param {string[]} speeches    Click phrases
   * @param {string[]} idlePhrases Idle phrases
   */
  PixelCat.prototype.setSpeeches = function (speeches, idlePhrases) {
    if (speeches) this.speeches = speeches;
    if (idlePhrases) this.idlePhrases = idlePhrases;
  };

  /* ============================================
     4.1 v2.0 POSE & EMOTE API
     ============================================ */

  /**
   * Set a persistent pose (overlay prop on cat).
   * @param {string|null} pose  glasses|teach|book|keyboard|present|think|null
   */
  PixelCat.prototype.setPose = function (pose) {
    // Defensive: clear any existing pose first
    this.clearPose();
    if (!pose || pose === 'idle') return;

    var def = POSE_ACTIONS[pose];
    if (!def) {
      console.warn('[PixelCat] Unknown pose:', pose);
      return;
    }

    this._currentPose = pose;

    // Inject prop SVG into prop layer
    if (this._propLayer) {
      var svg = PROP_SVGS[def.svgKey];
      if (svg) {
        try {
          this._propLayer.innerHTML = svg;
        } catch (e) {
          // Defensive: SVG injection failure is non-fatal
          console.warn('[PixelCat] Failed to inject pose prop:', e);
        }
      }
    }

    // Add pose class for CSS effects (body lean, head tilt, etc.)
    this.el.classList.add(def.cls);
  };

  /**
   * Clear the current pose and remove all props.
   */
  PixelCat.prototype.clearPose = function () {
    if (this._currentPose) {
      var def = POSE_ACTIONS[this._currentPose];
      if (def) this.el.classList.remove(def.cls);
    }
    this._currentPose = null;

    if (this._propLayer) {
      try { this._propLayer.innerHTML = ''; } catch (e) { /* defensive */ }
    }
  };

  /**
   * Get current pose key.
   * @returns {string|null}
   */
  PixelCat.prototype.getPose = function () {
    return this._currentPose;
  };

  /**
   * Trigger a transient emote (head bubble above cat).
   * @param {string} emote  question|shock|idea|thumbsup|deny
   * @param {number} duration  Duration in ms (optional, uses default)
   */
  PixelCat.prototype.triggerEmote = function (emote, duration) {
    var def = EMOTE_ACTIONS[emote];
    if (!def) {
      console.warn('[PixelCat] Unknown emote:', emote);
      return;
    }

    // Clear any existing emote
    if (this._emoteTimer) {
      clearTimeout(this._emoteTimer);
    }

    if (!this._emoteLayer) return;

    var dur = duration || def.duration;

    try {
      var svg = EMOTE_SVGS[emote];
      if (!svg) return;

      this._emoteLayer.innerHTML = svg;
      this._emoteLayer.className = 'cat-emote-layer cat-emote-show ' + def.cls;

      var self = this;
      this._emoteTimer = setTimeout(function () {
        self._emoteLayer.className = 'cat-emote-layer';
        try { self._emoteLayer.innerHTML = ''; } catch (e) { /* defensive */ }
      }, dur);
    } catch (e) {
      // Defensive: emote failure is non-fatal
      console.warn('[PixelCat] Emote trigger failed:', e);
    }
  };

  /**
   * Set bubble size.
   * @param {string} size  sm|md|lg
   */
  PixelCat.prototype.setBubbleSize = function (size) {
    var bubble = this.el.querySelector('.cat-speech');
    if (!bubble) return;
    bubble.classList.remove('cat-bubble-sm', 'cat-bubble-md', 'cat-bubble-lg');
    bubble.classList.add('cat-bubble-' + size);
    this._bubbleSize = size;
  };

  /**
   * Set bubble position.
   * @param {string} pos  left|center|right
   */
  PixelCat.prototype.setBubblePosition = function (pos) {
    var bubble = this.el.querySelector('.cat-speech');
    if (!bubble) return;
    bubble.classList.remove('cat-bubble-left', 'cat-bubble-center', 'cat-bubble-right');
    bubble.classList.add('cat-bubble-' + pos);
    this._bubblePosition = pos;
  };

  /* ============================================
     4.2 SEMANTIC ENGINE + SPEAK SYSTEM
     ============================================ */

  /**
   * Set an external semantic analyzer function.
   * When set, this overrides the local keyword matcher.
   * @param {Function|null} analyzer  fn(sentence) → Promise<{action, confidence}>
   */
  PixelCat.prototype.setSemanticAnalyzer = function (analyzer) {
    this._semanticAnalyzer = typeof analyzer === 'function' ? analyzer : null;
  };

  /**
   * Analyze a sentence and determine the best matching action.
   * Uses external AI analyzer if set, otherwise falls back to local keyword matching.
   * @param {string} sentence
   * @returns {Object} { action: string, confidence: number }
   */
  PixelCat.prototype._analyzeSemantic = function (sentence) {
    // External analyzer (async path handled in _prepareSpeakQueue)
    if (this._semanticAnalyzer) {
      return this._semanticAnalyzer(sentence);
    }
    // Local keyword matching
    return this._localSemanticMatch(sentence);
  };

  /**
   * Local keyword-based semantic matcher.
   * @param {string} sentence
   * @returns {Object} { action: string, confidence: number }
   */
  PixelCat.prototype._localSemanticMatch = function (sentence) {
    var best = { action: 'idle', confidence: 0, type: 'state' };
    var lower = sentence.toLowerCase();

    for (var i = 0; i < SEMANTIC_RULES.length; i++) {
      var rule = SEMANTIC_RULES[i];
      for (var j = 0; j < rule.keywords.length; j++) {
        var kw = rule.keywords[j].toLowerCase();
        if (lower.indexOf(kw) !== -1) {
          if (rule.weight > best.confidence) {
            best = { action: rule.action, confidence: rule.weight, type: rule.type || 'state' };
          }
        }
      }
    }
    return best;
  };

  /**
   * Speak a block of text. Supports markup tags: [戴眼镜]text [/]
   * Splits by newlines, parses tags, analyzes semantics, plays with actions.
   *
   * Priority engine:
   *   POSE: manual > auto (markup pose overrides AI, persists until reset)
   *   EMOTE: auto > manual (AI auto-fires emote, manual as supplement)
   *
   * Density strategy (口播模式, prevents jitter):
   *   confidence < 0.4 → no action change, keep current pose + mouth
   *   0.4-0.7 → micro-expression only
   *   ≥ 0.7 → full action switch
   *
   * @param {string} text     Multi-line text, each line = one sentence
   * @param {Object} opts     { onProgress, onComplete, speed, broadcast }
   */
  PixelCat.prototype.speak = function (text, opts) {
    opts = opts || {};
    var speed = opts.speed || 1.0;
    var self = this;

    // Cancel any ongoing speech
    this.stopSpeak();

    // v2.0: Parse markup tags first, extract pose/emote + cleaned text
    var parsedLines = parseMarkup(text);
    if (parsedLines.length === 0) return;

    this._isSpeaking = true;
    this._speakSpeed = speed;
    this._bubbleSide = undefined;  // reset bubble side for new speak session

    // Build analysis queue: combine markup + semantic analysis
    this._prepareAnalyzedQueue(parsedLines, speed, opts);
  };

  /**
   * v2.6: Speak with precise timeline control (for video sync / transparent overlay).
   * Uses requestAnimationFrame for rock-solid timing accuracy.
   * Each item fires at its absolute time t (seconds from start).
   * @param {Array} timeline - [{ t: startSeconds, text, emote, pose, state }]
   */
  PixelCat.prototype.speakTimed = function (timeline, opts) {
    opts = opts || {};
    var self = this;

    this.stopSpeak();
    if (!timeline || timeline.length === 0) return;

    this._isSpeaking = true;
    this._bubbleSide = undefined;
    this._speakSpeed = 1.0;

    // Parse & filter
    var items = [];
    for (var i = 0; i < timeline.length; i++) {
      var line = timeline[i];
      var parsed = parseMarkupTag(line.text || '');
      var text = parsed.text.trim();
      if (!text) continue;
      items.push({
        t: line.t || 0,
        text: text,
        emote: line.emote || parsed.emote || null,
        pose: line.pose || parsed.pose || null,
        state: line.state || null
      });
    }
    items.sort(function (a, b) { return a.t - b.t; });

    // Pre-compute durations
    for (var j = 0; j < items.length; j++) {
      if (j + 1 < items.length) {
        items[j].dur = Math.max(500, (items[j + 1].t - items[j].t) * 1000 - 80);
      } else {
        items[j].dur = 2500;
      }
    }

    var startTs = performance.now();
    var rafId = null;
    var mouthTimers = [];
    var finished = false;
    var currentIdx = 0;

    function clearAllMouthTimers() {
      mouthTimers.forEach(function (id) { clearTimeout(id); });
      mouthTimers = [];
    }

    function fireItem(item, idx) {
      // Position bubble
      self._adaptBubblePosition(item.emote, item.text);

      // Stable idle state
      self.setState('idle');
      self._lastAction = 'idle';

      if (item.pose && item.pose !== self._currentPose) {
        self.setPose(item.pose);
      }
      if (item.emote) {
        self.triggerEmote(item.emote);
      }

      var bubble = self.el.querySelector('.cat-speech');
      if (bubble) bubble.textContent = item.text;
      self.el.classList.add('cat-talking');
      self.el.classList.add('cat-speaking');

      if (opts.onProgress) {
        opts.onProgress({ index: idx, total: items.length, text: item.text, t: item.t });
      }

      // Mouth stops after duration
      clearAllMouthTimers();
      var mt = setTimeout(function () {
        self.el.classList.remove('cat-talking');
      }, item.dur);
      mouthTimers.push(mt);
    }

    function tick(now) {
      if (!self._isSpeaking || finished) return;
      var elapsed = (now - startTs) / 1000;

      // Fire next item if its time has come
      while (currentIdx < items.length && items[currentIdx].t <= elapsed) {
        fireItem(items[currentIdx], currentIdx);
        currentIdx++;
      }

      // Check if all done
      if (currentIdx >= items.length) {
        var last = items[items.length - 1];
        if (elapsed > last.t + last.dur / 1000 + 0.8) {
          finished = true;
          self._isSpeaking = false;
          self.el.classList.remove('cat-speaking');
          self.el.classList.remove('cat-talking');
          self.setState('idle');
          self.clearPose();
          var bubble = self.el.querySelector('.cat-speech');
          if (bubble) bubble.textContent = '';
          if (self._emoteTimer) {
            clearTimeout(self._emoteTimer);
            if (self._emoteLayer) {
              self._emoteLayer.className = 'cat-emote-layer';
              self._emoteLayer.innerHTML = '';
            }
          }
          clearAllMouthTimers();
          if (opts.onComplete) opts.onComplete();
          return;
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    this._timedRafId = rafId;
    this._timedMouthClear = clearAllMouthTimers;
  };

  /**
   * Prepare the analyzed queue: merge markup (manual) + semantic (auto).
   * Priority engine decides final action per line.
   */
  PixelCat.prototype._prepareAnalyzedQueue = function (parsedLines, speed, opts) {
    var self = this;
    var queue = [];

    for (var i = 0; i < parsedLines.length; i++) {
      var p = parsedLines[i];
      var autoResult = this._analyzeSemantic(p.text);

      // Handle async external analyzer
      if (autoResult && typeof autoResult.then === 'function') {
        // Defer: will resolve later
        queue.push({ parsed: p, autoPromise: autoResult });
      } else {
        queue.push({ parsed: p, auto: autoResult });
      }
    }

    // Check for async
    var hasPromise = queue.some(function (q) { return q.autoPromise; });
    if (hasPromise) {
      var promises = queue.map(function (q) {
        return q.autoPromise ? q.autoPromise : Promise.resolve(q.auto);
      });
      Promise.all(promises).then(function (resolved) {
        var merged = queue.map(function (q, i) {
          return { parsed: q.parsed, auto: resolved[i] || { action: 'idle', confidence: 0, type: 'state' } };
        });
        self._startPlaybackV2(merged, speed, opts);
      }).catch(function () {
        // Fallback: local matching
        var fallback = queue.map(function (q) {
          return { parsed: q.parsed, auto: self._localSemanticMatch(q.parsed.text) };
        });
        self._startPlaybackV2(fallback, speed, opts);
      });
    } else {
      var merged = queue.map(function (q) {
        return { parsed: q.parsed, auto: q.auto || { action: 'idle', confidence: 0, type: 'state' } };
      });
      this._startPlaybackV2(merged, speed, opts);
    }
  };

  /**
   * v2.0 Playback engine with priority + density.
   * Each item: { parsed: {text, pose, emote, reset}, auto: {action, confidence, type} }
   */
  PixelCat.prototype._startPlaybackV2 = function (items, speed, opts) {
    var self = this;
    var idx = 0;

    function playNext() {
      if (idx >= items.length) {
        // All done — return to idle, stop mouth, clear pose
        self._isSpeaking = false;
        self.el.classList.remove('cat-speaking');
        self.el.classList.remove('cat-talking');
        self.setState('idle');
        self.clearPose();
        self._lastAction = 'idle';
        // Clear speech bubble after a short fade
        var bubble = self.el.querySelector('.cat-speech');
        if (bubble) bubble.textContent = '';
        // Clear emote
        if (self._emoteTimer) {
          clearTimeout(self._emoteTimer);
          if (self._emoteLayer) {
            self._emoteLayer.className = 'cat-emote-layer';
            self._emoteLayer.innerHTML = '';
          }
        }
        if (opts.onComplete) opts.onComplete();
        return;
      }

      var item = items[idx];
      var sentence = item.parsed.text.trim();
      var manualPose = item.parsed.pose;
      var manualEmote = item.parsed.emote;
      var doReset = item.parsed.reset;
      var auto = item.auto || { action: 'idle', confidence: 0, type: 'state' };

      // === PRIORITY ENGINE ===

      // 1. POSE: manual > auto
      var finalPose = null;
      if (doReset) {
        finalPose = null;  // explicit reset
      } else if (manualPose) {
        finalPose = manualPose;  // manual marker wins
      } else if (auto.type === 'pose' && auto.confidence >= DENSITY_MID) {
        finalPose = auto.action;  // AI suggests pose, high confidence
      } else {
        finalPose = self._currentPose;  // keep current (persist)
      }

      // 2. STATE: v2.6 — default to idle for stable speaking, only switch on VERY strong signals
      var finalState = 'idle';
      if (auto.type === 'state' && auto.confidence >= DENSITY_MID) {
        finalState = auto.action;
      } else {
        finalState = 'idle';  // stay calm and centered while speaking — no curious tilt spam
      }

      // 3. EMOTE: auto > manual (auto fires first, manual as supplement)
      // v2.6: raised threshold for emotes to prevent over-reacting
      var finalEmote = null;
      if (auto.type === 'emote' && auto.confidence >= DENSITY_EMOTE) {
        finalEmote = auto.action;  // AI auto-fires
      } else if (manualEmote) {
        finalEmote = manualEmote;  // manual supplement (markup tags always work)
      }

      // Calculate duration with punctuation-aware timing
      var duration = self._calcSentenceDuration(sentence, speed);

      // Determine inter-sentence gap based on ending punctuation
      var nextGap = self._calcSentenceGap(sentence);

      // Smart bubble positioning: avoid emote overlap
      self._adaptBubblePosition(finalEmote, sentence);

      // Progress callback
      if (opts.onProgress) {
        opts.onProgress({
          index: idx,
          total: items.length,
          text: sentence,
          action: finalState,
          pose: finalPose,
          emote: finalEmote
        });
      }

      // Execute: pose + state + emote + mouth
      self._performSentenceV2(sentence, finalState, finalPose, finalEmote, duration, function () {
        idx++;
        self._speakTimer = setTimeout(playNext, nextGap);
      });
    }

    playNext();
  };

  /* ============================================
     v2.5 NATURAL SPEECH RHYTHM HELPERS
     Punctuation-aware duration + smart bubble positioning
     ============================================ */

  /**
   * Calculate natural speaking duration for a sentence.
   * - Base: chars * MS_PER_CHAR
   * - Adds pauses for internal punctuation (commas, etc.)
   * - Enforces minimum duration
   */
  PixelCat.prototype._calcSentenceDuration = function (sentence, speed) {
    var base = sentence.length * MS_PER_CHAR / speed;

    // Add internal punctuation pauses
    var commaCount = (sentence.match(/[，、；,;]/g) || []).length;
    var pauseCount = (sentence.match(/[：:…—\-]/g) || []).length;
    var internalPauses = commaCount * COMMA_GAP * 0.6 + pauseCount * SHORT_GAP;

    // English words/numbers speak slightly slower per char
    var englishRatio = (sentence.match(/[a-zA-Z0-9]/g) || []).length / Math.max(sentence.length, 1);
    var englishAdjust = 1 + englishRatio * 0.3; // up to 30% more time for English-heavy text

    var total = (base + internalPauses) * englishAdjust;
    return Math.max(MIN_DURATION, total);
  };

  /**
   * Calculate gap AFTER this sentence before the next one,
   * based on ending punctuation.
   */
  PixelCat.prototype._calcSentenceGap = function (sentence) {
    var trimmed = sentence.replace(/\s+$/, '');
    var lastChar = trimmed.charAt(trimmed.length - 1);

    // Strong ending: period, exclamation, question mark, ellipsis → full breath
    if (/[。！？!？…]/.test(lastChar)) {
      return SENTENCE_GAP;
    }
    // Medium ending: comma, semicolon → shorter pause (mid-thought)
    if (/[，；,;]/.test(lastChar)) {
      return COMMA_GAP;
    }
    // Weak/no ending: clause continues → short gap
    return SHORT_GAP;
  };

  /**
   * v2.6 Smart bubble positioning:
   * - Default: always CENTERED above cat's head (stable, no wobble)
   * - When emote is active AND text is long enough to overlap, shift slightly
   * - Auto-size bubble based on text length
   * - Bubble sits high enough to never cover the cat
   */
  PixelCat.prototype._adaptBubblePosition = function (emote, sentence) {
    var bubble = this.el.querySelector('.cat-speech');
    if (!bubble) return;

    // Remove all position/size/shape classes first
    bubble.classList.remove(
      'cat-bubble-left', 'cat-bubble-center', 'cat-bubble-right',
      'cat-bubble-sm', 'cat-bubble-md', 'cat-bubble-lg',
      'cat-bubble-wide', 'cat-bubble-tall', 'cat-bubble-shape-think'
    );

    // ALWAYS center by default — stable, no wobble
    var pos = 'center';

    // Only shift if emote is active AND text is long (>10 chars) where overlap is possible
    // Even then, use a gentle offset, not full left/right
    if (emote && sentence.length > 10) {
      // Use consistent side per speak session (stored on instance), not per-sentence
      if (this._bubbleSide === undefined) {
        this._bubbleSide = Math.random() < 0.5 ? 'left' : 'right';
      }
      pos = this._bubbleSide;
    }

    bubble.classList.add('cat-bubble-' + pos);

    // Auto-size: based on character count
    var len = sentence.length;
    var size;
    if (len <= 5) {
      size = 'sm';
    } else if (len <= 12) {
      size = 'md';
    } else if (len <= 20) {
      size = 'lg';
    } else {
      size = 'lg';
      bubble.classList.add('cat-bubble-wide');
    }
    bubble.classList.add('cat-bubble-' + size);

    // Shape variant: for question/idea emotes, use think bubble
    if (emote === 'question' || emote === 'idea') {
      bubble.classList.add('cat-bubble-shape-think');
    }
  };

  /**
   * v2.0 Perform one sentence with smooth transitions.
   * Handles pose change, state change, emote trigger, and mouth animation.
   */
  PixelCat.prototype._performSentenceV2 = function (sentence, state, pose, emote, duration, done) {
    var self = this;
    var needsTransition = (state !== this._lastAction && this._lastAction !== 'idle') ||
                          (pose !== this._currentPose);

    if (needsTransition) {
      // Brief return to idle for smoothness
      this.setState('idle');
      this._lastAction = 'idle';
      if (pose !== this._currentPose) {
        this.clearPose();
      }

      this._speakTimer = setTimeout(function () {
        self._executeSentenceV2(sentence, state, pose, emote, duration, done);
      }, TRANSITION_GAP);
    } else {
      this._executeSentenceV2(sentence, state, pose, emote, duration, done);
    }
  };

  /**
   * v2.0 Execute: set state + pose + emote + bubble + mouth.
   */
  PixelCat.prototype._executeSentenceV2 = function (sentence, state, pose, emote, duration, done) {
    var self = this;

    // Set body state
    this.setState(state);
    this._lastAction = state;

    // Set pose (only change if different)
    if (pose !== this._currentPose) {
      this.setPose(pose);
    }

    // Trigger emote (transient, fires immediately)
    if (emote) {
      this.triggerEmote(emote);
    }

    // Show speech bubble
    var bubble = this.el.querySelector('.cat-speech');
    if (bubble) bubble.textContent = sentence;

    // Start mouth speaking
    this.el.classList.add('cat-talking');
    this.el.classList.add('cat-speaking');

    // After duration, close mouth
    clearTimeout(this._speechTimer);
    this._speechTimer = setTimeout(function () {
      self.el.classList.remove('cat-talking');
      self.el.classList.remove('cat-speaking');
      done();
    }, duration);
  };

  /**
   * Stop any ongoing speak sequence immediately.
   */
  PixelCat.prototype.stopSpeak = function () {
    clearTimeout(this._speakTimer);
    clearTimeout(this._speechTimer);
    // v2.6: cancel timed playback (rAF + mouth timers)
    if (this._timedRafId) {
      cancelAnimationFrame(this._timedRafId);
      this._timedRafId = null;
    }
    if (this._timedMouthClear) {
      this._timedMouthClear();
      this._timedMouthClear = null;
    }
    this._speakQueue = [];
    this._isSpeaking = false;
    this.el.classList.remove('cat-speaking');
    this.el.classList.remove('cat-talking');
    // v2.0: cleanup pose and emote
    this.clearPose();
    if (this._emoteTimer) {
      clearTimeout(this._emoteTimer);
      if (this._emoteLayer) {
        this._emoteLayer.className = 'cat-emote-layer';
        this._emoteLayer.innerHTML = '';
      }
    }
  };

  /**
   * Check if currently speaking.
   * @returns {boolean}
   */
  PixelCat.prototype.isSpeaking = function () {
    return this._isSpeaking;
  };

  /**
   * Destroy the instance, clean up timers and listeners.
   */
  PixelCat.prototype.destroy = function () {
    clearTimeout(this._speechTimer);
    clearTimeout(this._speakTimer);
    clearTimeout(this._emoteTimer);
    clearInterval(this._cycleTimer);
    clearInterval(this._idleTimer);
    this._isSpeaking = false;
    this.clearPose();
    var clone = this.el.cloneNode(true);
    this.el.parentNode.replaceChild(clone, this.el);
    this.el = null;
  };

  /* ============================================
     5. STATIC METHODS
     ============================================ */

  /**
   * Build a state gallery grid inside a container.
   * @param {HTMLElement|string} container  Target element or selector
   * @returns {PixelCat[]} Array of PixelCat instances
   */
  PixelCat.buildGallery = function (container) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (!container) return [];

    container.className = 'cat-state-gallery';
    container.innerHTML = '';
    var instances = [];

    STATE_DEFINITIONS.forEach(function (s, i) {
      var card = document.createElement('div');
      card.className = 'cat-state-card';

      var bg = document.createElement('div');
      bg.className = 'cat-state-bg';
      card.appendChild(bg);

      var wrap = document.createElement('div');
      wrap.className = 'cat-state-svg cat-interactive ' + s.cls;
      wrap.setAttribute('data-cat', 'gallery-' + i);
      card.appendChild(wrap);

      var lbl = document.createElement('div');
      lbl.className = 'cat-state-label';
      lbl.textContent = s.label;
      card.appendChild(lbl);

      var sub = document.createElement('div');
      sub.className = 'cat-state-sub';
      sub.textContent = s.sub;
      card.appendChild(sub);

      container.appendChild(card);

      var cat = new PixelCat(wrap, { interactive: true, eyeTrack: false });
      instances.push(cat);

      // Restart animation on hover
      card.addEventListener('mouseenter', function () {
        wrap.style.animation = 'none';
        void wrap.offsetWidth;
        wrap.style.animation = '';
      });
    });

    return instances;
  };

  /**
   * Auto-initialize all .cat-interactive elements that don't have
   * a PixelCat instance yet.
   * @param {Object} opts  Default options for auto-init
   * @returns {PixelCat[]} Array of created instances
   */
  PixelCat.autoInit = function (opts) {
    opts = opts || {};
    var elements = document.querySelectorAll('.cat-interactive:not([data-pc-init]):not([data-pc-skip])');
    var instances = [];
    elements.forEach(function (el) {
      var stateOpts = Object.assign({}, opts);
      ALL_STATES.forEach(function (s) {
        if (el.classList.contains(s) && !stateOpts.state) {
          stateOpts.state = s.replace('cat-', '');
        }
      });
      var cat = new PixelCat(el, stateOpts);
      if (cat) instances.push(cat);
    });
    return instances;
  };

  /* ============================================
     6. EXPORT & AUTO-INIT
     ============================================ */

  global.PixelCat = PixelCat;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      PixelCat.autoInit();
    });
  } else {
    PixelCat.autoInit();
  }

  console.log('%c★ PixelCat v2.4.0 loaded', 'color:#f59e0b;font-weight:bold');

})(typeof window !== 'undefined' ? window : this);
