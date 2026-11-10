(() => {
  /* =========================================================
     PROCEDURAL WEB AUDIO API SYNTHESIZER (ZERO EXTERNAL FILES)
     ========================================================= */
  const SoundFX = (() => {
    let ctx = null;
    let noiseBuffer = null;
    let enabled = true;

    function initContext() {
      if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        ctx = new AudioCtx();

        // Pre-build 1-second stereo white noise buffer for airy whooshes & theme waves
        const sampleRate = ctx.sampleRate;
        noiseBuffer = ctx.createBuffer(1, sampleRate, sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < sampleRate; i++) {
          output[i] = Math.random() * 2 - 1;
        }
      }
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    }

    // Soft aerodynamic wing flap: upward pitch glide + filtered feather air burst
    function flap() {
      if (!enabled) return;
      const audio = initContext();
      if (!audio) return;

      const now = audio.currentTime;

      // 1. Tonal wing lift
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(185, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.11);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(now);
      osc.stop(now + 0.14);

      // 2. Airy feather whoosh
      if (noiseBuffer) {
        const noise = audio.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = audio.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, now);
        filter.frequency.exponentialRampToValueAtTime(2400, now + 0.12);
        filter.Q.value = 1.8;

        const nGain = audio.createGain();
        nGain.gain.setValueAtTime(0.001, now);
        nGain.gain.linearRampToValueAtTime(0.09, now + 0.025);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(audio.destination);
        noise.start(now);
        noise.stop(now + 0.14);
      }
    }

    // Crystal portal ring score chime: 4-note pastel glass arpeggio
    function score() {
      if (!enabled) return;
      const audio = initContext();
      if (!audio) return;

      const now = audio.currentTime;
      const notes = [1046.5, 1318.51, 1567.98, 1975.53]; // C6, E6, G6, B6

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.055;
        const osc = audio.createOscillator();
        const gain = audio.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.13, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.36);

        osc.connect(gain);
        gain.connect(audio.destination);
        osc.start(start);
        osc.stop(start + 0.38);
      });
    }

    // Camera POV switch: futuristic dual-oscillator optical servo shift
    function cameraSwitch(toPov) {
      if (!enabled) return;
      const audio = initContext();
      if (!audio) return;

      const now = audio.currentTime;
      const startFreq = toPov ? 310 : 680;
      const endFreq = toPov ? 740 : 290;

      const osc1 = audio.createOscillator();
      const osc2 = audio.createOscillator();
      const filter = audio.createBiquadFilter();
      const gain = audio.createGain();

      osc1.type = 'sine';
      osc2.type = 'sawtooth';

      osc1.frequency.setValueAtTime(startFreq, now);
      osc1.frequency.exponentialRampToValueAtTime(endFreq, now + 0.22);

      osc2.frequency.setValueAtTime(startFreq * 1.5, now);
      osc2.frequency.exponentialRampToValueAtTime(endFreq * 1.5, now + 0.22);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.11, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(audio.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    }

    // Theme Plague Transition: shimmering spatial wash matching the upper-left wave spread
    function themeTransition(toDark) {
      if (!enabled) return;
      const audio = initContext();
      if (!audio) return;

      const now = audio.currentTime;

      // 1. Filtered atmospheric wave sweep
      if (noiseBuffer) {
        const noise = audio.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = audio.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 3.2;
        filter.frequency.setValueAtTime(toDark ? 1600 : 380, now);
        filter.frequency.exponentialRampToValueAtTime(toDark ? 340 : 1850, now + 0.68);

        const nGain = audio.createGain();
        nGain.gain.setValueAtTime(0.001, now);
        nGain.gain.linearRampToValueAtTime(0.11, now + 0.18);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.72);

        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(audio.destination);
        noise.start(now);
        noise.stop(now + 0.74);
      }

      // 2. Warm harmonic pad bloom
      const chord = toDark ? [440, 523.25, 659.25] : [523.25, 659.25, 783.99];
      chord.forEach((freq) => {
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 0.22);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.7);

        osc.connect(gain);
        gain.connect(audio.destination);
        osc.start(now);
        osc.stop(now + 0.72);
      });
    }

    // Countdown timer ping
    function countdownTick(isLaunch = false) {
      if (!enabled) return;
      const audio = initContext();
      if (!audio) return;

      const now = audio.currentTime;
      const osc = audio.createOscillator();
      const gain = audio.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isLaunch ? 880 : 523.25, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isLaunch ? 0.32 : 0.16));

      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(now);
      osc.stop(now + (isLaunch ? 0.34 : 0.18));
    }

    // Wing impact / Game Over thud
    function impact() {
      if (!enabled) return;
      const audio = initContext();
      if (!audio) return;

      const now = audio.currentTime;
      const osc = audio.createOscillator();
      const gain = audio.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.32);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    }

    function toggleMute() {
      enabled = !enabled;
      if (enabled) {
        initContext();
        countdownTick(true);
      }
      return enabled;
    }

    return {
      initContext,
      flap,
      score,
      cameraSwitch,
      themeTransition,
      countdownTick,
      impact,
      toggleMute,
      isEnabled: () => enabled
    };
  })();

  /* =========================================================
     UNIFIED TOUCH & CLICK DISPATCHER (FIXES MOBILE/TABLET TOUCHES)
     ========================================================= */
  function bindTouchAndClick(element, handler, options = { preventDefault: true }) {
    if (!element) return;
    let lastTouchTime = 0;

    element.addEventListener(
      'touchstart',
      (e) => {
        if (options.preventDefault && e.cancelable) {
          e.preventDefault();
        }
        SoundFX.initContext();
        lastTouchTime = performance.now();
        element.classList.add('touch-active');
        handler(e);
      },
      { passive: !options.preventDefault }
    );

    const clearActive = () => element.classList.remove('touch-active');
    element.addEventListener('touchend', clearActive, { passive: true });
    element.addEventListener('touchcancel', clearActive, { passive: true });

    element.addEventListener('click', (e) => {
      if (performance.now() - lastTouchTime < 450) return;
      SoundFX.initContext();
      handler(e);
    });
  }

  /* =========================================================
     PERSISTENCE & CONFIGURATION STATE
     ========================================================= */
  const STORAGE_KEYS = {
    BEST_SCORE: 'chronoplume_best_score_v2',
    BEST_TIME: 'chronoplume_best_time_v2',
    SAVED_GAME: 'chronoplume_saved_session_v2'
  };

  const state = {
    device: 'desktop', // 'desktop' | 'handheld' (Integrated Mobile & Tablet)
    theme: 'light',
    bgBiome: 'meadow',
    initialScene: 'day',
    cameraMode: 'classic', // 'classic' | 'pov' (Toggled via 'C' key or CAM button)
    birdShape: 'sphere',
    bodyColor: '#ff8da1',
    wingColor: '#ffffff',

    // Gameplay Runtime
    phase: 'menu', // 'menu' | 'countdown' | 'playing' | 'paused' | 'gameover'
    score: 0,
    elapsedTime: 0,
    bestScore: Number(localStorage.getItem(STORAGE_KEYS.BEST_SCORE) || 0),
    bestTime: Number(localStorage.getItem(STORAGE_KEYS.BEST_TIME) || 0),

    // Physics & Controls
    birdY: 0,
    birdVy: 0,
    gravity: -24,
    jumpImpulse: 9.8,
    forwardSpeedMultiplier: 1.0, // A (accelerate) / D (decelerate)
    baseForwardSpeed: 8.5,

    // Celestial Day/Night Cycle
    celestialTime: 0.0,
    cycleRateMultiplier: 1.0, // W (accelerate) / S (decelerate)
    baseCycleSpeed: 0.05,

    // Timers
    obstacleSpawnDelay: 2.0, // 2-second delay after initiating before obstacles appear
    timeSinceNextPipe: 0
  };

  /* =========================================================
     DOM ELEMENTS
     ========================================================= */
  const dom = {
    canvas: document.getElementById('game-canvas'),
    btnAudio: document.getElementById('btn-audio-toggle'),
    audioLabel: document.getElementById('audio-label'),
    btnTheme: document.getElementById('btn-theme-toggle'),
    themeLabel: document.getElementById('theme-label'),
    btnUnhideAll: document.getElementById('btn-unhide-all'),
    btnPause: document.getElementById('btn-pause'),
    hudContainer: document.getElementById('hud-container'),
    deviceControls: document.getElementById('device-controls'),

    hudScore: document.getElementById('hud-score'),
    hudTime: document.getElementById('hud-time'),
    hudBestScore: document.getElementById('hud-best-score'),
    hudBestTime: document.getElementById('hud-best-time'),
    hudBirdSpeed: document.getElementById('hud-bird-speed'),
    hudCycleSpeed: document.getElementById('hud-cycle-speed'),
    hudSkyPhase: document.getElementById('hud-sky-phase'),
    hudCamMode: document.getElementById('hud-cam-mode'),
    camBtnLabel: document.getElementById('cam-btn-label'),

    screenDevice: document.getElementById('screen-device'),
    screenCustomize: document.getElementById('screen-customize'),
    screenPause: document.getElementById('screen-pause'),
    screenGameover: document.getElementById('screen-gameover'),
    countdownOverlay: document.getElementById('countdown-overlay'),
    countdownNumber: document.getElementById('countdown-number'),

    autodetectStatus: document.getElementById('autodetect-status'),
    optDesktop: document.getElementById('opt-desktop'),
    optHandheld: document.getElementById('opt-handheld'),
    badgeDesktop: document.getElementById('badge-desktop'),
    badgeHandheld: document.getElementById('badge-handheld'),

    btnBackDevice: document.getElementById('btn-back-device'),
    btnStartGame: document.getElementById('btn-start-game'),
    btnResumeSaved: document.getElementById('btn-resume-saved'),
    btnResumePlay: document.getElementById('btn-resume-play'),
    btnSaveLeave: document.getElementById('btn-save-leave'),
    btnRetry: document.getElementById('btn-retry'),
    btnGameoverHome: document.getElementById('btn-gameover-home'),

    finalScore: document.getElementById('final-score'),
    finalTime: document.getElementById('final-time'),
    finalBestScore: document.getElementById('final-best-score'),
    finalBestTime: document.getElementById('final-best-time')
  };

  /* =========================================================
     HARDWARE AUTO-DETECTION BEFORE DEPLOYMENT
     ========================================================= */
  function autoDetectDeviceProfile() {
    const hasTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    const isMobileOrTabletUA = /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent);
    const isHandheld = hasTouch || isMobileOrTabletUA || window.innerWidth <= 1024;

    state.device = isHandheld ? 'handheld' : 'desktop';
    document.body.setAttribute('data-device', state.device);

    if (isHandheld) {
      dom.optHandheld.classList.add('detected-choice');
      dom.optDesktop.classList.remove('detected-choice');
      dom.badgeHandheld.classList.remove('hidden-badge');
      dom.badgeDesktop.classList.add('hidden-badge');
      dom.autodetectStatus.textContent =
        window.innerWidth >= 700 ? 'Detected: Tablet / Touch Hybrid' : 'Detected: Mobile Touch Handheld';
    } else {
      dom.optDesktop.classList.add('detected-choice');
      dom.optHandheld.classList.remove('detected-choice');
      dom.badgeDesktop.classList.remove('hidden-badge');
      dom.badgeHandheld.classList.add('hidden-badge');
      dom.autodetectStatus.textContent = 'Detected: Desktop / Keyboard';
    }
  }

  autoDetectDeviceProfile();

  /* =========================================================
     AUDIO TOGGLE & INDIVIDUAL BLURRED PLAGUE THEME TRANSITION
     ========================================================= */
  bindTouchAndClick(dom.btnAudio, () => {
    const isOn = SoundFX.toggleMute();
    dom.audioLabel.textContent = isOn ? '🔊 SFX On' : '🔇 Muted';
  });

  function triggerPlagueThemeTransition() {
    const prevStyles = {
      bg: getComputedStyle(document.documentElement).getPropertyValue('--surface-bg'),
      highlight: getComputedStyle(document.documentElement).getPropertyValue('--surface-highlight'),
      border: getComputedStyle(document.documentElement).getPropertyValue('--surface-border')
    };

    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    dom.themeLabel.textContent = state.theme === 'light' ? 'Dark Mode' : 'Light Mode';

    // Procedural spatial synth swell for theme transition
    SoundFX.themeTransition(state.theme === 'dark');

    const sections = document.querySelectorAll('.ui-section');
    sections.forEach((section, idx) => {
      const oldWave = section.querySelector('.theme-plague-layer');
      if (oldWave) oldWave.remove();

      const overlay = document.createElement('div');
      overlay.className = 'theme-plague-layer';
      overlay.style.background = prevStyles.bg;
      overlay.style.backgroundImage = prevStyles.highlight;
      overlay.style.border = `1px solid ${prevStyles.border}`;
      section.appendChild(overlay);

      const duration = 820;
      const stagger = idx * 35;
      const startTime = performance.now() + stagger;

      function animateWave(now) {
        if (now < startTime) {
          requestAnimationFrame(animateWave);
          return;
        }
        const t = Math.min(1, (now - startTime) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        const innerRadius = ease * 155;
        const outerRadius = innerRadius + 36;

        const maskGrad = `radial-gradient(circle at 0% 0%, transparent ${innerRadius}%, rgba(0,0,0,0.45) ${innerRadius + 18}%, black ${outerRadius}%)`;
        overlay.style.webkitMaskImage = maskGrad;
        overlay.style.maskImage = maskGrad;

        if (t < 1) {
          requestAnimationFrame(animateWave);
        } else {
          overlay.remove();
        }
      }
      requestAnimationFrame(animateWave);
    });
  }

  bindTouchAndClick(dom.btnTheme, triggerPlagueThemeTransition);

  /* =========================================================
     INDIVIDUAL HUD HIDING & VERTICAL REFLOW
     ========================================================= */
  document.querySelectorAll('.hud-hide-btn').forEach((btn) => {
    bindTouchAndClick(btn, () => {
      const targetId = btn.getAttribute('data-target');
      const slot = document.querySelector(`.hud-slot[data-hud-id="${targetId}"]`);
      if (slot) {
        slot.classList.add('slot-hidden');
        dom.btnUnhideAll.classList.remove('hidden-btn');
      }
    });
  });

  bindTouchAndClick(dom.btnUnhideAll, () => {
    document.querySelectorAll('.hud-slot.slot-hidden').forEach((slot) => {
      slot.classList.remove('slot-hidden');
    });
    dom.btnUnhideAll.classList.add('hidden-btn');
  });

  /* =========================================================
     THREE.JS 3D WORLD & CAMERA ENGINE (CLASSIC + BIRD POV)
     ========================================================= */
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xdbeafe, 0.018);

  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 220);
  const camCurrentPos = new THREE.Vector3(-2, 0.8, 13.5);
  const camCurrentLook = new THREE.Vector3(2.2, 0, 0);
  camera.position.copy(camCurrentPos);
  camera.lookAt(camCurrentLook);

  const renderer = new THREE.WebGLRenderer({
    canvas: dom.canvas,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xfff4e6, 1.15);
  dirLight.position.set(12, 24, 14);
  scene.add(dirLight);

  // Celestial Bodies (Sun, Moon & Stars)
  const celestialGroup = new THREE.Group();
  scene.add(celestialGroup);

  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xffe082 })
  );
  celestialGroup.add(sunMesh);

  const moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xe2e8f0 })
  );
  celestialGroup.add(moonMesh);

  const starGeo = new THREE.BufferGeometry();
  const starCount = 280;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    starPos[i] = (Math.random() - 0.2) * 110;
    starPos[i + 1] = (Math.random() - 0.3) * 55;
    starPos[i + 2] = (Math.random() - 0.5) * 65;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.26, transparent: true, opacity: 0 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // Decorative Background Floating Islands
  const decorGroup = new THREE.Group();
  scene.add(decorGroup);
  const islandMeshes = [];
  const islandMat = new THREE.MeshStandardMaterial({ color: 0xa7f3d0, flatShading: true });
  for (let i = 0; i < 10; i++) {
    const mesh = new THREE.Mesh(new THREE.ConeGeometry(2.2 + Math.random() * 2, 4.5, 6), islandMat);
    mesh.rotation.x = Math.PI;
    const zSide = i % 2 === 0 ? -9 - Math.random() * 7 : 9 + Math.random() * 7;
    mesh.position.set(-16 + i * 8, -7 - Math.random() * 2.5, zSide);
    decorGroup.add(mesh);
    islandMeshes.push(mesh);
  }

  /* =========================================================
     CUSTOMIZABLE 3D BIRD & TRAJECTORY PROJECTION
     ========================================================= */
  const birdGroup = new THREE.Group();
  birdGroup.position.set(-2.5, 0, 0);
  scene.add(birdGroup);

  let birdBodyMesh = null;
  let leftWingPivot = null;
  let rightWingPivot = null;

  function rebuildBirdModel() {
    while (birdGroup.children.length > 0) {
      birdGroup.remove(birdGroup.children[0]);
    }

    const bodyMat = new THREE.MeshStandardMaterial({
      color: state.bodyColor,
      roughness: 0.32,
      metalness: 0.12
    });
    const wingMat = new THREE.MeshStandardMaterial({
      color: state.wingColor,
      roughness: 0.28
    });

    let bodyGeo;
    if (state.birdShape === 'prism') {
      bodyGeo = new THREE.OctahedronGeometry(0.62, 0);
    } else if (state.birdShape === 'capsule') {
      bodyGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.0, 16);
    } else {
      bodyGeo = new THREE.SphereGeometry(0.56, 24, 24);
    }

    birdBodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    if (state.birdShape === 'capsule') {
      birdBodyMesh.rotation.z = Math.PI / 2;
    }
    birdGroup.add(birdBodyMesh);

    const beak = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.45, 12),
      new THREE.MeshStandardMaterial({ color: 0xffb703 })
    );
    beak.rotation.z = -Math.PI / 2;
    beak.position.set(0.65, 0.04, 0);
    birdGroup.add(beak);

    const eyeGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e1b2e });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(0.36, 0.22, 0.4);
    const eyeR = eyeL.clone();
    eyeR.position.z = -0.4;
    birdGroup.add(eyeL, eyeR);

    const wingGeo = new THREE.BoxGeometry(0.48, 0.09, 0.65);
    leftWingPivot = new THREE.Group();
    leftWingPivot.position.set(0, 0.05, 0.45);
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.z = 0.28;
    leftWingPivot.add(leftWing);

    rightWingPivot = new THREE.Group();
    rightWingPivot.position.set(0, 0.05, -0.45);
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.z = -0.28;
    rightWingPivot.add(rightWing);

    birdGroup.add(leftWingPivot, rightWingPivot);
  }

  // Forward Path Projection Nodes (Visible in both Classic & Bird POV)
  const projectionGroup = new THREE.Group();
  scene.add(projectionGroup);
  const PROJECTION_COUNT = 16;
  const projectionDots = [];
  const dotGeo = new THREE.SphereGeometry(0.1, 12, 12);

  for (let i = 0; i < PROJECTION_COUNT; i++) {
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85 - (i / PROJECTION_COUNT) * 0.72
    });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    projectionGroup.add(dot);
    projectionDots.push(dot);
  }

  function updatePathProjection() {
    const speedX = state.baseForwardSpeed * state.forwardSpeedMultiplier;
    for (let i = 0; i < PROJECTION_COUNT; i++) {
      const simT = (i + 1) * 0.068;
      const predX = birdGroup.position.x + 0.8 + speedX * simT;
      const predY = state.birdY + state.birdVy * simT + 0.5 * state.gravity * simT * simT;
      projectionDots[i].position.set(predX, Math.max(-6.5, Math.min(6.5, predY)), 0);
    }
  }

  /* =========================================================
     CAMERA PERSPECTIVE MANAGER (CLASSIC 3D <-> BIRD'S-EYE POV)
     ========================================================= */
  function setCameraMode(mode, playAudio = true) {
    const changed = state.cameraMode !== mode;
    state.cameraMode = mode;
    const isPov = state.cameraMode === 'pov';
    dom.hudCamMode.textContent = isPov ? 'Bird POV' : 'Classic 3D';
    dom.camBtnLabel.textContent = isPov ? 'Classic (C)' : 'POV (C)';

    if (changed && playAudio) {
      SoundFX.cameraSwitch(isPov);
    }

    const camContainer = document.getElementById('cam-selector');
    if (camContainer) {
      camContainer.querySelectorAll('button').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-cam') === state.cameraMode);
      });
    }
  }

  function toggleCameraMode() {
    setCameraMode(state.cameraMode === 'classic' ? 'pov' : 'classic', true);
  }

  function updateCameraRig(dt) {
    let targetPos;
    let targetLook;

    if (state.cameraMode === 'pov') {
      // Positioned right at the bird's eyes looking forward through the obstacle corridor
      targetPos = new THREE.Vector3(birdGroup.position.x + 0.58, state.birdY + 0.24, 0);
      targetLook = new THREE.Vector3(
        birdGroup.position.x + 16,
        state.birdY + 0.2 + state.birdVy * 0.25,
        0
      );
    } else {
      // Classic side-scrolling 3D perspective
      const zDist = window.innerWidth < 650 ? 15.5 : 13.5;
      targetPos = new THREE.Vector3(-2, 0.8, zDist);
      targetLook = new THREE.Vector3(2.2, 0, 0);
    }

    const lerpSpeed = Math.min(1, dt * 9);
    camCurrentPos.lerp(targetPos, lerpSpeed);
    camCurrentLook.lerp(targetLook, lerpSpeed);

    camera.position.copy(camCurrentPos);
    camera.lookAt(camCurrentLook);
  }

  /* =========================================================
     OBSTACLES (PILLARS + 3D PORTAL GUIDE RINGS FOR POV CLARITY)
     ========================================================= */
  const obstacleGroup = new THREE.Group();
  scene.add(obstacleGroup);
  let obstacles = [];

  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    roughness: 0.25,
    metalness: 0.2
  });

  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45
  });

  function clearObstacles() {
    obstacles.forEach((ob) => obstacleGroup.remove(ob.group));
    obstacles = [];
  }

  function spawnObstacle(customData = null) {
    const gapSize = 3.6;
    const gapY = customData ? customData.gapY : (Math.random() - 0.5) * 4.8;
    const posX = customData ? customData.x : 18;

    const pairGroup = new THREE.Group();
    pairGroup.position.x = posX;

    const pipeHeight = 14;
    const geo = new THREE.CylinderGeometry(0.75, 0.75, pipeHeight, 20);

    const topMesh = new THREE.Mesh(geo, pillarMat);
    topMesh.position.y = gapY + gapSize / 2 + pipeHeight / 2;

    const bottomMesh = new THREE.Mesh(geo, pillarMat);
    bottomMesh.position.y = gapY - gapSize / 2 - pipeHeight / 2;

    // Glowing 3D guide ring inside the safe gap so POV pilots have clear depth cues
    const portalRing = new THREE.Mesh(new THREE.TorusGeometry(gapSize * 0.46, 0.06, 12, 32), ringMat);
    portalRing.rotation.y = Math.PI / 2;
    portalRing.position.y = gapY;

    pairGroup.add(topMesh, bottomMesh, portalRing);
    obstacleGroup.add(pairGroup);

    obstacles.push({
      group: pairGroup,
      gapY,
      gapSize,
      passed: customData ? Boolean(customData.passed) : false
    });
  }

  /* =========================================================
     BIOME & CELESTIAL DAY/NIGHT CYCLE ENGINE
     ========================================================= */
  const BIOME_PALETTES = {
    meadow: {
      daySky: new THREE.Color(0xcffafe),
      nightSky: new THREE.Color(0x131629),
      island: 0x86efac,
      pillar: 0xa5b4fc
    },
    crystal: {
      daySky: new THREE.Color(0xe0e7ff),
      nightSky: new THREE.Color(0x0f172a),
      island: 0x67e8f9,
      pillar: 0xf0abfc
    },
    sunset: {
      daySky: new THREE.Color(0xffedd5),
      nightSky: new THREE.Color(0x23153c),
      island: 0xfda4af,
      pillar: 0xfde047
    }
  };

  function updateBiomeAndCelestialCycle(dt) {
    const palette = BIOME_PALETTES[state.bgBiome] || BIOME_PALETTES.meadow;
    islandMat.color.setHex(palette.island);
    pillarMat.color.setHex(palette.pillar);

    state.celestialTime = (state.celestialTime + dt * state.baseCycleSpeed * state.cycleRateMultiplier) % 1.0;
    if (state.celestialTime < 0) state.celestialTime += 1.0;

    const nightFactor = 0.5 - 0.5 * Math.cos(state.celestialTime * Math.PI * 2);
    const currentSky = palette.daySky.clone().lerp(palette.nightSky, nightFactor);

    renderer.setClearColor(currentSky);
    scene.fog.color.copy(currentSky);

    ambientLight.intensity = 0.8 - nightFactor * 0.48;
    dirLight.intensity = 1.2 - nightFactor * 0.75;
    starMat.opacity = Math.max(0, (nightFactor - 0.35) * 1.4);

    const angle = state.celestialTime * Math.PI * 2 + Math.PI / 2;
    const orbitRadius = 22;
    sunMesh.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle) * 12, -18);
    moonMesh.position.set(Math.cos(angle + Math.PI) * orbitRadius, Math.sin(angle + Math.PI) * 12, -18);

    dom.hudSkyPhase.textContent = nightFactor > 0.5 ? 'Nocturne' : 'Daylight';
  }

  /* =========================================================
     3-SECOND COUNTDOWN & GAME FLOW
     ========================================================= */
  let countdownInterval = null;

  function runThreeSecondCountdown(onComplete) {
    clearInterval(countdownInterval);
    state.phase = 'countdown';
    let remaining = 3;
    dom.countdownNumber.textContent = remaining;
    dom.countdownOverlay.classList.remove('hidden-screen');
    SoundFX.countdownTick(false);

    countdownInterval = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        dom.countdownNumber.textContent = remaining;
        SoundFX.countdownTick(false);
      } else {
        clearInterval(countdownInterval);
        dom.countdownOverlay.classList.add('hidden-screen');
        SoundFX.countdownTick(true);
        state.phase = 'playing';
        if (onComplete) onComplete();
      }
    }, 1000);
  }

  function initNewFlight() {
    clearObstacles();
    state.score = 0;
    state.elapsedTime = 0;
    state.birdY = 0.5;
    state.birdVy = 0;
    state.forwardSpeedMultiplier = 1.0;
    state.cycleRateMultiplier = 1.0;
    state.celestialTime = state.initialScene === 'night' ? 0.5 : 0.0;
    // 2-second delay before obstacles appear
    state.obstacleSpawnDelay = 2.0;
    state.timeSinceNextPipe = 0;

    birdGroup.position.y = state.birdY;
    birdGroup.rotation.z = 0;

    showActiveScreen(null);
    dom.hudContainer.classList.remove('hidden-hud');
    dom.deviceControls.classList.remove('hidden-hud');
    dom.btnPause.classList.remove('hidden-btn');

    updateHudDisplay();
    runThreeSecondCountdown();
  }

  function resumeSavedFlight() {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_GAME);
    if (!raw) return initNewFlight();

    try {
      const saved = JSON.parse(raw);
      clearObstacles();
      state.score = saved.score || 0;
      state.elapsedTime = saved.elapsedTime || 0;
      state.birdY = saved.birdY ?? 0.5;
      state.birdVy = saved.birdVy ?? 0;
      state.forwardSpeedMultiplier = saved.forwardSpeedMultiplier || 1.0;
      state.cycleRateMultiplier = saved.cycleRateMultiplier || 1.0;
      state.celestialTime = saved.celestialTime || 0;
      if (saved.cameraMode) setCameraMode(saved.cameraMode, false);
      state.obstacleSpawnDelay = 2.0;
      state.timeSinceNextPipe = 0;

      if (Array.isArray(saved.obstacles)) {
        saved.obstacles.forEach((ob) => spawnObstacle(ob));
      }

      localStorage.removeItem(STORAGE_KEYS.SAVED_GAME);
      checkSavedSessionButton();

      showActiveScreen(null);
      dom.hudContainer.classList.remove('hidden-hud');
      dom.deviceControls.classList.remove('hidden-hud');
      dom.btnPause.classList.remove('hidden-btn');
      updateHudDisplay();
      runThreeSecondCountdown();
    } catch {
      initNewFlight();
    }
  }

  function saveProgressAndLeaveHome() {
    const serializedObstacles = obstacles.map((ob) => ({
      x: ob.group.position.x,
      gapY: ob.gapY,
      passed: ob.passed
    }));

    const payload = {
      score: state.score,
      elapsedTime: state.elapsedTime,
      birdY: state.birdY,
      birdVy: state.birdVy,
      forwardSpeedMultiplier: state.forwardSpeedMultiplier,
      cycleRateMultiplier: state.cycleRateMultiplier,
      celestialTime: state.celestialTime,
      cameraMode: state.cameraMode,
      obstacles: serializedObstacles
    };

    localStorage.setItem(STORAGE_KEYS.SAVED_GAME, JSON.stringify(payload));
    persistHighRecords();
    checkSavedSessionButton();

    state.phase = 'menu';
    dom.hudContainer.classList.add('hidden-hud');
    dom.deviceControls.classList.add('hidden-hud');
    dom.btnPause.classList.add('hidden-btn');
    showActiveScreen(dom.screenCustomize);
  }

  function persistHighRecords() {
    if (state.score > state.bestScore) {
      state.bestScore = state.score;
      localStorage.setItem(STORAGE_KEYS.BEST_SCORE, String(state.bestScore));
    }
    if (state.elapsedTime > state.bestTime) {
      state.bestTime = Number(state.elapsedTime.toFixed(1));
      localStorage.setItem(STORAGE_KEYS.BEST_TIME, String(state.bestTime));
    }
  }

  function triggerGameOver() {
    state.phase = 'gameover';
    SoundFX.impact();
    persistHighRecords();
    updateHudDisplay();

    dom.finalScore.textContent = state.score;
    dom.finalTime.textContent = `${state.elapsedTime.toFixed(1)}s`;
    dom.finalBestScore.textContent = state.bestScore;
    dom.finalBestTime.textContent = `${state.bestTime.toFixed(1)}s`;

    dom.btnPause.classList.add('hidden-btn');
    showActiveScreen(dom.screenGameover);
  }

  function showActiveScreen(targetModal) {
    [dom.screenDevice, dom.screenCustomize, dom.screenPause, dom.screenGameover].forEach((m) => {
      if (m === targetModal) {
        m.classList.add('active-screen');
      } else {
        m.classList.remove('active-screen');
      }
    });
  }

  function checkSavedSessionButton() {
    const hasSave = Boolean(localStorage.getItem(STORAGE_KEYS.SAVED_GAME));
    dom.btnResumeSaved.classList.toggle('hidden-btn', !hasSave);
  }

  function updateHudDisplay() {
    dom.hudScore.textContent = state.score;
    dom.hudTime.textContent = `${state.elapsedTime.toFixed(1)}s`;
    dom.hudBestScore.textContent = state.bestScore;
    dom.hudBestTime.textContent = `${state.bestTime.toFixed(1)}s`;
    dom.hudBirdSpeed.textContent = `${state.forwardSpeedMultiplier.toFixed(1)}x`;
    dom.hudCycleSpeed.textContent = `${state.cycleRateMultiplier.toFixed(1)}x`;
  }

  /* =========================================================
     CONTROLS (ARROW UP / TAP, W/S CYCLE, A/D SPEED, C CAMERA)
     ========================================================= */
  function flapBird() {
    if (state.phase !== 'playing') return;
    state.birdVy = state.jumpImpulse;
    SoundFX.flap();
  }

  function adjustBirdSpeed(delta) {
    state.forwardSpeedMultiplier = Math.max(0.4, Math.min(2.6, state.forwardSpeedMultiplier + delta));
    updateHudDisplay();
  }

  function adjustCycleRate(delta) {
    state.cycleRateMultiplier = Math.max(0.1, Math.min(5.0, state.cycleRateMultiplier + delta));
    updateHudDisplay();
  }

  window.addEventListener('keydown', (e) => {
    SoundFX.initContext();
    if (e.code === 'ArrowUp' || e.code === 'Space') {
      e.preventDefault();
      flapBird();
    } else if (e.key === 'a' || e.key === 'A') {
      adjustBirdSpeed(0.2);
    } else if (e.key === 'd' || e.key === 'D') {
      adjustBirdSpeed(-0.2);
    } else if (e.key === 'w' || e.key === 'W') {
      adjustCycleRate(0.4);
    } else if (e.key === 's' || e.key === 'S') {
      adjustCycleRate(-0.4);
    } else if (e.key === 'c' || e.key === 'C') {
      toggleCameraMode();
    } else if (e.code === 'Escape' && state.phase === 'playing') {
      pauseFlight();
    }
  });

  // On-Screen Touch & Click Controls
  bindTouchAndClick(document.getElementById('btn-jump'), flapBird);
  bindTouchAndClick(document.getElementById('btn-cam-toggle'), toggleCameraMode);
  bindTouchAndClick(document.getElementById('btn-speed-up'), () => adjustBirdSpeed(0.2));
  bindTouchAndClick(document.getElementById('btn-speed-down'), () => adjustBirdSpeed(-0.2));
  bindTouchAndClick(document.getElementById('btn-cycle-fast'), () => adjustCycleRate(0.4));
  bindTouchAndClick(document.getElementById('btn-cycle-slow'), () => adjustCycleRate(-0.4));

  // Direct Canvas Touch-to-Flap Support for Handheld Devices
  dom.canvas.addEventListener(
    'touchstart',
    (e) => {
      SoundFX.initContext();
      if (state.phase === 'playing') {
        if (e.cancelable) e.preventDefault();
        flapBird();
      }
    },
    { passive: false }
  );

  dom.canvas.addEventListener('mousedown', () => {
    SoundFX.initContext();
    if (state.phase === 'playing' && state.device === 'handheld') {
      flapBird();
    }
  });

  /* =========================================================
     SCREEN 1 & SCREEN 2 UI WIRING
     ========================================================= */
  document.querySelectorAll('.device-option').forEach((btn) => {
    bindTouchAndClick(btn, () => {
      state.device = btn.getAttribute('data-device');
      document.body.setAttribute('data-device', state.device);
      checkSavedSessionButton();
      showActiveScreen(dom.screenCustomize);
    });
  });

  bindTouchAndClick(dom.btnBackDevice, () => {
    autoDetectDeviceProfile();
    showActiveScreen(dom.screenDevice);
  });

  function setupSegmentedButtons(containerId, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('button').forEach((btn) => {
      bindTouchAndClick(btn, () => {
        container.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        callback(btn);
      });
    });
  }

  setupSegmentedButtons('bg-selector', (btn) => {
    state.bgBiome = btn.getAttribute('data-bg');
  });

  setupSegmentedButtons('scene-selector', (btn) => {
    state.initialScene = btn.getAttribute('data-scene');
    state.celestialTime = state.initialScene === 'night' ? 0.5 : 0.0;
  });

  setupSegmentedButtons('cam-selector', (btn) => {
    setCameraMode(btn.getAttribute('data-cam'), true);
  });

  setupSegmentedButtons('shape-selector', (btn) => {
    state.birdShape = btn.getAttribute('data-shape');
    rebuildBirdModel();
  });

  setupSegmentedButtons('body-color-selector', (btn) => {
    state.bodyColor = btn.getAttribute('data-color');
    rebuildBirdModel();
  });

  setupSegmentedButtons('wing-color-selector', (btn) => {
    state.wingColor = btn.getAttribute('data-color');
    rebuildBirdModel();
  });

  bindTouchAndClick(dom.btnStartGame, initNewFlight);
  bindTouchAndClick(dom.btnResumeSaved, resumeSavedFlight);

  function pauseFlight() {
    if (state.phase !== 'playing') return;
    state.phase = 'paused';
    showActiveScreen(dom.screenPause);
  }

  bindTouchAndClick(dom.btnPause, pauseFlight);

  bindTouchAndClick(dom.btnResumePlay, () => {
    showActiveScreen(null);
    runThreeSecondCountdown();
  });

  bindTouchAndClick(dom.btnSaveLeave, saveProgressAndLeaveHome);
  bindTouchAndClick(dom.btnRetry, initNewFlight);
  bindTouchAndClick(dom.btnGameoverHome, () => {
    state.phase = 'menu';
    dom.hudContainer.classList.add('hidden-hud');
    dom.deviceControls.classList.add('hidden-hud');
    showActiveScreen(dom.screenCustomize);
  });

  /* =========================================================
     RESPONSIVE VIEWPORT RESIZING
     ========================================================= */
  function handleResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.fov = w < 650 ? 68 : 58;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener('resize', handleResize);
  handleResize();

  /* =========================================================
     MAIN GAME & ANIMATION LOOP
     ========================================================= */
  rebuildBirdModel();
  updateHudDisplay();

  let lastTime = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    // Wing flap oscillation
    const flapAngle = Math.sin(now * 0.015 * state.forwardSpeedMultiplier) * 0.55;
    if (leftWingPivot && rightWingPivot) {
      leftWingPivot.rotation.x = flapAngle;
      rightWingPivot.rotation.x = -flapAngle;
    }

    if (state.phase === 'playing') {
      state.elapsedTime += dt;
      updateBiomeAndCelestialCycle(dt);

      // Bird Physics
      state.birdVy += state.gravity * dt;
      state.birdY += state.birdVy * dt;
      birdGroup.position.y = state.birdY;
      birdGroup.rotation.z = Math.max(-0.6, Math.min(0.55, state.birdVy * 0.06));

      // Floor / Ceiling bounds check
      if (state.birdY < -6.2 || state.birdY > 6.5) {
        triggerGameOver();
      }

      const forwardVel = state.baseForwardSpeed * state.forwardSpeedMultiplier;

      // Scroll background islands
      islandMeshes.forEach((isl) => {
        isl.position.x -= forwardVel * 0.35 * dt;
        if (isl.position.x < -28) isl.position.x = 52;
      });

      // 2-Second Initial Delay Before Obstacles Spawn
      if (state.obstacleSpawnDelay > 0) {
        state.obstacleSpawnDelay -= dt;
      } else {
        state.timeSinceNextPipe += dt * state.forwardSpeedMultiplier;
        if (state.timeSinceNextPipe >= 1.65) {
          state.timeSinceNextPipe = 0;
          spawnObstacle();
        }
      }

      // Move & Collide Obstacles
      const birdX = birdGroup.position.x;
      const birdRadius = 0.46;

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const ob = obstacles[i];
        ob.group.position.x -= forwardVel * dt;

        // Score & Portal Chime Check
        if (!ob.passed && ob.group.position.x < birdX) {
          ob.passed = true;
          state.score += 1;
          SoundFX.score();
          persistHighRecords();
        }

        const dx = Math.abs(ob.group.position.x - birdX);
        if (dx < 0.72 + birdRadius) {
          const upperLimit = ob.gapY + ob.gapSize / 2 - birdRadius;
          const lowerLimit = ob.gapY - ob.gapSize / 2 + birdRadius;
          if (state.birdY > upperLimit || state.birdY < lowerLimit) {
            triggerGameOver();
            break;
          }
        }

        if (ob.group.position.x < -18) {
          obstacleGroup.remove(ob.group);
          obstacles.splice(i, 1);
        }
      }

      updateHudDisplay();
    } else {
      updateBiomeAndCelestialCycle(dt * 0.25);
      if (state.phase === 'menu') {
        state.birdY = Math.sin(now * 0.003) * 0.45;
        state.birdVy = Math.cos(now * 0.003) * 1.5;
        birdGroup.position.y = state.birdY;
      }
    }

    updatePathProjection();
    updateCameraRig(dt);
    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);
})();
