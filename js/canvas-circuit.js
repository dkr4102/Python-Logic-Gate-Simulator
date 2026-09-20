/**
 * ============================================================================
 * ULTRA-SMOOTH DYNAMIC CIRCUIT SCHEMATICS & ELECTRICAL FLOW ENGINE
 * Silky transitions, continuous non-resetting electron flow, glowing conduits,
 * and elegant particle sparks.
 * ============================================================================
 */

class CircuitRenderer {
  constructor(svgContainerId, sparkCanvasId) {
    this.svgContainer = document.getElementById(svgContainerId);
    this.sparkCanvas = document.getElementById(sparkCanvasId);
    this.sparkCtx = this.sparkCanvas ? this.sparkCanvas.getContext('2d') : null;
    this.particles = [];
    this.animFrameId = null;
    this.lastGateId = null;
    this.lastOutputY = 0;

    this.initCanvasSize();
    this.startParticleLoop();

    window.addEventListener('resize', () => this.initCanvasSize());
  }

  initCanvasSize() {
    if (!this.sparkCanvas) return;
    const rect = this.sparkCanvas.getBoundingClientRect();
    this.sparkCanvas.width = rect.width * (window.devicePixelRatio || 1);
    this.sparkCanvas.height = rect.height * (window.devicePixelRatio || 1);
    if (this.sparkCtx) {
      this.sparkCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
  }

  // Smooth particle emission
  emitSparks(x, y, color = '#10b981') {
    if (!this.sparkCtx) return;
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1.2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2.8 + 1.2,
        alpha: 1,
        color: color,
        decay: Math.random() * 0.025 + 0.015
      });
    }
  }

  startParticleLoop() {
    const loop = () => {
      if (this.sparkCtx && this.sparkCanvas) {
        const rect = this.sparkCanvas.getBoundingClientRect();
        this.sparkCtx.clearRect(0, 0, rect.width, rect.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            this.particles.splice(i, 1);
            continue;
          }

          this.sparkCtx.save();
          this.sparkCtx.globalAlpha = p.alpha;
          this.sparkCtx.fillStyle = p.color;
          this.sparkCtx.beginPath();
          this.sparkCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.sparkCtx.fill();
          this.sparkCtx.restore();
        }
      }
      this.animFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  render(gateId, inputA, inputB, outputY) {
    if (!this.svgContainer) return;
    const gate = window.LOGIC_GATES[gateId];
    if (!gate) return;

    // Check if structure needs rebuilding or if we can do an ultra-smooth state update
    const needsFullRebuild = (this.lastGateId !== gateId);

    if (needsFullRebuild) {
      this.buildFullSvgStructure(gateId, inputA, inputB, outputY);
      this.lastGateId = gateId;
    } else {
      this.updateExistingSvgState(gateId, inputA, inputB, outputY);
    }

    // Emit gentle sparks on 0 -> 1 transition
    if (this.lastOutputY === 0 && outputY === 1 && this.sparkCanvas) {
      const rect = this.sparkCanvas.getBoundingClientRect();
      const outX = (525 / 620) * rect.width;
      const outY = (120 / 240) * rect.height;
      this.emitSparks(outX, outY, gate.color || '#10b981');
    }

    this.lastOutputY = outputY;
  }

  buildFullSvgStructure(gateId, inputA, inputB, outputY) {
    const gate = window.LOGIC_GATES[gateId];
    const isSingleInput = (gate.inputs === 1);
    const accentColor = gate.color || '#10b981';

    const startX = 75;
    const gateLeftX = 235;
    const centerY = 120;
    const topY = 75;
    const botY = 165;

    let gateExitX = 375;
    if (gateId === 'NOT' || gateId === 'BUFFER') gateExitX = 350;
    if (gateId === 'NAND' || gateId === 'NOR' || gateId === 'XNOR') gateExitX = 390;
    const outX = 525;

    let svg = `
      <defs>
        <filter id="energy-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur1" />
          <feGaussianBlur stdDeviation="5" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" flood-opacity="0.2" />
        </filter>

        <linearGradient id="activeBeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00f2fe" />
          <stop offset="50%" stop-color="#10b981" />
          <stop offset="100%" stop-color="#38bdf8" />
        </linearGradient>

        <linearGradient id="idleBeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--wire-off)" stop-opacity="0.5" />
          <stop offset="100%" stop-color="var(--wire-off)" stop-opacity="0.8" />
        </linearGradient>

        <style>
          .smooth-transition {
            transition: stroke 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                        fill 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                        opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                        filter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          }
          @keyframes wireLaserFlow {
            0% { stroke-dashoffset: 48; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes idleLaserFlow {
            0% { stroke-dashoffset: 36; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes radarPulse {
            0% { r: 6; opacity: 0.8; stroke-width: 2; }
            100% { r: 16; opacity: 0; stroke-width: 0.5; }
          }
          .laser-stream-active {
            stroke-dasharray: 10 14;
            animation: wireLaserFlow 0.75s linear infinite;
          }
          .laser-stream-idle {
            stroke-dasharray: 4 12;
            animation: idleLaserFlow 3.2s linear infinite;
          }
          .radar-ring {
            animation: radarPulse 2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
            transform-origin: center;
          }
        </style>
      </defs>
    `;

    // Helper for wire conduit
    const createWireMarkup = (id, x1, y1, x2, y2, label) => `
      <g id="conduit_${id}">
        <!-- Track -->
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
              stroke="var(--bg-surface-elevated)" stroke-width="10" stroke-linecap="round" />
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
              stroke="var(--border-medium)" stroke-width="10" stroke-linecap="round" opacity="0.35" />

        <!-- Core Energy Rail -->
        <line id="${id}_core" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
              stroke-linecap="round" class="smooth-transition" />

        <!-- Animated Laser Pulses -->
        <line id="${id}_laser" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
              stroke-linecap="round" class="smooth-transition" />

        <!-- Continuous Flowing Photons -->
        <circle id="${id}_photon1" r="4.5" class="smooth-transition">
          <animateMotion path="M ${x1} ${y1} L ${x2} ${y2}" dur="0.8s" repeatCount="indefinite" />
        </circle>
        <circle id="${id}_photon2" r="3" fill="#ffffff" class="smooth-transition">
          <animateMotion path="M ${x1} ${y1} L ${x2} ${y2}" dur="0.8s" begin="0.4s" repeatCount="indefinite" />
        </circle>

        <!-- Solder Pad -->
        <circle id="${id}_pad_outer" cx="${x1}" cy="${y1}" r="9" fill="var(--bg-surface)" stroke-width="2" class="smooth-transition" />
        <circle id="${id}_pad_inner" cx="${x1}" cy="${y1}" r="4.5" class="smooth-transition" />
        <circle id="${id}_radar" cx="${x1}" cy="${y1}" r="14" fill="none" stroke="var(--accent-primary)" class="radar-ring" style="display: none;" />

        <!-- Labels -->
        <text x="${x1 - 18}" y="${y1 - 4}" fill="var(--text-primary)" font-family="var(--font-mono)" font-size="13" font-weight="700" text-anchor="end">${label}</text>
        <text id="${id}_volt_text" x="${x1 - 18}" y="${y1 + 12}" font-family="var(--font-mono)" font-size="10" font-weight="600" text-anchor="end" class="smooth-transition"></text>
      </g>
    `;

    // Input Wires
    if (isSingleInput) {
      svg += createWireMarkup('wire_a', startX, centerY, gateLeftX, centerY, 'IN A');
    } else {
      svg += createWireMarkup('wire_a', startX, topY, gateLeftX, topY, 'IN A');
      svg += createWireMarkup('wire_b', startX, botY, gateLeftX, botY, 'IN B');
    }

    // Output Wire
    svg += `
      <g id="conduit_out">
        <line x1="${gateExitX}" y1="${centerY}" x2="${outX}" y2="${centerY}"
              stroke="var(--bg-surface-elevated)" stroke-width="10" stroke-linecap="round" />
        <line x1="${gateExitX}" y1="${centerY}" x2="${outX}" y2="${centerY}"
              stroke="var(--border-medium)" stroke-width="10" stroke-linecap="round" opacity="0.35" />

        <line id="wire_out_core" x1="${gateExitX}" y1="${centerY}" x2="${outX}" y2="${centerY}"
              stroke-linecap="round" class="smooth-transition" />
        <line id="wire_out_laser" x1="${gateExitX}" y1="${centerY}" x2="${outX}" y2="${centerY}"
              stroke-linecap="round" class="smooth-transition" />

        <circle id="wire_out_photon1" r="5" class="smooth-transition">
          <animateMotion path="M ${gateExitX} ${centerY} L ${outX} ${centerY}" dur="0.75s" repeatCount="indefinite" />
        </circle>
        <circle id="wire_out_photon2" r="3.2" fill="#ffffff" class="smooth-transition">
          <animateMotion path="M ${gateExitX} ${centerY} L ${outX} ${centerY}" dur="0.75s" begin="0.37s" repeatCount="indefinite" />
        </circle>

        <circle id="wire_out_pad_outer" cx="${outX}" cy="${centerY}" r="11" fill="var(--bg-surface)" stroke-width="2.2" class="smooth-transition" />
        <circle id="wire_out_pad_inner" cx="${outX}" cy="${centerY}" r="5.5" class="smooth-transition" />
        <circle id="wire_out_radar" cx="${outX}" cy="${centerY}" r="16" fill="none" stroke="var(--accent-primary)" class="radar-ring" style="display: none;" />

        <text x="${outX + 22}" y="${centerY - 4}" fill="var(--text-primary)" font-family="var(--font-mono)" font-size="14" font-weight="700">OUT Y</text>
        <text id="wire_out_volt_text" x="${outX + 22}" y="${centerY + 14}" font-family="var(--font-mono)" font-size="11" font-weight="600" class="smooth-transition"></text>
      </g>
    `;

    // Gate Body
    svg += this.getEnhancedGateSvg(gateId, gateLeftX, isSingleInput, accentColor);

    this.svgContainer.innerHTML = svg;
    this.updateExistingSvgState(gateId, inputA, inputB, outputY);
  }

  updateExistingSvgState(gateId, inputA, inputB, outputY) {
    const gate = window.LOGIC_GATES[gateId];
    if (!gate) return;
    const isSingleInput = (gate.inputs === 1);

    const updateWire = (id, val) => {
      const isHigh = (val === 1);
      const core = document.getElementById(`${id}_core`);
      const laser = document.getElementById(`${id}_laser`);
      const photon1 = document.getElementById(`${id}_photon1`);
      const photon2 = document.getElementById(`${id}_photon2`);
      const padOuter = document.getElementById(`${id}_pad_outer`);
      const padInner = document.getElementById(`${id}_pad_inner`);
      const radar = document.getElementById(`${id}_radar`);
      const voltText = document.getElementById(`${id}_volt_text`);

      if (core) {
        core.setAttribute('stroke', isHigh ? 'url(#activeBeam)' : 'url(#idleBeam)');
        core.setAttribute('stroke-width', isHigh ? '4.5' : '3');
        core.setAttribute('filter', isHigh ? 'url(#energy-glow)' : 'none');
      }

      if (laser) {
        laser.setAttribute('stroke', isHigh ? '#ffffff' : 'var(--text-tertiary)');
        laser.setAttribute('stroke-width', isHigh ? '2.5' : '1.5');
        laser.className.baseVal = isHigh ? 'laser-stream-active smooth-transition' : 'laser-stream-idle smooth-transition';
        laser.style.opacity = isHigh ? '0.95' : '0.35';
      }

      if (photon1) {
        photon1.setAttribute('fill', isHigh ? '#00f2fe' : 'var(--text-tertiary)');
        photon1.setAttribute('filter', isHigh ? 'url(#energy-glow)' : 'none');
        photon1.style.opacity = isHigh ? '1' : '0.4';
      }

      if (photon2) {
        photon2.style.opacity = isHigh ? '0.95' : '0.35';
      }

      if (padOuter) {
        padOuter.setAttribute('stroke', isHigh ? 'var(--accent-primary)' : 'var(--border-medium)');
      }

      if (padInner) {
        padInner.setAttribute('fill', isHigh ? 'var(--accent-primary)' : 'var(--wire-off)');
        padInner.setAttribute('filter', isHigh ? 'url(#energy-glow)' : 'none');
      }

      if (radar) {
        radar.style.display = isHigh ? 'inline' : 'none';
      }

      if (voltText) {
        voltText.textContent = isHigh ? '+5.0V (HIGH)' : '0.0V (LOW)';
        voltText.setAttribute('fill', isHigh ? 'var(--accent-primary)' : 'var(--text-tertiary)');
      }
    };

    // Update Input A
    updateWire('wire_a', inputA);

    // Update Input B if dual input
    if (!isSingleInput) {
      updateWire('wire_b', inputB);
    }

    // Update Output Wire
    updateWire('wire_out', outputY);

    // Update Gate Internal Micro-Core
    const coreChip = document.getElementById('gate_core_chip');
    const outBubble = document.getElementById('gate_inversion_bubble');
    const internalTraceA = document.getElementById('gate_trace_a');
    const internalTraceB = document.getElementById('gate_trace_b');

    const isOutHigh = (outputY === 1);

    if (coreChip) {
      coreChip.setAttribute('fill', isOutHigh ? 'var(--accent-primary-glow)' : 'var(--bg-surface-elevated)');
      coreChip.setAttribute('stroke', isOutHigh ? gate.color : 'var(--border-medium)');
      coreChip.setAttribute('filter', isOutHigh ? 'url(#energy-glow)' : 'none');
    }

    if (outBubble) {
      outBubble.setAttribute('fill', isOutHigh ? 'var(--accent-primary)' : 'var(--gate-symbol-fill)');
      outBubble.setAttribute('filter', isOutHigh ? 'url(#energy-glow)' : 'none');
    }

    if (internalTraceA) {
      internalTraceA.setAttribute('stroke', inputA === 1 ? 'var(--accent-primary)' : 'var(--border-subtle)');
      internalTraceA.style.opacity = inputA === 1 ? '0.9' : '0.3';
    }

    if (internalTraceB) {
      internalTraceB.setAttribute('stroke', inputB === 1 ? 'var(--accent-primary)' : 'var(--border-subtle)');
      internalTraceB.style.opacity = inputB === 1 ? '0.9' : '0.3';
    }
  }

  getEnhancedGateSvg(gateId, x, isSingleInput, color) {
    const strokeWidth = 3.5;
    const bodyFill = 'var(--gate-symbol-fill)';

    let internalTraces = '';
    if (isSingleInput) {
      internalTraces = `
        <line id="gate_trace_a" x1="${x}" y1="120" x2="${x + 55}" y2="120"
              stroke-width="2" stroke-dasharray="3 3" class="smooth-transition" />
      `;
    } else {
      internalTraces = `
        <path id="gate_trace_a" d="M ${x} 75 Q ${x + 40} 75 ${x + 60} 110"
              fill="none" stroke-width="2" stroke-dasharray="3 3" class="smooth-transition" />
        <path id="gate_trace_b" d="M ${x} 165 Q ${x + 40} 165 ${x + 60} 130"
              fill="none" stroke-width="2" stroke-dasharray="3 3" class="smooth-transition" />
      `;
    }

    switch (gateId) {
      case 'AND':
        return `
          <path d="M ${x} 50 L ${x + 65} 50 A 70 70 0 0 1 ${x + 65} 190 L ${x} 190 Z"
                fill="${bodyFill}" stroke="${color}" stroke-width="${strokeWidth}"
                filter="url(#card-shadow)" class="smooth-transition" />
          ${internalTraces}
          <rect id="gate_core_chip" x="${x + 36}" y="102" width="36" height="36" rx="6"
                stroke-width="1.8" class="smooth-transition" />
          <text x="${x + 54}" y="125" fill="${color}" font-family="var(--font-mono)" font-size="18" font-weight="800" text-anchor="middle">&amp;</text>
        `;

      case 'OR':
        return `
          <path d="M ${x} 50 Q ${x + 45} 120 ${x} 190 Q ${x + 85} 185 ${x + 140} 120 Q ${x + 85} 55 ${x} 50 Z"
                fill="${bodyFill}" stroke="${color}" stroke-width="${strokeWidth}"
                filter="url(#card-shadow)" class="smooth-transition" />
          ${internalTraces}
          <rect id="gate_core_chip" x="${x + 48}" y="102" width="38" height="36" rx="6"
                stroke-width="1.8" class="smooth-transition" />
          <text x="${x + 67}" y="125" fill="${color}" font-family="var(--font-mono)" font-size="16" font-weight="800" text-anchor="middle">≥1</text>
        `;

      case 'NOT':
        return `
          <polygon points="${x},50 ${x + 105},120 ${x},190"
                   fill="${bodyFill}" stroke="${color}" stroke-width="${strokeWidth}"
                   filter="url(#card-shadow)" class="smooth-transition" />
          ${internalTraces}
          <circle id="gate_inversion_bubble" cx="${x + 115}" cy="120" r="10"
                  stroke="${color}" stroke-width="${strokeWidth}" class="smooth-transition" />
          <rect id="gate_core_chip" x="${x + 32}" y="103" width="32" height="34" rx="5"
                stroke-width="1.8" class="smooth-transition" />
          <text x="${x + 48}" y="125" fill="${color}" font-family="var(--font-mono)" font-size="16" font-weight="800" text-anchor="middle">1</text>
        `;

      case 'NAND':
        return `
          <path d="M ${x} 50 L ${x + 65} 50 A 70 70 0 0 1 ${x + 65} 190 L ${x} 190 Z"
                fill="${bodyFill}" stroke="${color}" stroke-width="${strokeWidth}"
                filter="url(#card-shadow)" class="smooth-transition" />
          ${internalTraces}
          <circle id="gate_inversion_bubble" cx="${x + 145}" cy="120" r="10"
                  stroke="${color}" stroke-width="${strokeWidth}" class="smooth-transition" />
          <rect id="gate_core_chip" x="${x + 36}" y="102" width="36" height="36" rx="6"
                stroke-width="1.8" class="smooth-transition" />
          <text x="${x + 54}" y="125" fill="${color}" font-family="var(--font-mono)" font-size="16" font-weight="800" text-anchor="middle">NAND</text>
        `;

      case 'NOR':
        return `
          <path d="M ${x} 50 Q ${x + 45} 120 ${x} 190 Q ${x + 85} 185 ${x + 140} 120 Q ${x + 85} 55 ${x} 50 Z"
                fill="${bodyFill}" stroke="${color}" stroke-width="${strokeWidth}"
                filter="url(#card-shadow)" class="smooth-transition" />
          ${internalTraces}
          <circle id="gate_inversion_bubble" cx="${x + 150}" cy="120" r="10"
                  stroke="${color}" stroke-width="${strokeWidth}" class="smooth-transition" />
          <rect id="gate_core_chip" x="${x + 48}" y="102" width="38" height="36" rx="6"
                stroke-width="1.8" class="smooth-transition" />
          <text x="${x + 67}" y="125" fill="${color}" font-family="var(--font-mono)" font-size="15" font-weight="800" text-anchor="middle">NOR</text>
        `;

      case 'XOR':
        return `
          <path d="M ${x - 14} 50 Q ${x + 28} 120 ${x - 14} 190"
                fill="none" stroke="${color}" stroke-width="${strokeWidth}" class="smooth-transition" />
          <path d="M ${x} 50 Q ${x + 45} 120 ${x} 190 Q ${x + 85} 185 ${x + 140} 120 Q ${x + 85} 55 ${x} 50 Z"
                fill="${bodyFill}" stroke="${color}" stroke-width="${strokeWidth}"
                filter="url(#card-shadow)" class="smooth-transition" />
          ${internalTraces}
          <rect id="gate_core_chip" x="${x + 48}" y="102" width="38" height="36" rx="6"
                stroke-width="1.8" class="smooth-transition" />
          <text x="${x + 67}" y="125" fill="${color}" font-family="var(--font-mono)" font-size="16" font-weight="800" text-anchor="middle">=1</text>
        `;

      case 'XNOR':
        return `
          <path d="M ${x - 14} 50 Q ${x + 28} 120 ${x - 14} 190"
                fill="none" stroke="${color}" stroke-width="${strokeWidth}" class="smooth-transition" />
          <path d="M ${x} 50 Q ${x + 45} 120 ${x} 190 Q ${x + 85} 185 ${x + 140} 120 Q ${x + 85} 55 ${x} 50 Z"
                fill="${bodyFill}" stroke="${color}" stroke-width="${strokeWidth}"
                filter="url(#card-shadow)" class="smooth-transition" />
          ${internalTraces}
          <circle id="gate_inversion_bubble" cx="${x + 150}" cy="120" r="10"
                  stroke="${color}" stroke-width="${strokeWidth}" class="smooth-transition" />
          <rect id="gate_core_chip" x="${x + 48}" y="102" width="38" height="36" rx="6"
                stroke-width="1.8" class="smooth-transition" />
          <text x="${x + 67}" y="125" fill="${color}" font-family="var(--font-mono)" font-size="15" font-weight="800" text-anchor="middle">XNOR</text>
        `;

      case 'BUFFER':
        return `
          <polygon points="${x},50 ${x + 115},120 ${x},190"
                   fill="${bodyFill}" stroke="${color}" stroke-width="${strokeWidth}"
                   filter="url(#card-shadow)" class="smooth-transition" />
          ${internalTraces}
          <rect id="gate_core_chip" x="${x + 36}" y="103" width="32" height="34" rx="5"
                stroke-width="1.8" class="smooth-transition" />
          <text x="${x + 52}" y="125" fill="${color}" font-family="var(--font-mono)" font-size="16" font-weight="800" text-anchor="middle">1</text>
        `;

      default:
        return '';
    }
  }
}

window.CircuitRenderer = CircuitRenderer;
