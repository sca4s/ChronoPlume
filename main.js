(() => {
  /* =========================================================
     PROCEDURAL WEB AUDIO API SYNTHESIZER
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

    function flap() {
      if (!enabled) return;
      const audio = initContext();
      if (!audio) return;

      const now = audio.currentTime;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(430, now + 0.11);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(now);
      osc.stop(now + 0.14);

      if (noiseBuffer) {
        const noise = audio.createBufferSource();
        noise.buffer = noiseBuffer;
        const filter = audio.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(920, now);
        filter.frequency.exponentialRampToValueAtTime(2400, now + 0.12);
        filter.Q.value = 1.8;

        const nGain = audio.createGain();
        nGain.gain.setValueAtTime(0.001, now);
        nGain.gain.linearRampToValueAtTime(0.08, now + 0.025);
        nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

        noise.connect(filter);
        filter.connect(nGain);
        nGain.connect(audio.destination);
        noise.start(now);
        noise.stop(now + 0.14);
      }
    }

    function score() {
      if (!enabled) return;
      const audio = initContext();
      if (!audio) return;
      const now = audio.currentTime;
      const notes = [1046.5, 1318.51, 1567.98, 1975.53];
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

    function diamondCollect() {
      if (!enabled) return;
      const audio = initContext();
      if (!audio) return;
      const now = audio.currentTime;
      const notes = [1567.98, 2093.0, 2637.02];
      notes.forEach((freq, i) => {
        const t = now + i * 0.045;
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.14, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0008, t + 0.26);
        osc.connect(gain);
        gain.connect(audio.destination);
        osc.start(t);
        osc.stop(t + 0.28);
      });
    }

    function cameraSwitch(toPov) {
      if (!enabled) return;
      const audio = initContext();
      if (!audio) return;
      const now = audio.currentTime;
      const startFreq = toPov ? 310 : 680;
      const endFreq = toPov ? 740 : 290;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.22);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.11, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }

    function themeTransition(toDark) {
      if (!enabled) return;
      const audio = initContext();
      if (!audio) return;
      const now = audio.currentTime;
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
      diamondCollect,
      cameraSwitch,
      themeTransition,
      countdownTick,
      impact,
      toggleMute
    };
  })();

  /* =========================================================
     UNIFIED TOUCH & CLICK HANDLER
     ========================================================= */
  function bindTouchAndClick(element, handler, options = { preventDefault: true }) {
    if (!element) return;
    let lastTouchTime = 0;

    element.addEventListener(
      'touchstart',
      (e) => {
        if (options.preventDefault && e.cancelable) e.preventDefault();
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
     STORAGE KEYS & STATE
     ========================================================= */
  const STORAGE_KEYS = {
    BEST_SCORE: 'chronoplume_best_score_v6',
    BEST_TIME: 'chronoplume_best_time_v6',
    VAULT_DIAMONDS: 'chronoplume_vault_diamonds_v6',
    SAVED_GAME: 'chronoplume_saved_session_v6'
  };

  const REVIVE_COST = 1;

  const state = {
    device: 'desktop',
    theme: 'light',
    bgBiome: 'meadow',
    skyMode: 'dynamic',
    initialScene: 'day',
    cameraMode: 'classic',
    birdShape: 'sphere',
    bodyColor: '#f48fb1',
    wingColor: '#fff8fc',

    phase: 'menu',
    score: 0,
    elapsedTime: 0,
    vaultDiamonds: Number(localStorage.getItem(STORAGE_KEYS.VAULT_DIAMONDS) || 0),
    bestScore: Number(localStorage.getItem(STORAGE_KEYS.BEST_SCORE) || 0),
    bestTime: Number(localStorage.getItem(STORAGE_KEYS.BEST_TIME) || 0),

    birdY: 0,
    birdVy: 0,
    gravity: -24,
    jumpImpulse: 9.8,
    forwardSpeedMultiplier: 1.0,
    baseForwardSpeed: 8.5,

    celestialTime: 0.0,
    cycleRateMultiplier: 1.0,
    baseCycleSpeed: 0.048,

    obstacleSpawnDelay: 2.0,
    timeSinceNextPipe: 0,
    nextPipeInterval: 1.6,
    lastGapY: 0,
    autoRotatePreview: true
  };

  /* =========================================================
     DOM ELEMENTS
     ========================================================= */
  const dom = {
    canvas: document.getElementById('game-canvas'),
    previewCanvas: document.getElementById('bird-preview-canvas'),
    previewTouchStage: document.getElementById('preview-touch-stage'),
    vaultDiamondCount: document.getElementById('vault-diamond-count'),
    btnAutoRotate: document.getElementById('btn-auto-rotate'),

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
    hudBiomeName: document.getElementById('hud-biome-name'),
    hudCamMode: document.getElementById('hud-cam-mode'),
    camBtnLabel: document.getElementById('cam-btn-label'),

    screenDevice: document.getElementById('screen-device'),
    screenCustomize: document.getElementById('screen-customize'),
    screenGameover: document.getElementById('screen-gameover'),
    countdownOverlay: document.getElementById('countdown-overlay'),
    countdownNumber: document.getElementById('countdown-number'),

    customizeBadge: document.getElementById('customize-badge'),
    customizeTitle: document.getElementById('customize-title'),
    dynamicStartWrap: document.getElementById('dynamic-start-wrap'),
    homeActions: document.getElementById('home-actions'),
    pauseActions: document.getElementById('pause-actions'),
    biomeSelect: document.getElementById('biome-select'),

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
    btnRevive: document.getElementById('btn-revive'),
    btnGameoverHome: document.getElementById('btn-gameover-home'),

    finalScore: document.getElementById('final-score'),
    finalTime: document.getElementById('final-time'),
    finalBestScore: document.getElementById('final-best-score'),
    finalVaultDiamonds: document.getElementById('final-vault-diamonds')
  };

  dom.vaultDiamondCount.textContent = state.vaultDiamonds;

  /* =========================================================
     HARDWARE AUTO-DETECTION
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
        window.innerWidth >= 700 ? 'Detected: Tablet / Touch Hybrid' : 'Detected: Mobile Handheld';
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
     UPPER-LEFT BLURRED PLAGUE THEME TRANSITION
     ========================================================= */
  bindTouchAndClick(dom.btnAudio, () => {
    const isOn = SoundFX.toggleMute();
    dom.audioLabel.textContent = isOn ? 'SFX: On' : 'SFX: Muted';
  });

  function triggerPlagueThemeTransition() {
    const rootStyles = getComputedStyle(document.documentElement);
    const prevBg = rootStyles.getPropertyValue('--surface-bg').trim();
    const prevBorder = rootStyles.getPropertyValue('--surface-border').trim();

    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    dom.themeLabel.textContent = state.theme === 'light' ? 'Dark Theme' : 'Light Theme';
    SoundFX.themeTransition(state.theme === 'dark');

    if (previewRenderer) {
      previewRenderer.setClearColor(state.theme === 'light' ? 0xd8eeff : 0x221d3a, 1);
    }

    const sections = document.querySelectorAll('.ui-section');
    sections.forEach((section, idx) => {
      const existing = section.querySelector('.theme-plague-layer');
      if (existing) existing.remove();

      const overlay = document.createElement('div');
      overlay.className = 'theme-plague-layer';
      overlay.style.backgroundColor = prevBg;
      overlay.style.border = `1.8px solid ${prevBorder}`;
      section.appendChild(overlay);

      const duration = 840;
      const stagger = (idx % 8) * 32;
      const startTime = performance.now() + stagger;

      function animatePlagueWave(now) {
        if (now < startTime) {
          requestAnimationFrame(animatePlagueWave);
          return;
        }
        const t = Math.min(1, (now - startTime) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        const innerRadius = ease * 155;
        const outerRadius = innerRadius + 38;

        const maskGrad = `radial-gradient(circle at 0% 0%, transparent ${innerRadius}%, rgba(0,0,0,0.45) ${innerRadius + 19}%, black ${outerRadius}%)`;
        overlay.style.webkitMaskImage = maskGrad;
        overlay.style.maskImage = maskGrad;

        if (t < 1) {
          requestAnimationFrame(animatePlagueWave);
        } else {
          overlay.remove();
        }
      }
      requestAnimationFrame(animatePlagueWave);
    });
  }

  bindTouchAndClick(dom.btnTheme, triggerPlagueThemeTransition);

  /* =========================================================
     INDIVIDUAL HUD SLIDE-OUT & VERTICAL REFLOW
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
     MATTE PASTEL 3D BIRD BUILDER & DIRECT TOUCH ROTATION
     ========================================================= */
  function populateBirdMeshGroup(targetGroup) {
    while (targetGroup.children.length > 0) {
      targetGroup.remove(targetGroup.children[0]);
    }

    const bodyColorObj = new THREE.Color(state.bodyColor);
    const wingColorObj = new THREE.Color(state.wingColor);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: bodyColorObj,
      emissive: bodyColorObj,
      emissiveIntensity: 0.14,
      roughness: 0.92,
      metalness: 0.0
    });

    const wingMat = new THREE.MeshStandardMaterial({
      color: wingColorObj,
      emissive: wingColorObj,
      emissiveIntensity: 0.12,
      roughness: 0.9,
      metalness: 0.0
    });

    let bodyGeo;
    if (state.birdShape === 'prism') {
      bodyGeo = new THREE.OctahedronGeometry(0.64, 0);
    } else if (state.birdShape === 'capsule') {
      bodyGeo = new THREE.CylinderGeometry(0.44, 0.44, 1.04, 20);
    } else {
      bodyGeo = new THREE.SphereGeometry(0.58, 28, 28);
    }

    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    if (state.birdShape === 'capsule') {
      bodyMesh.rotation.z = Math.PI / 2;
    }
    targetGroup.add(bodyMesh);

    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.5, 10), wingMat);
    tail.rotation.z = Math.PI / 2.3;
    tail.position.set(-0.62, 0.12, 0);
    targetGroup.add(tail);

    const beak = new THREE.Mesh(
      new THREE.ConeGeometry(0.19, 0.48, 14),
      new THREE.MeshStandardMaterial({
        color: 0xffb84d,
        emissive: 0xffb84d,
        emissiveIntensity: 0.1,
        roughness: 0.9,
        metalness: 0.0
      })
    );
    beak.rotation.z = -Math.PI / 2;
    beak.position.set(0.68, 0.04, 0);
    targetGroup.add(beak);

    const eyeGeo = new THREE.SphereGeometry(0.1, 14, 14);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1b142e });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(0.38, 0.22, 0.42);
    const eyeR = eyeL.clone();
    eyeR.position.z = -0.42;
    targetGroup.add(eyeL, eyeR);

    const wingGeo = new THREE.BoxGeometry(0.52, 0.11, 0.7);
    const leftPivot = new THREE.Group();
    leftPivot.position.set(0, 0.05, 0.46);
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.z = 0.3;
    leftPivot.add(leftWing);

    const rightPivot = new THREE.Group();
    rightPivot.position.set(0, 0.05, -0.46);
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.z = -0.3;
    rightPivot.add(rightWing);

    targetGroup.add(leftPivot, rightPivot);
    return { leftPivot, rightPivot };
  }

  // Dedicated 3D Preview Stage with Direct Touch/Mouse Orbit
  const previewScene = new THREE.Scene();
  const previewCamera = new THREE.PerspectiveCamera(40, 1.6, 0.1, 30);
  previewCamera.position.set(1.65, 0.72, 2.75);
  previewCamera.lookAt(0, 0.04, 0);

  const previewRenderer = new THREE.WebGLRenderer({ canvas: dom.previewCanvas, antialias: true });
  previewRenderer.setClearColor(0xd8eeff, 1);
  previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  previewScene.add(new THREE.HemisphereLight(0xffffff, 0xd8cff8, 0.78));
  const prevKeyLight = new THREE.DirectionalLight(0xfff5eb, 0.55);
  prevKeyLight.position.set(3, 5, 4);
  previewScene.add(prevKeyLight);

  const previewBirdGroup = new THREE.Group();
  previewScene.add(previewBirdGroup);
  let previewWings = { leftPivot: null, rightPivot: null };

  let isDraggingPreview = false;
  let lastPointerX = 0;
  let lastPointerY = 0;

  dom.previewTouchStage.addEventListener('pointerdown', (e) => {
    isDraggingPreview = true;
    state.autoRotatePreview = false;
    dom.btnAutoRotate.classList.remove('active');
    dom.btnAutoRotate.textContent = 'Auto-Rotate: Off';
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    dom.previewTouchStage.setPointerCapture(e.pointerId);
  });

  dom.previewTouchStage.addEventListener('pointermove', (e) => {
    if (!isDraggingPreview) return;
    const dx = e.clientX - lastPointerX;
    const dy = e.clientY - lastPointerY;
    previewBirdGroup.rotation.y += dx * 0.012;
    previewBirdGroup.rotation.x = Math.max(-0.85, Math.min(0.85, previewBirdGroup.rotation.x + dy * 0.012));
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
  });

  const endPreviewDrag = (e) => {
    if (!isDraggingPreview) return;
    isDraggingPreview = false;
    try {
      dom.previewTouchStage.releasePointerCapture(e.pointerId);
    } catch {}
  };

  dom.previewTouchStage.addEventListener('pointerup', endPreviewDrag);
  dom.previewTouchStage.addEventListener('pointercancel', endPreviewDrag);

  bindTouchAndClick(dom.btnAutoRotate, () => {
    state.autoRotatePreview = !state.autoRotatePreview;
    dom.btnAutoRotate.classList.toggle('active', state.autoRotatePreview);
    dom.btnAutoRotate.textContent = state.autoRotatePreview ? 'Auto-Rotate: On' : 'Auto-Rotate: Off';
    if (state.autoRotatePreview) {
      previewBirdGroup.rotation.x = 0;
    }
  });

  function resizePreviewStage() {
    const rect = dom.previewTouchStage.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      previewCamera.aspect = rect.width / rect.height;
      previewCamera.updateProjectionMatrix();
      previewRenderer.setSize(rect.width, rect.height, false);
    }
  }

  /* =========================================================
     MAIN THREE.JS 3D WORLD & 12 INTERACTIVE SKY BIOMES
     ========================================================= */
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xd8ecff, 0.014);

  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 240);
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

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xc7d2fe, 0.72);
  scene.add(hemiLight);
  const dirLight = new THREE.DirectionalLight(0xfff6e5, 0.68);
  dirLight.position.set(12, 24, 14);
  scene.add(dirLight);

  // Sun, Moon & Starfield
  const celestialGroup = new THREE.Group();
  scene.add(celestialGroup);
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.3, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xffe484 })
  );
  celestialGroup.add(sunMesh);
  const moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.8, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xf1f5f9 })
  );
  celestialGroup.add(moonMesh);

  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(300 * 3);
  for (let i = 0; i < 300 * 3; i += 3) {
    starPos[i] = (Math.random() - 0.2) * 120;
    starPos[i + 1] = (Math.random() - 0.3) * 60;
    starPos[i + 2] = (Math.random() - 0.5) * 70;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.28, transparent: true, opacity: 0 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // 3D Volumetric Clouds
  const cloudGroup = new THREE.Group();
  scene.add(cloudGroup);
  const clouds = [];
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.95,
    metalness: 0.0,
    flatShading: true
  });

  function createVolumetricCloud() {
    const cluster = new THREE.Group();
    const puffGeo = new THREE.DodecahedronGeometry(1.1, 1);
    const offsets = [
      { x: 0, y: 0, z: 0, s: 1.25 },
      { x: -1.1, y: -0.15, z: 0.2, s: 0.95 },
      { x: 1.15, y: -0.1, z: -0.15, s: 1.0 },
      { x: -0.45, y: 0.55, z: -0.2, s: 0.85 },
      { x: 0.5, y: 0.48, z: 0.25, s: 0.9 }
    ];
    offsets.forEach((p) => {
      const puff = new THREE.Mesh(puffGeo, cloudMat);
      puff.position.set(p.x, p.y, p.z);
      puff.scale.setScalar(p.s);
      cluster.add(puff);
    });
    return cluster;
  }

  for (let i = 0; i < 14; i++) {
    const cMesh = createVolumetricCloud();
    const depthZ = i % 2 === 0 ? -7 - Math.random() * 14 : 6 + Math.random() * 8;
    cMesh.scale.setScalar(0.65 + Math.random() * 0.65);
    cMesh.position.set(-28 + i * 7.5, 3.2 + Math.random() * 5.2, depthZ);
    cloudGroup.add(cMesh);
    clouds.push({ mesh: cMesh, speedFactor: 0.2 + Math.random() * 0.28 });
  }

  /* =========================================================
     12 INTERACTIVE 3D SKY BIOME ARCHITECTURE GENERATOR
     (Bird flies through/past custom 3D spires, rings, mugs, etc.)
     ========================================================= */
  const biomeSceneryGroup = new THREE.Group();
  scene.add(biomeSceneryGroup);
  let biomeProps = [];

  const BIOME_CONFIG = {
    meadow: {
      name: 'Alpine Meadows',
      daySky: 0xcffafe,
      nightSky: 0x161930,
      cloudDay: 0xffffff,
      cloudNight: 0x8b95c9,
      pillars: [0x86efac, 0x93c5fd, 0xa5b4fc]
    },
    sanctum: {
      name: 'Royal Sanctum',
      daySky: 0xfef9c3,
      nightSky: 0x1e1836,
      cloudDay: 0xfffbeb,
      cloudNight: 0x9f8ad4,
      pillars: [0xfde047, 0xfef08a, 0xe9d5ff]
    },
    cyberdrift: {
      name: 'Cyberpunk Drift',
      daySky: 0xfce7f3,
      nightSky: 0x0f0a1c,
      cloudDay: 0xfbcfe8,
      cloudNight: 0x701a75,
      pillars: [0xf472b6, 0x38bdf8, 0xc084fc]
    },
    angelic: {
      name: 'Angelic Cloud',
      daySky: 0xf0f9ff,
      nightSky: 0x172554,
      cloudDay: 0xffffff,
      cloudNight: 0x93c5fd,
      pillars: [0xfef08a, 0xffffff, 0xbae6fd]
    },
    lagoon: {
      name: 'Pastel Lagoon',
      daySky: 0xccfbf1,
      nightSky: 0x083344,
      cloudDay: 0xf0fdfa,
      cloudNight: 0x2dd4bf,
      pillars: [0x5eead4, 0xfda4af, 0xfde047]
    },
    lofi: {
      name: 'Lo-Fi Cafe',
      daySky: 0xffedd5,
      nightSky: 0x27171c,
      cloudDay: 0xfff7ed,
      cloudNight: 0x9a6b78,
      pillars: [0xfdba74, 0xf9a8d4, 0xd6d3d1]
    },
    gothicbalcony: {
      name: 'Gothic Balcony',
      daySky: 0xe2e8f0,
      nightSky: 0x111827,
      cloudDay: 0xf1f5f9,
      cloudNight: 0x64748b,
      pillars: [0x94a3b8, 0xc084fc, 0xf472b6]
    },
    gothiccastle: {
      name: 'Gothic Castle',
      daySky: 0xdbeafe,
      nightSky: 0x0f172a,
      cloudDay: 0xe2e8f0,
      cloudNight: 0x475569,
      pillars: [0x64748b, 0xfb923c, 0x94a3b8]
    },
    forest: {
      name: 'Enchanted Forest',
      daySky: 0xdcfce7,
      nightSky: 0x06281e,
      cloudDay: 0xf0fdf4,
      cloudNight: 0x34d399,
      pillars: [0x4ade80, 0xa7f3d0, 0xfef08a]
    },
    cyberterrace: {
      name: 'Cyberpunk Terrace',
      daySky: 0xf5d0fe,
      nightSky: 0x090d1f,
      cloudDay: 0xfae8ff,
      cloudNight: 0x6366f1,
      pillars: [0xe879f9, 0x22d3ee, 0x818cf8]
    },
    desert: {
      name: 'Sandstone Desert',
      daySky: 0xfef3c7,
      nightSky: 0x291518,
      cloudDay: 0xfffbeb,
      cloudNight: 0xb45309,
      pillars: [0xfb923c, 0xfcd34d, 0x4ade80]
    },
    reef: {
      name: 'Abyssal Reef',
      daySky: 0xcffafe,
      nightSky: 0x042f2e,
      cloudDay: 0xe0f2fe,
      cloudNight: 0x0ea5e9,
      pillars: [0xf472b6, 0x2dd4bf, 0xc084fc]
    }
  };

  function createBiomePropMesh(biomeKey, index) {
    const holder = new THREE.Group();
    const matA = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88, flatShading: true });
    const matB = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.75, flatShading: true });
    const matC = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.85, flatShading: true });

    switch (biomeKey) {
      case 'sanctum': {
        // Marble fluted rotunda pillar + golden ring + floating crown jewel
        matA.color.setHex(0xf8fafc);
        matB.color.setHex(0xfacc15);
        matC.color.setHex(0xc084fc);
        const col = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 8, 12), matA);
        const goldRing = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.14, 10, 28), matB);
        goldRing.position.y = 4.2;
        const jewel = new THREE.Mesh(new THREE.OctahedronGeometry(0.95, 0), matC);
        jewel.position.y = 4.2;
        holder.add(col, goldRing, jewel);
        break;
      }
      case 'cyberdrift': {
        // Dual tilted neon drift rings & synthwave portal spire
        matA.color.setHex(0x1e1b4b);
        matB.color.setHex(0xf472b6);
        matC.color.setHex(0x38bdf8);
        constring1 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.14, 10, 32), matB);
        constring1.rotation.set(0.4, 0.5, 0);
        constring2 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.12, 10, 32), matC);
        constring2.rotation.set(-0.4, -0.3, 0);
        const spire = new THREE.Mesh(new THREE.ConeGeometry(1.4, 7, 4), matA);
        spire.position.y = -3.2;
        holder.add(constring1, constring2, spire);
        break;
      }
      case 'angelic': {
        // Pearl temple spire + concentric golden halos
        matA.color.setHex(0xffffff);
        matB.color.setHex(0xfde047);
        const spire = new THREE.Mesh(new THREE.ConeGeometry(1.2, 8.5, 12), matA);
        const halo1 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.1, 10, 32), matB);
        halo1.rotation.x = Math.PI / 2;
        halo1.position.y = 3.2;
        const halo2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.08, 10, 32), matB);
        halo2.rotation.x = Math.PI / 2;
        halo2.position.y = 2.4;
        holder.add(spire, halo1, halo2);
        break;
      }
      case 'lagoon': {
        // Sandy atoll island + tropical palm tree + pastel beach parasol
        matA.color.setHex(0xfde68a);
        matB.color.setHex(0x4ade80);
        matC.color.setHex(0xfb7185);
        const atoll = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.2, 1.2, 12), matA);
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.35, 4.2, 8),
          new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 })
        );
        trunk.position.set(-0.6, 2.2, 0);
        const crown = new THREE.Mesh(new THREE.ConeGeometry(1.8, 1.5, 7), matB);
        crown.position.set(-0.6, 4.3, 0);
        const parasol = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.9, 8), matC);
        parasol.position.set(1.0, 1.8, 0.4);
        holder.add(atoll, trunk, crown, parasol);
        break;
      }
      case 'lofi': {
        // Oversized steaming coffee mug with saucer & vinyl turntable platter
        matA.color.setHex(0xfef3c7);
        matB.color.setHex(0x78350f);
        matC.color.setHex(0xf472b6);
        const saucer = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.0, 0.35, 18), matA);
        const mug = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.25, 2.8, 18), matC);
        mug.position.y = 1.5;
        const steam = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.12, 8, 20), matA);
        steam.position.y = 3.8;
        holder.add(saucer, mug, steam);
        break;
      }
      case 'gothicbalcony': {
        // Pointed lancet arch + stained-glass rose window
        matA.color.setHex(0x94a3b8);
        matB.color.setHex(0xc084fc);
        matC.color.setHex(0xf472b6);
        const colL = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 7, 8), matA);
        colL.position.x = -1.6;
        const colR = colL.clone();
        colR.position.x = 1.6;
        const rose = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.22, 10, 16), matB);
        rose.position.y = 3.6;
        const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), matC);
        core.position.y = 3.6;
        holder.add(colL, colR, rose, core);
        break;
      }
      case 'gothiccastle': {
        // Crenelated castle turret + glowing torch brazier
        matA.color.setHex(0x64748b);
        matB.color.setHex(0xf97316);
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 7.5, 10), matA);
        const battlement = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 0.9, 8), matA);
        battlement.position.y = 3.8;
        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.8, 8), matB);
        flame.position.y = 5.1;
        holder.add(tower, battlement, flame);
        break;
      }
      case 'forest': {
        // Multi-tiered pine trees + mossy boulder + floating firefly orb
        matA.color.setHex(0x22c55e);
        matB.color.setHex(0x15803d);
        matC.color.setHex(0xfef08a);
        const tier1 = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.2, 7), matB);
        tier1.position.y = 1.0;
        const tier2 = new THREE.Mesh(new THREE.ConeGeometry(1.9, 2.8, 7), matA);
        tier2.position.y = 2.8;
        const tier3 = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2.2, 7), matA);
        tier3.position.y = 4.3;
        const firefly = new THREE.Mesh(new THREE.SphereGeometry(0.38, 10, 10), matC);
        firefly.position.set(1.2, 5.5, 0.5);
        holder.add(tier1, tier2, tier3, firefly);
        break;
      }
      case 'cyberterrace': {
        // Metropolis skyscraper + neon rooftop railing
        matA.color.setHex(0x312e81);
        matB.color.setHex(0x22d3ee);
        matC.color.setHex(0xe879f9);
        const building = new THREE.Mesh(new THREE.BoxGeometry(2.8, 9.5, 2.8), matA);
        const neonTop = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.35, 3.1), matB);
        neonTop.position.y = 4.8;
        const beacon = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2.2, 6), matC);
        beacon.position.y = 6.0;
        holder.add(building, neonTop, beacon);
        break;
      }
      case 'desert': {
        // Ancient sandstone pyramid + canyon mesa + cactus
        matA.color.setHex(0xf59e0b);
        matB.color.setHex(0xd97706);
        matC.color.setHex(0x22c55e);
        const pyramid = new THREE.Mesh(new THREE.ConeGeometry(2.9, 4.8, 4), matA);
        pyramid.rotation.y = Math.PI / 4;
        const cactus = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 2.8, 8), matC);
        cactus.position.set(2.1, 1.2, 0.6);
        holder.add(pyramid, cactus);
        break;
      }
      case 'reef': {
        // Underwater coral cluster + rising bubble orbs
        matA.color.setHex(0xf472b6);
        matB.color.setHex(0x2dd4bf);
        matC.color.setHex(0xe0f2fe);
        const coral1 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.25, 4.5, 8), matA);
        coral1.rotation.z = 0.25;
        const coral2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.2, 3.8, 8), matB);
        coral2.rotation.z = -0.3;
        coral2.position.x = 0.9;
        const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 14), matC);
        bubble.position.set(0.3, 4.6, 0);
        holder.add(coral1, coral2, bubble);
        break;
      }
      default: {
        // Alpine Meadows: Snow-capped mountain peak & rolling green hill
        matA.color.setHex(0x86efac);
        matB.color.setHex(0xffffff);
        const mountain = new THREE.Mesh(new THREE.ConeGeometry(2.8, 6.2, 7), matA);
        const snowCap = new THREE.Mesh(new THREE.ConeGeometry(1.45, 2.4, 7), matB);
        snowCap.position.y = 1.95;
        holder.add(mountain, snowCap);
        break;
      }
    }

    const zSide = index % 2 === 0 ? -8.5 - Math.random() * 6 : 7.5 + Math.random() * 6;
    holder.position.set(-22 + index * 9, -6.2 - Math.random() * 1.4, zSide);
    return holder;
  }

  function rebuildBiomeScenery() {
    while (biomeSceneryGroup.children.length > 0) {
      biomeSceneryGroup.remove(biomeSceneryGroup.children[0]);
    }
    biomeProps = [];
    for (let i = 0; i < 10; i++) {
      const prop = createBiomePropMesh(state.bgBiome, i);
      biomeSceneryGroup.add(prop);
      biomeProps.push(prop);
    }
  }

  // Main World Bird & Wing Pivots
  const birdGroup = new THREE.Group();
  birdGroup.position.set(-2.5, 0, 0);
  scene.add(birdGroup);
  let mainWings = { leftPivot: null, rightPivot: null };

  function rebuildAllBirdModels() {
    mainWings = populateBirdMeshGroup(birdGroup);
    previewWings = populateBirdMeshGroup(previewBirdGroup);
  }

  // Forward Trajectory Path Projection
  const projectionGroup = new THREE.Group();
  scene.add(projectionGroup);
  const PROJECTION_COUNT = 16;
  const projectionDots = [];
  const dotGeo = new THREE.SphereGeometry(0.11, 12, 12);

  for (let i = 0; i < PROJECTION_COUNT; i++) {
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.88 - (i / PROJECTION_COUNT) * 0.74
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
     CAMERA PERSPECTIVE (CLASSIC 3D <-> BIRD'S-EYE POV)
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

    if (state.cameraMode === 'pov' && (state.phase === 'playing' || state.phase === 'countdown')) {
      targetPos = new THREE.Vector3(birdGroup.position.x + 0.6, state.birdY + 0.24, 0);
      targetLook = new THREE.Vector3(
        birdGroup.position.x + 16,
        state.birdY + 0.2 + state.birdVy * 0.25,
        0
      );
    } else {
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
     RANDOMIZED OBSTACLES & COLLECTIBLE VAULT DIAMONDS
     ========================================================= */
  const obstacleGroup = new THREE.Group();
  scene.add(obstacleGroup);
  let obstacles = [];

  const diamondGroup = new THREE.Group();
  scene.add(diamondGroup);
  let diamonds = [];

  const diamondGeo = new THREE.OctahedronGeometry(0.36, 0);
  const diamondMat = new THREE.MeshStandardMaterial({
    color: 0x67e8f9,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.45,
    roughness: 0.25
  });

  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.55
  });

  function clearObstaclesAndDiamonds() {
    obstacles.forEach((ob) => obstacleGroup.remove(ob.group));
    obstacles = [];
    diamonds.forEach((d) => diamondGroup.remove(d.mesh));
    diamonds = [];
  }

  function pickRandomGapY() {
    let candidate = (Math.random() - 0.5) * 5.6;
    if (Math.abs(candidate - state.lastGapY) < 1.1) {
      candidate += candidate > 0 ? -1.6 : 1.6;
    }
    candidate = Math.max(-2.85, Math.min(2.85, candidate));
    state.lastGapY = candidate;
    return candidate;
  }

  function spawnObstacle(customData = null) {
    const gapSize = customData?.gapSize ?? 3.45 + Math.random() * 0.65;
    const gapY = customData?.gapY ?? pickRandomGapY();
    const posX = customData?.x ?? 18 + Math.random() * 1.5;

    const styles = ['cylinder', 'hexCrystal', 'ringTotem'];
    const style = customData?.style ?? styles[Math.floor(Math.random() * styles.length)];

    const bConf = BIOME_CONFIG[state.bgBiome] || BIOME_CONFIG.meadow;
    const colorHex =
      customData?.colorHex ?? bConf.pillars[Math.floor(Math.random() * bConf.pillars.length)];

    const bobAmp = customData?.bobAmp ?? (Math.random() < 0.35 ? 0.35 + Math.random() * 0.45 : 0);
    const bobSpeed = customData?.bobSpeed ?? 1.4 + Math.random() * 1.2;
    const bobPhase = customData?.bobPhase ?? Math.random() * Math.PI * 2;

    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.86,
      metalness: 0.0,
      flatShading: style === 'hexCrystal'
    });

    const pairGroup = new THREE.Group();
    pairGroup.position.x = posX;

    const pipeHeight = 14;
    const radialSegments = style === 'hexCrystal' ? 6 : 24;
    const radius = style === 'hexCrystal' ? 0.84 : 0.76;

    const geo = new THREE.CylinderGeometry(radius, radius, pipeHeight, radialSegments);
    const rimGeo = new THREE.CylinderGeometry(radius * 1.2, radius * 1.2, 0.46, radialSegments);

    const topMesh = new THREE.Mesh(geo, mat);
    topMesh.position.y = gapY + gapSize / 2 + pipeHeight / 2;
    const topRim = new THREE.Mesh(rimGeo, mat);
    topRim.position.y = gapY + gapSize / 2 + 0.23;

    const bottomMesh = new THREE.Mesh(geo, mat);
    bottomMesh.position.y = gapY - gapSize / 2 - pipeHeight / 2;
    const bottomRim = new THREE.Mesh(rimGeo, mat);
    bottomRim.position.y = gapY - gapSize / 2 - 0.23;

    pairGroup.add(topMesh, topRim, bottomMesh, bottomRim);

    if (style === 'ringTotem') {
      const collarGeo = new THREE.TorusGeometry(radius * 1.15, 0.12, 10, 24);
      const topCollar = new THREE.Mesh(collarGeo, mat);
      topCollar.rotation.x = Math.PI / 2;
      topCollar.position.y = gapY + gapSize / 2 + 1.4;
      const botCollar = topCollar.clone();
      botCollar.position.y = gapY - gapSize / 2 - 1.4;
      pairGroup.add(topCollar, botCollar);
    }

    const portalRing = new THREE.Mesh(new THREE.TorusGeometry(gapSize * 0.44, 0.06, 12, 32), ringMat);
    portalRing.rotation.y = Math.PI / 2;
    portalRing.position.y = gapY;
    pairGroup.add(portalRing);

    obstacleGroup.add(pairGroup);

    obstacles.push({
      group: pairGroup,
      baseGapY: gapY,
      gapY,
      gapSize,
      style,
      colorHex,
      bobAmp,
      bobSpeed,
      bobPhase,
      passed: customData ? Boolean(customData.passed) : false
    });

    // Spawn collectible diamond inside or between gaps
    if (!customData && Math.random() < 0.75) {
      const dMesh = new THREE.Mesh(diamondGeo, diamondMat);
      dMesh.position.set(posX, gapY + (Math.random() - 0.5) * 0.9, 0);
      diamondGroup.add(dMesh);
      diamonds.push({
        mesh: dMesh,
        baseY: dMesh.position.y,
        collected: false
      });
    }
  }

  /* =========================================================
     SKY BIOME LIGHTING & CELESTIAL CYCLE
     ========================================================= */
  function syncCelestialClockToMode() {
    if (state.skyMode === 'fixed-day') {
      state.celestialTime = 0.0;
    } else if (state.skyMode === 'fixed-night') {
      state.celestialTime = 0.5;
    } else {
      state.celestialTime = state.initialScene === 'night' ? 0.5 : 0.0;
    }
  }

  function updateBiomeAndCelestialCycle(dt) {
    const bConf = BIOME_CONFIG[state.bgBiome] || BIOME_CONFIG.meadow;
    dom.hudBiomeName.textContent = bConf.name;

    if (state.skyMode === 'fixed-day') {
      state.celestialTime = 0.0;
    } else if (state.skyMode === 'fixed-night') {
      state.celestialTime = 0.5;
    } else {
      state.celestialTime =
        (state.celestialTime + dt * state.baseCycleSpeed * state.cycleRateMultiplier) % 1.0;
      if (state.celestialTime < 0) state.celestialTime += 1.0;
    }

    const nightFactor = 0.5 - 0.5 * Math.cos(state.celestialTime * Math.PI * 2);
    const dayCol = new THREE.Color(bConf.daySky);
    const nightCol = new THREE.Color(bConf.nightSky);
    const currentSky = dayCol.clone().lerp(nightCol, nightFactor);

    renderer.setClearColor(currentSky);
    scene.fog.color.copy(currentSky);

    const cloudDayCol = new THREE.Color(bConf.cloudDay);
    const cloudNightCol = new THREE.Color(bConf.cloudNight);
    cloudMat.color.copy(cloudDayCol.lerp(cloudNightCol, nightFactor));

    hemiLight.intensity = 0.74 - nightFactor * 0.28;
    dirLight.intensity = 0.68 - nightFactor * 0.35;
    starMat.opacity = Math.max(0, (nightFactor - 0.32) * 1.45);

    const angle = state.celestialTime * Math.PI * 2 + Math.PI / 2;
    const orbitRadius = 22;
    sunMesh.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle) * 12, -19);
    moonMesh.position.set(Math.cos(angle + Math.PI) * orbitRadius, Math.sin(angle + Math.PI) * 12, -19);

    if (state.skyMode === 'fixed-day') {
      dom.hudSkyPhase.textContent = 'Fixed Day';
    } else if (state.skyMode === 'fixed-night') {
      dom.hudSkyPhase.textContent = 'Fixed Night';
    } else {
      dom.hudSkyPhase.textContent = nightFactor > 0.5 ? 'Dynamic (Night)' : 'Dynamic (Day)';
    }
  }

  /* =========================================================
     3-SECOND COUNTDOWN, RESPAWN & GAME FLOW
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

  function openStudioModal(mode) {
    const isPause = mode === 'pause';
    dom.customizeBadge.textContent = isPause ? 'Flight Paused' : 'Step 2 of 2';
    dom.customizeTitle.textContent = isPause ? 'Pause & Live World Studio' : 'World & Bird Studio';
    dom.btnBackDevice.classList.toggle('hidden-btn', isPause);
    dom.homeActions.classList.toggle('hidden-btn', isPause);
    dom.pauseActions.classList.toggle('hidden-btn', !isPause);

    showActiveScreen(dom.screenCustomize);
    requestAnimationFrame(resizePreviewStage);
  }

  function initNewFlight() {
    clearObstaclesAndDiamonds();
    state.score = 0;
    state.elapsedTime = 0;
    state.birdY = 0.5;
    state.birdVy = 0;
    state.forwardSpeedMultiplier = 1.0;
    state.cycleRateMultiplier = 1.0;
    syncCelestialClockToMode();

    state.obstacleSpawnDelay = 2.0;
    state.timeSinceNextPipe = 0;
    state.nextPipeInterval = 1.35 + Math.random() * 0.55;
    state.lastGapY = (Math.random() - 0.5) * 2.5;

    birdGroup.position.y = state.birdY;
    birdGroup.rotation.z = 0;

    showActiveScreen(null);
    dom.hudContainer.classList.remove('hidden-hud');
    dom.deviceControls.classList.remove('hidden-hud');
    dom.btnPause.classList.remove('hidden-btn');

    updateHudDisplay();
    runThreeSecondCountdown();
  }

  function reviveFlight() {
    if (state.vaultDiamonds < REVIVE_COST) return;

    state.vaultDiamonds -= REVIVE_COST;
    localStorage.setItem(STORAGE_KEYS.VAULT_DIAMONDS, String(state.vaultDiamonds));
    dom.vaultDiamondCount.textContent = state.vaultDiamonds;

    // Clear nearby obstacles so the bird respawns safely without instant re-collision
    const birdX = birdGroup.position.x;
    for (let i = obstacles.length - 1; i >= 0; i--) {
      if (obstacles[i].group.position.x < birdX + 9.5) {
        obstacleGroup.remove(obstacles[i].group);
        obstacles.splice(i, 1);
      }
    }

    state.birdY = 0.5;
    state.birdVy = 2.5;
    birdGroup.position.y = state.birdY;
    birdGroup.rotation.z = 0;

    showActiveScreen(null);
    dom.hudContainer.classList.remove('hidden-hud');
    dom.deviceControls.classList.remove('hidden-hud');
    dom.btnPause.classList.remove('hidden-btn');
    runThreeSecondCountdown();
  }

  function resumeSavedFlight() {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_GAME);
    if (!raw) return initNewFlight();

    try {
      const saved = JSON.parse(raw);
      clearObstaclesAndDiamonds();
      state.score = saved.score || 0;
      state.elapsedTime = saved.elapsedTime || 0;
      state.birdY = saved.birdY ?? 0.5;
      state.birdVy = saved.birdVy ?? 0;
      state.forwardSpeedMultiplier = saved.forwardSpeedMultiplier || 1.0;
      state.cycleRateMultiplier = saved.cycleRateMultiplier || 1.0;
      state.celestialTime = saved.celestialTime || 0;
      if (saved.bgBiome) {
        state.bgBiome = saved.bgBiome;
        dom.biomeSelect.value = state.bgBiome;
        rebuildBiomeScenery();
      }
      if (saved.skyMode) state.skyMode = saved.skyMode;
      if (saved.cameraMode) setCameraMode(saved.cameraMode, false);
      state.obstacleSpawnDelay = 2.0;
      state.timeSinceNextPipe = 0;
      state.nextPipeInterval = 1.4 + Math.random() * 0.5;

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
      gapY: ob.baseGapY,
      gapSize: ob.gapSize,
      style: ob.style,
      colorHex: ob.colorHex,
      bobAmp: ob.bobAmp,
      bobSpeed: ob.bobSpeed,
      bobPhase: ob.bobPhase,
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
      bgBiome: state.bgBiome,
      skyMode: state.skyMode,
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
    openStudioModal('home');
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
    dom.finalVaultDiamonds.textContent = `💎 ${state.vaultDiamonds}`;

    // Always-visible Respawn button with clear status
    dom.btnRevive.classList.remove('hidden-btn');
    if (state.vaultDiamonds >= REVIVE_COST) {
      dom.btnRevive.disabled = false;
      dom.btnRevive.textContent = `💎 Respawn Here (${REVIVE_COST} Diamond • Vault: ${state.vaultDiamonds})`;
    } else {
      dom.btnRevive.disabled = true;
      dom.btnRevive.textContent = `💎 Respawn Locked (Need ${REVIVE_COST} Diamond • Vault: 0)`;
    }

    dom.btnPause.classList.add('hidden-btn');
    showActiveScreen(dom.screenGameover);
  }

  function showActiveScreen(targetModal) {
    [dom.screenDevice, dom.screenCustomize, dom.screenGameover].forEach((m) => {
      if (m === targetModal) m.classList.add('active-screen');
      else m.classList.remove('active-screen');
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
    dom.hudCycleSpeed.textContent =
      state.skyMode === 'dynamic' ? `${state.cycleRateMultiplier.toFixed(1)}x` : 'Locked';
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
    if (state.skyMode !== 'dynamic') {
      state.skyMode = 'dynamic';
      document.getElementById('sky-mode-selector').querySelectorAll('button').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-skymode') === 'dynamic');
      });
      dom.dynamicStartWrap.classList.remove('hidden-btn');
    }
    state.cycleRateMultiplier = Math.max(0.1, Math.min(5.0, state.cycleRateMultiplier + delta));
    updateHudDisplay();
  }

  window.addEventListener('keydown', (e) => {
    SoundFX.initContext();
    if (e.code === 'ArrowUp' || e.code === 'Space') {
      e.preventDefault();
      flapBird();
    } else if (e.key === 'a' || e.key === 'A') adjustBirdSpeed(0.2);
    else if (e.key === 'd' || e.key === 'D') adjustBirdSpeed(-0.2);
    else if (e.key === 'w' || e.key === 'W') adjustCycleRate(0.4);
    else if (e.key === 's' || e.key === 'S') adjustCycleRate(-0.4);
    else if (e.key === 'c' || e.key === 'C') toggleCameraMode();
    else if (e.code === 'Escape' && state.phase === 'playing') pauseFlight();
  });

  bindTouchAndClick(document.getElementById('btn-jump'), flapBird);
  bindTouchAndClick(document.getElementById('btn-cam-toggle'), toggleCameraMode);
  bindTouchAndClick(document.getElementById('btn-speed-up'), () => adjustBirdSpeed(0.2));
  bindTouchAndClick(document.getElementById('btn-speed-down'), () => adjustBirdSpeed(-0.2));
  bindTouchAndClick(document.getElementById('btn-cycle-fast'), () => adjustCycleRate(0.4));
  bindTouchAndClick(document.getElementById('btn-cycle-slow'), () => adjustCycleRate(-0.4));

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
     STUDIO & UI WIRING
     ========================================================= */
  document.querySelectorAll('.device-option').forEach((btn) => {
    bindTouchAndClick(btn, () => {
      state.device = btn.getAttribute('data-device');
      document.body.setAttribute('data-device', state.device);
      checkSavedSessionButton();
      openStudioModal('home');
    });
  });

  bindTouchAndClick(dom.btnBackDevice, () => {
    autoDetectDeviceProfile();
    showActiveScreen(dom.screenDevice);
  });

  dom.biomeSelect.addEventListener('change', (e) => {
    state.bgBiome = e.target.value;
    rebuildBiomeScenery();
    updateBiomeAndCelestialCycle(0);
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

  setupSegmentedButtons('sky-mode-selector', (btn) => {
    state.skyMode = btn.getAttribute('data-skymode');
    dom.dynamicStartWrap.classList.toggle('hidden-btn', state.skyMode !== 'dynamic');
    syncCelestialClockToMode();
    updateBiomeAndCelestialCycle(0);
    updateHudDisplay();
  });

  setupSegmentedButtons('scene-selector', (btn) => {
    state.initialScene = btn.getAttribute('data-scene');
    if (state.skyMode === 'dynamic') {
      state.celestialTime = state.initialScene === 'night' ? 0.5 : 0.0;
      updateBiomeAndCelestialCycle(0);
    }
  });

  setupSegmentedButtons('cam-selector', (btn) => {
    setCameraMode(btn.getAttribute('data-cam'), true);
  });

  setupSegmentedButtons('shape-selector', (btn) => {
    state.birdShape = btn.getAttribute('data-shape');
    rebuildAllBirdModels();
  });

  setupSegmentedButtons('body-color-selector', (btn) => {
    state.bodyColor = btn.getAttribute('data-color');
    rebuildAllBirdModels();
  });

  setupSegmentedButtons('wing-color-selector', (btn) => {
    state.wingColor = btn.getAttribute('data-color');
    rebuildAllBirdModels();
  });

  bindTouchAndClick(dom.btnStartGame, initNewFlight);
  bindTouchAndClick(dom.btnResumeSaved, resumeSavedFlight);

  function pauseFlight() {
    if (state.phase !== 'playing') return;
    state.phase = 'paused';
    openStudioModal('pause');
  }

  bindTouchAndClick(dom.btnPause, pauseFlight);

  bindTouchAndClick(dom.btnResumePlay, () => {
    showActiveScreen(null);
    runThreeSecondCountdown();
  });

  bindTouchAndClick(dom.btnSaveLeave, saveProgressAndLeaveHome);
  bindTouchAndClick(dom.btnRetry, initNewFlight);
  bindTouchAndClick(dom.btnRevive, reviveFlight);
  bindTouchAndClick(dom.btnGameoverHome, () => {
    state.phase = 'menu';
    dom.hudContainer.classList.add('hidden-hud');
    dom.deviceControls.classList.add('hidden-hud');
    openStudioModal('home');
  });

  function handleResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.fov = w < 650 ? 68 : 58;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    resizePreviewStage();
  }

  window.addEventListener('resize', handleResize);
  handleResize();

  /* =========================================================
     MAIN GAME & LIVE 3D PREVIEW ANIMATION LOOP
     ========================================================= */
  rebuildAllBirdModels();
  rebuildBiomeScenery();
  updateBiomeAndCelestialCycle(0);
  updateHudDisplay();

  let lastTime = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    const flapAngle = Math.sin(now * 0.015 * state.forwardSpeedMultiplier) * 0.55;
    if (mainWings.leftPivot && mainWings.rightPivot) {
      mainWings.leftPivot.rotation.x = flapAngle;
      mainWings.rightPivot.rotation.x = -flapAngle;
    }
    if (previewWings.leftPivot && previewWings.rightPivot) {
      previewWings.leftPivot.rotation.x = Math.sin(now * 0.012) * 0.5;
      previewWings.rightPivot.rotation.x = -Math.sin(now * 0.012) * 0.5;
    }

    if (state.autoRotatePreview && !isDraggingPreview) {
      previewBirdGroup.rotation.y += dt * 1.1;
    }
    previewBirdGroup.position.y = Math.sin(now * 0.0035) * 0.12;
    previewRenderer.render(previewScene, previewCamera);

    const cloudSpeedBase = state.baseForwardSpeed * state.forwardSpeedMultiplier;
    clouds.forEach((c) => {
      c.mesh.position.x -= cloudSpeedBase * c.speedFactor * dt;
      if (c.mesh.position.x < -34) c.mesh.position.x = 68;
    });

    if (state.phase === 'playing') {
      state.elapsedTime += dt;
      updateBiomeAndCelestialCycle(dt);

      state.birdVy += state.gravity * dt;
      state.birdY += state.birdVy * dt;
      birdGroup.position.y = state.birdY;
      birdGroup.rotation.z = Math.max(-0.6, Math.min(0.55, state.birdVy * 0.06));

      if (state.birdY < -6.2 || state.birdY > 6.5) {
        triggerGameOver();
      }

      const forwardVel = state.baseForwardSpeed * state.forwardSpeedMultiplier;

      biomeProps.forEach((prop) => {
        prop.position.x -= forwardVel * 0.38 * dt;
        if (prop.position.x < -30) prop.position.x = 58;
      });

      if (state.obstacleSpawnDelay > 0) {
        state.obstacleSpawnDelay -= dt;
      } else {
        state.timeSinceNextPipe += dt * state.forwardSpeedMultiplier;
        if (state.timeSinceNextPipe >= state.nextPipeInterval) {
          state.timeSinceNextPipe = 0;
          state.nextPipeInterval = 1.35 + Math.random() * 0.6;
          spawnObstacle();
        }
      }

      const birdX = birdGroup.position.x;
      const birdRadius = 0.45;

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const ob = obstacles[i];
        ob.group.position.x -= forwardVel * dt;

        if (ob.bobAmp > 0) {
          const offset = Math.sin(state.elapsedTime * ob.bobSpeed + ob.bobPhase) * ob.bobAmp;
          ob.group.position.y = offset;
          ob.gapY = ob.baseGapY + offset;
        }

        if (!ob.passed && ob.group.position.x < birdX) {
          ob.passed = true;
          state.score += 1;
          SoundFX.score();
          persistHighRecords();
        }

        const dx = Math.abs(ob.group.position.x - birdX);
        if (dx < 0.74 + birdRadius) {
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

      // Collect Vault Diamonds
      for (let i = diamonds.length - 1; i >= 0; i--) {
        const d = diamonds[i];
        d.mesh.position.x -= forwardVel * dt;
        d.mesh.rotation.y += dt * 2.8;
        d.mesh.position.y = d.baseY + Math.sin(now * 0.005 + i) * 0.22;

        if (!d.collected) {
          const dist = d.mesh.position.distanceTo(birdGroup.position);
          if (dist < 0.92) {
            d.collected = true;
            diamondGroup.remove(d.mesh);
            state.vaultDiamonds += 1;
            localStorage.setItem(STORAGE_KEYS.VAULT_DIAMONDS, String(state.vaultDiamonds));
            dom.vaultDiamondCount.textContent = state.vaultDiamonds;
            SoundFX.diamondCollect();
          }
        }

        if (d.mesh.position.x < -16) {
          diamondGroup.remove(d.mesh);
          diamonds.splice(i, 1);
        }
      }

      updateHudDisplay();
    } else {
      updateBiomeAndCelestialCycle(dt * 0.2);
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
