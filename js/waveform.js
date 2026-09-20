/**
 * ============================================================================
 * REAL-TIME LOGIC ANALYZER / OSCILLOSCOPE WAVEFORM SIMULATOR
 * Visualizes digital square waves for Input A, Input B, and Output Y
 * With built-in clock pulse generator (Auto-Oscillator)
 * ============================================================================
 */

class WaveformVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.maxSamples = 300;
    this.history = []; // Array of { a, b, y }
    this.clockInterval = null;
    this.clockHz = 1;
    this.isClockRunning = false;

    this.currentValues = { a: 0, b: 0, y: 0 };

    this.initCanvasSize();
    this.seedInitialHistory();
    this.startRenderLoop();

    window.addEventListener('resize', () => this.initCanvasSize());
  }

  initCanvasSize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = rect.height * (window.devicePixelRatio || 1);
    if (this.ctx) {
      this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
  }

  seedInitialHistory() {
    for (let i = 0; i < this.maxSamples; i++) {
      this.history.push({ a: 0, b: 0, y: 0 });
    }
  }

  updateSignal(a, b, y) {
    this.currentValues = { a, b, y };
  }

  // Push current state into history and shift
  tick() {
    this.history.push({ ...this.currentValues });
    if (this.history.length > this.maxSamples) {
      this.history.shift();
    }
  }

  startRenderLoop() {
    let lastTime = performance.now();
    const frame = (time) => {
      // Push state at fixed sample rate (~30 ticks per sec)
      if (time - lastTime > 32) {
        this.tick();
        lastTime = time;
      }
      this.draw();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    this.ctx.clearRect(0, 0, w, h);

    // Channels configuration: 3 tracks (Input A, Input B, Output Y)
    const channels = [
      { name: 'CH1: Input A', key: 'a', color: '#38bdf8', yBase: h * 0.28, height: h * 0.16 },
      { name: 'CH2: Input B', key: 'b', color: '#a855f7', yBase: h * 0.58, height: h * 0.16 },
      { name: 'CH3: Output Y', key: 'y', color: '#10b981', yBase: h * 0.88, height: h * 0.16 }
    ];

    // Background grid lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 1;

    // Horizontal track separators
    channels.forEach(ch => {
      this.ctx.beginPath();
      this.ctx.moveTo(0, ch.yBase);
      this.ctx.lineTo(w, ch.yBase);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.setLineDash([2, 4]);
      this.ctx.moveTo(0, ch.yBase - ch.height);
      this.ctx.lineTo(w, ch.yBase - ch.height);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    });

    // Time-axis vertical grid ticks
    const stepX = w / (this.maxSamples - 1);
    for (let x = 0; x < w; x += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }

    // Draw square wave traces for each channel
    channels.forEach(ch => {
      this.ctx.strokeStyle = ch.color;
      this.ctx.lineWidth = 2.2;
      this.ctx.shadowColor = ch.color;
      this.ctx.shadowBlur = 6;
      this.ctx.beginPath();

      for (let i = 0; i < this.history.length; i++) {
        const sample = this.history[i];
        const val = sample[ch.key];
        const x = i * stepX;
        const y = val === 1 ? (ch.yBase - ch.height) : ch.yBase;

        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          const prevVal = this.history[i - 1][ch.key];
          const prevY = prevVal === 1 ? (ch.yBase - ch.height) : ch.yBase;
          if (prevVal !== val) {
            // Draw vertical transition edge (instant digital rise/fall)
            this.ctx.lineTo(x, prevY);
            this.ctx.lineTo(x, y);
          } else {
            this.ctx.lineTo(x, y);
          }
        }
      }
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // Channel Label
      this.ctx.fillStyle = ch.color;
      this.ctx.font = '500 11px "Fira Code", monospace';
      this.ctx.fillText(`${ch.name} [${this.currentValues[ch.key]}]`, 12, ch.yBase - ch.height - 4);
    });
  }

  // Auto-Clock Oscillator
  toggleAutoClock(onTickCallback) {
    if (this.isClockRunning) {
      this.stopAutoClock();
    } else {
      this.startAutoClock(onTickCallback);
    }
    return this.isClockRunning;
  }

  startAutoClock(onTickCallback) {
    this.isClockRunning = true;
    let cycle = 0;
    const intervalMs = Math.round(1000 / (this.clockHz * 2));

    this.clockInterval = setInterval(() => {
      cycle++;
      // Generate binary counting sequence: 00 -> 01 -> 10 -> 11
      const a = (cycle >> 1) % 2;
      const b = cycle % 2;
      if (onTickCallback) {
        onTickCallback(a, b);
      }
    }, intervalMs);
  }

  stopAutoClock() {
    this.isClockRunning = false;
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  setClockHz(hz, onTickCallback) {
    this.clockHz = hz;
    if (this.isClockRunning) {
      this.stopAutoClock();
      this.startAutoClock(onTickCallback);
    }
  }
}

window.WaveformVisualizer = WaveformVisualizer;
