/**
 * ============================================================================
 * CINEMATIC DIGITAL CIRCUIT ASSEMBLY INTRODUCTION (10.0 SECONDS)
 * Procedural 60FPS motion graphics canvas, self-routing circuit traces,
 * live logic gate synthesis, microprocessor fusion, and title drop.
 * ============================================================================
 */

class CinematicIntro {
  constructor() {
    this.overlay = document.getElementById('introOverlay');
    this.canvas = document.getElementById('introCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.skipBtn = document.getElementById('introSkipBtn');
    this.stageLabel = document.getElementById('introStageLabel');
    this.timerDisplay = document.getElementById('introTimerDisplay');

    this.totalDurationMs = 10000; // 10.0s
    this.startTime = null;
    this.animFrameId = null;
    this.isDismissed = false;

    this.soundTriggered = { s1: false, s2: false, s3: false, s4: false };

    // Ambient background dust
    this.ambientStars = [];
    this.initStars();

    this.init();
  }

  init() {
    if (!this.overlay || !this.canvas) return;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => this.dismiss());
    }

    // Escape key skips intro
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.isDismissed) {
        this.dismiss();
      }
    });

    this.startSequence();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    if (this.ctx) {
      this.ctx.scale(this.dpr, this.dpr);
    }
  }

  initStars() {
    this.ambientStars = [];
    for (let i = 0; i < 60; i++) {
      this.ambientStars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.0003 + 0.0001
      });
    }
  }

  startSequence() {
    this.startTime = performance.now();
    this.isDismissed = false;
    this.soundTriggered = { s1: false, s2: false, s3: false, s4: false };
    this.overlay.classList.remove('hide-intro');
    this.overlay.style.display = 'flex';

    // Synchronized audio start
    this.playAudioEvent(1);

    const loop = (now) => {
      if (this.isDismissed) return;

      const elapsed = now - this.startTime;
      const progress = Math.min(1, elapsed / this.totalDurationMs);
      const remaining = Math.max(0, (this.totalDurationMs - elapsed) / 1000).toFixed(1);

      if (this.timerDisplay) {
        this.timerDisplay.textContent = `${remaining}s`;
      }

      this.renderFrame(elapsed, progress);

      if (elapsed >= this.totalDurationMs) {
        this.dismiss();
        return;
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  renderFrame(elapsed, progress) {
    if (!this.ctx) return;
    const w = this.w;
    const h = this.h;
    const cx = w / 2;
    const cy = h / 2;

    // Clear canvas
    this.ctx.fillStyle = '#050811';
    this.ctx.fillRect(0, 0, w, h);

    // 1. Draw subtle ambient circuit grid
    this.drawGrid(w, h, elapsed);

    // 2. Draw floating ambient particles
    this.drawAmbientStars(w, h, elapsed);

    // 3. Stage Timeline Logic
    if (elapsed < 2800) {
      // ----------------------------------------------------------------------
      // STAGE 1: Signal Propagation & Bus Routing (0.0s - 2.8s)
      // ----------------------------------------------------------------------
      if (this.stageLabel) this.stageLabel.textContent = 'STAGE 01 // SIGNAL PROPAGATION';
      const p1 = elapsed / 2800;
      this.drawStage1Traces(cx, cy, w, h, p1);

    } else if (elapsed < 5600) {
      // ----------------------------------------------------------------------
      // STAGE 2: Logic Gate Primitives Awakening (2.8s - 5.6s)
      // ----------------------------------------------------------------------
      if (!this.soundTriggered.s2) {
        this.soundTriggered.s2 = true;
        this.playAudioEvent(2);
      }
      if (this.stageLabel) this.stageLabel.textContent = 'STAGE 02 // LOGIC GATE PRIMITIVES';
      const p2 = (elapsed - 2800) / 2800;
      this.drawStage2Gates(cx, cy, w, h, p2);

    } else if (elapsed < 8000) {
      // ----------------------------------------------------------------------
      // STAGE 3: Microprocessor Convergence & Lock (5.6s - 8.0s)
      // ----------------------------------------------------------------------
      if (!this.soundTriggered.s3) {
        this.soundTriggered.s3 = true;
        this.playAudioEvent(3);
      }
      if (this.stageLabel) this.stageLabel.textContent = 'STAGE 03 // SILICON ARCHITECTURE LOCK';
      const p3 = (elapsed - 5600) / 2400;
      this.drawStage3Chip(cx, cy, w, h, p3);

    } else {
      // ----------------------------------------------------------------------
      // STAGE 4: Grand Title Reveal & Studio Activation (8.0s - 10.0s)
      // ----------------------------------------------------------------------
      if (!this.soundTriggered.s4) {
        this.soundTriggered.s4 = true;
        this.playAudioEvent(4);
      }
      if (this.stageLabel) this.stageLabel.textContent = 'STAGE 04 // STUDIO READY';
      const p4 = (elapsed - 8000) / 2000;
      this.drawStage4Title(cx, cy, w, h, p4);
    }
  }

  // --------------------------------------------------------------------------
  // Drawing Helpers
  // --------------------------------------------------------------------------
  drawGrid(w, h, elapsed) {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    this.ctx.lineWidth = 1;
    const step = 48;
    for (let x = 0; x < w; x += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }
  }

  drawAmbientStars(w, h, elapsed) {
    this.ambientStars.forEach(s => {
      s.y -= s.speed;
      if (s.y < 0) s.y = 1;
      this.ctx.fillStyle = `rgba(56, 189, 248, ${s.alpha * 0.7})`;
      this.ctx.beginPath();
      this.ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  // Stage 1: Animated self-drawing laser traces with molten spark heads
  drawStage1Traces(cx, cy, w, h, p) {
    const traces = [
      { sx: 0, sy: cy - 120, turns: [{ x: cx - 180, y: cy - 120 }, { x: cx - 180, y: cy - 40 }, { x: cx - 20, y: cy - 40 }], color: '#00f2fe' },
      { sx: 0, sy: cy + 120, turns: [{ x: cx - 220, y: cy + 120 }, { x: cx - 220, y: cy + 40 }, { x: cx - 20, y: cy + 40 }], color: '#10b981' },
      { sx: w, sy: cy - 100, turns: [{ x: cx + 190, y: cy - 100 }, { x: cx + 190, y: cy - 20 }, { x: cx + 30, y: cy - 20 }], color: '#38bdf8' },
      { sx: w, sy: cy + 100, turns: [{ x: cx + 210, y: cy + 100 }, { x: cx + 210, y: cy + 30 }, { x: cx + 30, y: cy + 30 }], color: '#a855f7' }
    ];

    traces.forEach(t => {
      this.drawProgressivePolyline(t.sx, t.sy, t.turns, p, t.color);
    });

    // Central pulsing target
    this.ctx.strokeStyle = `rgba(16, 185, 129, ${p * 0.6})`;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(cx - 30, cy - 30, 60, 60);

    this.ctx.fillStyle = '#f8fafc';
    this.ctx.font = '700 13px "Fira Code", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PROPAGATING DATA BUS...', cx, cy + 90);
  }

  drawProgressivePolyline(sx, sy, points, progress, color) {
    const allPts = [{ x: sx, y: sy }, ...points];
    let totalLen = 0;
    const segLens = [];

    for (let i = 0; i < allPts.length - 1; i++) {
      const dx = allPts[i + 1].x - allPts[i].x;
      const dy = allPts[i + 1].y - allPts[i].y;
      const len = Math.hypot(dx, dy);
      segLens.push(len);
      totalLen += len;
    }

    let targetLen = totalLen * progress;
    let currentX = sx;
    let currentY = sy;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3.5;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 14;
    this.ctx.beginPath();
    this.ctx.moveTo(sx, sy);

    for (let i = 0; i < segLens.length; i++) {
      const pA = allPts[i];
      const pB = allPts[i + 1];
      const sLen = segLens[i];

      if (targetLen >= sLen) {
        this.ctx.lineTo(pB.x, pB.y);
        targetLen -= sLen;
        currentX = pB.x;
        currentY = pB.y;
      } else {
        const ratio = targetLen / sLen;
        currentX = pA.x + (pB.x - pA.x) * ratio;
        currentY = pA.y + (pB.y - pA.y) * ratio;
        this.ctx.lineTo(currentX, currentY);
        break;
      }
    }
    this.ctx.stroke();

    // Solder pad at origin
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(sx, sy, 5, 0, Math.PI * 2);
    this.ctx.fill();

    // Glowing spark head at current progress
    this.ctx.fillStyle = '#ffffff';
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(currentX, currentY, 4.5, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }

  // Stage 2: Three logic gates draw themselves and fire digital logic
  drawStage2Gates(cx, cy, w, h, p) {
    const gateW = 140;
    const gateH = 80;
    const spacing = 180;

    const gates = [
      { name: 'AND GATE', formula: 'Y = A · B', x: cx - spacing, y: cy, color: '#10b981', op: '&' },
      { name: 'OR GATE', formula: 'Y = A + B', x: cx, y: cy, color: '#38bdf8', op: '≥1' },
      { name: 'NOT GATE', formula: 'Y = Ā', x: cx + spacing, y: cy, color: '#f43f5e', op: '1' }
    ];

    gates.forEach((g, idx) => {
      const gateProgress = Math.min(1, Math.max(0, (p - idx * 0.18) / 0.6));
      if (gateProgress <= 0) return;

      this.ctx.save();
      this.ctx.translate(g.x, g.y);

      // Gate Shell (Smooth outline draw)
      this.ctx.strokeStyle = g.color;
      this.ctx.lineWidth = 3;
      this.ctx.shadowColor = g.color;
      this.ctx.shadowBlur = gateProgress * 15;
      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';

      // Draw Gate Box
      this.ctx.beginPath();
      this.ctx.roundRect(-45, -35, 90, 70, 10);
      this.ctx.fill();
      this.ctx.stroke();

      // Input lines into gate
      this.ctx.strokeStyle = gateProgress > 0.5 ? g.color : '#475569';
      this.ctx.lineWidth = 2.5;

      // Pin 1
      this.ctx.beginPath();
      this.ctx.moveTo(-75, -15);
      this.ctx.lineTo(-45, -15);
      this.ctx.stroke();

      // Pin 2 (if not NOT)
      if (g.name !== 'NOT GATE') {
        this.ctx.beginPath();
        this.ctx.moveTo(-75, 15);
        this.ctx.lineTo(-45, 15);
        this.ctx.stroke();
      }

      // Output line out of gate
      this.ctx.beginPath();
      this.ctx.moveTo(45, 0);
      this.ctx.lineTo(75, 0);
      this.ctx.stroke();

      // Flying photon pulse on output when gate fires
      if (gateProgress > 0.6) {
        const photonP = (gateProgress - 0.6) / 0.4;
        const px = 45 + photonP * 30;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = g.color;
        this.ctx.shadowBlur = 12;
        this.ctx.beginPath();
        this.ctx.arc(px, 0, 4, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Operator in center
      this.ctx.fillStyle = g.color;
      this.ctx.font = '800 18px "Fira Code", monospace';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(g.op, 0, 0);

      // Label below
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '700 13px "Outfit", sans-serif';
      this.ctx.fillText(g.name, 0, 50);

      this.ctx.fillStyle = g.color;
      this.ctx.font = '600 11px "Fira Code", monospace';
      this.ctx.fillText(g.formula, 0, 68);

      this.ctx.restore();
    });

    // Top message
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.font = '700 13px "Fira Code", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('SYNTHESIZING BOOLEAN GATE PRIMITIVES', cx, cy - 90);
  }

  // Stage 3: Convergence into glowing Microprocessor Silicon Core
  drawStage3Chip(cx, cy, w, h, p) {
    const chipSize = 130;

    // 1. Converging circuit buses streaming inward
    const busCount = 16;
    for (let i = 0; i < busCount; i++) {
      const angle = (i / busCount) * Math.PI * 2;
      const startDist = Math.max(w, h) * 0.6 * (1 - p * 0.8);
      const endDist = chipSize * 0.7;

      const sx = cx + Math.cos(angle) * startDist;
      const sy = cy + Math.sin(angle) * startDist;
      const ex = cx + Math.cos(angle) * endDist;
      const ey = cy + Math.sin(angle) * endDist;

      this.ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 242, 254, 0.6)' : 'rgba(16, 185, 129, 0.6)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(sx, sy);
      this.ctx.lineTo(ex, ey);
      this.ctx.stroke();

      // Traveling packet along each bus
      const packetP = (p * 3 + i * 0.1) % 1;
      const px = sx + (ex - sx) * packetP;
      const py = sy + (ey - sy) * packetP;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Shockwave pulse ring on lock
    if (p > 0.4) {
      const ringP = (p - 0.4) / 0.6;
      const radius = chipSize * 0.8 + ringP * 250;
      this.ctx.strokeStyle = `rgba(16, 185, 129, ${1 - ringP})`;
      this.ctx.lineWidth = 3 * (1 - ringP);
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // 3. Central Silicon Processor Die
    this.ctx.save();
    this.ctx.translate(cx, cy);

    // Outer gold pins
    const pinLen = 14;
    this.ctx.fillStyle = '#d4af37';
    for (let i = -4; i <= 4; i++) {
      if (i === 0) continue;
      // Top pins
      this.ctx.fillRect(i * 12 - 2, -chipSize / 2 - pinLen, 4, pinLen);
      // Bottom pins
      this.ctx.fillRect(i * 12 - 2, chipSize / 2, 4, pinLen);
      // Left pins
      this.ctx.fillRect(-chipSize / 2 - pinLen, i * 12 - 2, pinLen, 4);
      // Right pins
      this.ctx.fillRect(chipSize / 2, i * 12 - 2, pinLen, 4);
    }

    // Silicon Package
    this.ctx.fillStyle = '#0f172a';
    this.ctx.strokeStyle = '#10b981';
    this.ctx.lineWidth = 3;
    this.ctx.shadowColor = '#10b981';
    this.ctx.shadowBlur = 24 * p;
    this.ctx.beginPath();
    this.ctx.roundRect(-chipSize / 2, -chipSize / 2, chipSize, chipSize, 14);
    this.ctx.fill();
    this.ctx.stroke();

    // Central die core
    this.ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    this.ctx.strokeStyle = '#00f2fe';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.roundRect(-35, -35, 70, 70, 8);
    this.ctx.fill();
    this.ctx.stroke();

    // Chip text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '800 13px "Fira Code", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('LOGIC-v2', 0, -6);

    this.ctx.fillStyle = '#10b981';
    this.ctx.font = '700 10px "Fira Code", monospace';
    this.ctx.fillText('CORE LOCKED', 0, 10);

    this.ctx.restore();

    this.ctx.fillStyle = '#f8fafc';
    this.ctx.font = '700 13px "Fira Code", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('SILICON ARCHITECTURE CONVERGED', cx, cy + 110);
  }

  // Stage 4: Grand Cinematic Title Drop & Final Activation
  drawStage4Title(cx, cy, w, h, p) {
    const alpha = Math.min(1, p * 2);

    this.ctx.save();
    this.ctx.translate(cx, cy);

    // Glowing background aura
    const grad = this.ctx.createRadialGradient(0, 0, 20, 0, 0, 260);
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.1)');
    grad.addColorStop(1, 'transparent');
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 260, 0, Math.PI * 2);
    this.ctx.fill();

    // Big Title
    this.ctx.fillStyle = '#ffffff';
    this.ctx.shadowColor = '#10b981';
    this.ctx.shadowBlur = 24 * alpha;
    this.ctx.font = '800 44px "Space Grotesk", "Outfit", sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('LOGICGATE STUDIO', 0, -30);

    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = '#38bdf8';
    this.ctx.font = '600 13px "Fira Code", monospace';
    this.ctx.letterSpacing = '0.15em';
    this.ctx.fillText('DIGITAL ELECTRONICS & COMPUTER ARCHITECTURE', 0, 12);

    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '500 14px "Outfit", sans-serif';
    this.ctx.fillText('Engineered by Darsh K. Raval', 0, 42);

    // Ready Tag
    this.ctx.fillStyle = '#10b981';
    this.ctx.font = '700 12px "Fira Code", monospace';
    this.ctx.fillText('SYSTEM INITIALIZATION COMPLETE', 0, 80);

    this.ctx.restore();
  }

  // Synchronized Procedural Web Audio Milestones
  playAudioEvent(stage) {
    try {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioClass) return;
      if (!this.audioCtx) this.audioCtx = new AudioClass();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      if (window.soundEngine && window.soundEngine.isMuted) return;

      const now = this.audioCtx.currentTime;

      if (stage === 1) {
        // Deep cyber rising hum
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 1.2);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 1.5);

      } else if (stage === 2) {
        // High-tech gate clicks
        [440, 554, 659].forEach((f, i) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.08);
          gain.gain.setValueAtTime(0.15, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.16);
        });

      } else if (stage === 3) {
        // Chip lock pulse
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);

      } else if (stage === 4) {
        // Triumphant major triad chord
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.2, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.8);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.85);
        });
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  dismiss() {
    if (this.isDismissed) return;
    this.isDismissed = true;

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    // Smooth fade out
    this.overlay.classList.add('hide-intro');

    setTimeout(() => {
      this.overlay.style.display = 'none';
    }, 800);
  }

  replay() {
    this.overlay.style.display = 'flex';
    this.resizeCanvas();
    setTimeout(() => {
      this.startSequence();
    }, 20);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      window.introCtrl = new CinematicIntro();
    }).catch(() => {
      window.introCtrl = new CinematicIntro();
    });
  } else {
    window.introCtrl = new CinematicIntro();
  }
});
