/* ============================================
   PIXEL CAT — 8-bit Interactive Pixel Cat
   Version: 1.2.0 (mouth speaking animation)
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
    { cls: 'cat-idle', label: '待机 · Idle', sub: '呼吸 · 眨眼 · 摇尾' },
    { cls: 'cat-curious', label: '好奇 · Curious', sub: '歪头 · 探究' },
    { cls: 'cat-walking', label: '行走 · Walking', sub: '弹跳 · 移动' },
    { cls: 'cat-alert', label: '警觉 · Alert', sub: '竖耳 · 专注' },
    { cls: 'cat-sleeping', label: '睡觉 · Sleeping', sub: '闭眼 · 呼噜' },
    { cls: 'cat-happy', label: '开心 · Happy', sub: '跳舞 · 点击触发' }
  ];

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
    this._isInteracting = false;

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
      var bubble = document.createElement('div');
      bubble.className = 'cat-speech';
      this.el.appendChild(bubble);
      this.el.insertAdjacentHTML('beforeend', CAT_SVG);
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

  /**
   * Destroy the instance, clean up timers and listeners.
   */
  PixelCat.prototype.destroy = function () {
    clearTimeout(this._speechTimer);
    clearInterval(this._cycleTimer);
    clearInterval(this._idleTimer);
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

  console.log('%c★ PixelCat v1.2.0 loaded', 'color:#f59e0b;font-weight:bold');

})(typeof window !== 'undefined' ? window : this);
