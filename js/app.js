/**
 * ============================================================================
 * MAIN APPLICATION CONTROLLER
 * Precision orchestrator for logic gates, waveforms, sounds, and Lucide icons
 * ============================================================================
 */

class LogicSimulatorApp {
  constructor() {
    this.currentGateId = 'AND';
    this.inputA = 0;
    this.inputB = 0;
    this.outputY = 0;
    this.activeMode = 'simulator'; // 'simulator' or 'circuits'

    // Compound circuit state
    this.activeCircuitId = 'half_adder';
    this.circuitInputs = { a: 1, b: 1 };

    // Initialize subsystems
    this.themeMgr = new window.ThemeManager();
    this.circuitRenderer = new window.CircuitRenderer('circuitSvg', 'sparkCanvas');
    this.waveformVis = new window.WaveformVisualizer('waveformCanvas');

    this.initElements();
    this.bindEvents();
    this.selectGate('AND');

    // Initial Lucide icons render
    this.renderIcons();
  }

  renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  initElements() {
    // Gate info
    this.gateTitleEl = document.getElementById('gateTitle');
    this.gateDescEl = document.getElementById('gateDescription');
    this.booleanExprEl = document.getElementById('booleanExpr');
    this.icChipNameEl = document.getElementById('icChipName');
    this.propDelayEl = document.getElementById('propDelay');
    this.transistorCountEl = document.getElementById('transistorCount');

    // Controls
    this.switchA = document.getElementById('switchA');
    this.switchB = document.getElementById('switchB');
    this.switchBWrapper = document.getElementById('switchBWrapper');
    this.handleA = document.getElementById('handleA');
    this.handleB = document.getElementById('handleB');
    this.labelStateA = document.getElementById('labelStateA');
    this.labelStateB = document.getElementById('labelStateB');

    // Output
    this.outputIndicatorBox = document.getElementById('outputIndicatorBox');
    this.outputValEl = document.getElementById('outputVal');
    this.outputStateText = document.getElementById('outputStateText');

    // Truth table
    this.truthTableBody = document.getElementById('truthTableBody');

    // Audio & clock
    this.muteBtn = document.getElementById('soundToggleBtn');
    this.soundIcon = document.getElementById('soundIcon');
    this.soundLabel = document.getElementById('soundLabel');
    this.clockBtn = document.getElementById('autoClockBtn');
    this.clockIcon = document.getElementById('clockIcon');
    this.clockBtnLabel = document.getElementById('clockBtnLabel');

    // Navigation
    this.simModePill = document.getElementById('modeSimulator');
    this.circuitsModePill = document.getElementById('modeCircuits');
    this.simulatorWorkspace = document.getElementById('simulatorWorkspace');
    this.circuitLabPanel = document.getElementById('circuitLabPanel');

    // Update initial audio button state
    this.updateSoundButtonState();
  }

  updateSoundButtonState() {
    if (!this.muteBtn || !window.soundEngine) return;
    const isMuted = window.soundEngine.isMuted;
    if (isMuted) {
      this.muteBtn.classList.remove('active');
      this.muteBtn.innerHTML = `<i data-lucide="volume-x" class="lucide-icon"></i><span>Muted</span>`;
      this.muteBtn.title = 'Unmute Audio (Press M)';
    } else {
      this.muteBtn.classList.add('active');
      this.muteBtn.innerHTML = `<i data-lucide="volume-2" class="lucide-icon"></i><span>Audio</span>`;
      this.muteBtn.title = 'Mute Audio (Press M)';
    }
    this.renderIcons();
  }

  bindEvents() {
    // 1. Switch A
    if (this.switchA) {
      this.switchA.addEventListener('click', () => {
        this.setInputA(1 - this.inputA);
      });
    }

    // 2. Switch B
    if (this.switchB) {
      this.switchB.addEventListener('click', () => {
        this.setInputB(1 - this.inputB);
      });
    }

    // 3. Gate Selector Tabs
    const gateButtons = document.querySelectorAll('.gate-tab-btn');
    gateButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const gid = btn.dataset.gate;
        if (gid) this.selectGate(gid);
      });
    });

    // 4. Workspace Mode Switching
    if (this.simModePill && this.circuitsModePill) {
      this.simModePill.addEventListener('click', () => this.switchMode('simulator'));
      this.circuitsModePill.addEventListener('click', () => this.switchMode('circuits'));
    }

    // 5. Sound Mute Toggle
    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        this.updateSoundButtonState();
        if (!isMuted) window.soundEngine.playClick();
      });
    }

    // 6. Auto Clock
    if (this.clockBtn) {
      this.clockBtn.addEventListener('click', () => {
        const isRunning = this.waveformVis.toggleAutoClock((a, b) => {
          this.inputA = a;
          this.inputB = b;
          this.evaluateCircuit(false);
        });

        if (isRunning) {
          this.clockBtn.classList.add('active');
          this.clockBtn.innerHTML = `<i data-lucide="square" class="lucide-icon icon-sm"></i><span>Stop</span>`;
        } else {
          this.clockBtn.classList.remove('active');
          this.clockBtn.innerHTML = `<i data-lucide="play" class="lucide-icon icon-sm"></i><span>Auto Clock</span>`;
        }
        this.renderIcons();
      });
    }

    // Clock speed dropdown
    const clockHzSelect = document.getElementById('clockHzSelect');
    if (clockHzSelect) {
      clockHzSelect.addEventListener('change', (e) => {
        const hz = parseFloat(e.target.value) || 1;
        this.waveformVis.setClockHz(hz, (a, b) => {
          this.inputA = a;
          this.inputB = b;
          this.evaluateCircuit(false);
        });
      });
    }

    // 7. Compound Circuit Lab Tabs
    const labTabs = document.querySelectorAll('.lab-tab-btn');
    labTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        labTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.selectCompoundCircuit(tab.dataset.circuit);
      });
    });

    // 8. Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      const key = e.key.toUpperCase();
      if (key === 'A') {
        this.setInputA(1 - this.inputA);
      } else if (key === 'B' && this.currentGateId !== 'NOT' && this.currentGateId !== 'BUFFER') {
        this.setInputB(1 - this.inputB);
      } else if (key === 'M') {
        if (this.muteBtn) this.muteBtn.click();
      } else if (key === 'C') {
        if (this.clockBtn) this.clockBtn.click();
      } else if (key === 'T') {
        if (this.themeMgr) this.themeMgr.toggleTheme();
      } else if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(key)) {
        const gateKeys = Object.keys(window.LOGIC_GATES);
        const idx = parseInt(key, 10) - 1;
        if (gateKeys[idx]) this.selectGate(gateKeys[idx]);
      }
    });
  }

  switchMode(mode) {
    this.activeMode = mode;
    if (mode === 'simulator') {
      this.simModePill.classList.add('active');
      this.circuitsModePill.classList.remove('active');
      this.simulatorWorkspace.style.display = 'grid';
      this.circuitLabPanel.classList.remove('active');
    } else {
      this.simModePill.classList.remove('active');
      this.circuitsModePill.classList.add('active');
      this.simulatorWorkspace.style.display = 'none';
      this.circuitLabPanel.classList.add('active');
      this.selectCompoundCircuit(this.activeCircuitId);
    }
    if (window.soundEngine) window.soundEngine.playClick();
    this.renderIcons();
  }

  selectGate(gateId) {
    if (!window.LOGIC_GATES[gateId]) return;
    this.currentGateId = gateId;
    const gate = window.LOGIC_GATES[gateId];

    // Update active tab styling
    const gateButtons = document.querySelectorAll('.gate-tab-btn');
    gateButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.gate === gateId);
    });

    // Update Meta texts
    if (this.gateTitleEl) this.gateTitleEl.textContent = gate.name;
    if (this.gateDescEl) this.gateDescEl.textContent = gate.description;
    if (this.booleanExprEl) this.booleanExprEl.textContent = gate.formula;
    if (this.icChipNameEl) this.icChipNameEl.textContent = gate.icChip;
    if (this.propDelayEl) this.propDelayEl.textContent = gate.propagationDelay;
    if (this.transistorCountEl) this.transistorCountEl.textContent = gate.transistorCount;

    // Show/hide Input B for single-input gates (NOT, BUFFER)
    if (gate.inputs === 1) {
      if (this.switchBWrapper) this.switchBWrapper.style.display = 'none';
    } else {
      if (this.switchBWrapper) this.switchBWrapper.style.display = 'flex';
    }

    // Rebuild Truth Table
    this.renderTruthTable(gate);

    // Audio click
    if (window.soundEngine) window.soundEngine.playClick();

    // Re-evaluate circuit logic
    this.evaluateCircuit(false);
  }

  setInputA(val) {
    this.inputA = val;
    if (window.soundEngine) {
      window.soundEngine.playClick();
      window.soundEngine.playStateChange(val === 1);
    }
    this.evaluateCircuit(true);
  }

  setInputB(val) {
    this.inputB = val;
    if (window.soundEngine) {
      window.soundEngine.playClick();
      window.soundEngine.playStateChange(val === 1);
    }
    this.evaluateCircuit(true);
  }

  evaluateCircuit(interactive = true) {
    const gate = window.LOGIC_GATES[this.currentGateId];
    if (!gate) return;

    const prevOutput = this.outputY;
    this.outputY = gate.logicFn(this.inputA, this.inputB);

    // Update Switch A
    if (this.switchA) {
      this.switchA.classList.toggle('active', this.inputA === 1);
      if (this.handleA) this.handleA.textContent = String(this.inputA);
      if (this.labelStateA) this.labelStateA.textContent = this.inputA === 1 ? 'HIGH (1)' : 'LOW (0)';
    }

    // Update Switch B
    if (this.switchB) {
      this.switchB.classList.toggle('active', this.inputB === 1);
      if (this.handleB) this.handleB.textContent = String(this.inputB);
      if (this.labelStateB) this.labelStateB.textContent = this.inputB === 1 ? 'HIGH (1)' : 'LOW (0)';
    }

    // Update Output Display
    if (this.outputIndicatorBox) {
      this.outputIndicatorBox.classList.toggle('high', this.outputY === 1);
    }
    if (this.outputValEl) {
      this.outputValEl.textContent = String(this.outputY);
    }
    if (this.outputStateText) {
      this.outputStateText.textContent = this.outputY === 1 ? 'HIGH (1)' : 'LOW (0)';
      this.outputStateText.style.color = this.outputY === 1 ? 'var(--accent-primary)' : 'var(--text-tertiary)';
    }

    // Success sound on 0 -> 1 transition
    if (interactive && prevOutput === 0 && this.outputY === 1) {
      if (window.soundEngine) window.soundEngine.playOutputSuccess();
    }

    // Render SVG circuit
    this.circuitRenderer.render(this.currentGateId, this.inputA, this.inputB, this.outputY);

    // Update Waveform Visualizer
    this.waveformVis.updateSignal(this.inputA, this.inputB, this.outputY);

    // Highlight Truth Table row
    this.highlightTruthTableRow();
  }

  renderTruthTable(gate) {
    if (!this.truthTableBody) return;
    this.truthTableBody.innerHTML = '';

    const isSingleInput = (gate.inputs === 1);
    const thead = document.getElementById('truthTableHead');
    if (thead) {
      if (isSingleInput) {
        thead.innerHTML = `<tr><th>A</th><th>Y</th></tr>`;
      } else {
        thead.innerHTML = `<tr><th>A</th><th>B</th><th>Y</th></tr>`;
      }
    }

    gate.truthTable.forEach(row => {
      const tr = document.createElement('tr');
      tr.dataset.a = row.a;
      if (!isSingleInput) tr.dataset.b = row.b;

      if (isSingleInput) {
        tr.innerHTML = `<td>${row.a}</td><td>${row.y}</td>`;
      } else {
        tr.innerHTML = `<td>${row.a}</td><td>${row.b}</td><td>${row.y}</td>`;
      }

      tr.addEventListener('click', () => {
        this.inputA = row.a;
        if (!isSingleInput) this.inputB = row.b;
        if (window.soundEngine) window.soundEngine.playClick();
        this.evaluateCircuit(true);
      });

      this.truthTableBody.appendChild(tr);
    });

    this.highlightTruthTableRow();
  }

  highlightTruthTableRow() {
    if (!this.truthTableBody) return;
    const gate = window.LOGIC_GATES[this.currentGateId];
    const isSingleInput = (gate.inputs === 1);

    const rows = this.truthTableBody.querySelectorAll('tr');
    rows.forEach(tr => {
      const matchA = (parseInt(tr.dataset.a, 10) === this.inputA);
      const matchB = isSingleInput || (parseInt(tr.dataset.b, 10) === this.inputB);

      if (matchA && matchB) {
        tr.classList.add('active-row');
      } else {
        tr.classList.remove('active-row');
      }
    });
  }

  onThemeChanged(theme) {
    this.circuitRenderer.render(this.currentGateId, this.inputA, this.inputB, this.outputY);
  }

  // =========================================================================
  // Compound Circuit Lab
  // =========================================================================
  selectCompoundCircuit(circuitId) {
    const circuit = window.COMPOUND_CIRCUITS[circuitId];
    if (!circuit) return;
    this.activeCircuitId = circuitId;

    this.circuitInputs = {};
    circuit.inputs.forEach(inp => {
      this.circuitInputs[inp.id] = inp.default;
    });

    this.renderCompoundCircuitUI(circuit);
  }

  renderCompoundCircuitUI(circuit) {
    const titleEl = document.getElementById('labCircuitTitle');
    const descEl = document.getElementById('labCircuitDesc');
    const controlsWrap = document.getElementById('labInputsContainer');
    const chipEl = document.getElementById('labCircuitChip');

    if (titleEl) titleEl.textContent = circuit.name;
    if (descEl) descEl.textContent = circuit.description;
    if (chipEl) chipEl.textContent = circuit.icChip;

    if (controlsWrap) {
      controlsWrap.innerHTML = '';
      circuit.inputs.forEach(inp => {
        const box = document.createElement('div');
        box.className = 'switch-control-item';
        box.innerHTML = `
          <div class="tactile-switch ${this.circuitInputs[inp.id] === 1 ? 'active' : ''}" id="lab_sw_${inp.id}">
            <div class="switch-thumb">${this.circuitInputs[inp.id]}</div>
          </div>
          <div class="switch-meta">
            <span class="switch-label">${inp.label}</span>
          </div>
        `;
        box.querySelector('.tactile-switch').addEventListener('click', () => {
          this.circuitInputs[inp.id] = 1 - this.circuitInputs[inp.id];
          if (window.soundEngine) {
            window.soundEngine.playClick();
            window.soundEngine.playStateChange(this.circuitInputs[inp.id] === 1);
          }
          this.updateCompoundCircuitOutputs(circuit);
        });
        controlsWrap.appendChild(box);
      });
    }

    this.updateCompoundCircuitOutputs(circuit);
    this.renderIcons();
  }

  updateCompoundCircuitOutputs(circuit) {
    const outputsWrap = document.getElementById('labOutputsContainer');
    const results = circuit.compute(this.circuitInputs);

    circuit.inputs.forEach(inp => {
      const sw = document.getElementById(`lab_sw_${inp.id}`);
      if (sw) {
        sw.classList.toggle('active', this.circuitInputs[inp.id] === 1);
        sw.querySelector('.switch-thumb').textContent = String(this.circuitInputs[inp.id]);
      }
    });

    if (outputsWrap) {
      outputsWrap.innerHTML = '';
      circuit.outputs.forEach(out => {
        const val = results[out.id];
        const isHigh = (val === 1);
        const box = document.createElement('div');
        box.className = 'output-node-group';
        box.innerHTML = `
          <div class="switch-meta">
            <span class="switch-label">${out.label}</span>
          </div>
          <div class="output-badge-box ${isHigh ? 'high' : ''}">
            <div class="output-status-dot"></div>
            <span class="output-value-digit">${val}</span>
          </div>
        `;
        outputsWrap.appendChild(box);
      });
    }

    this.renderCompoundSchematicSvg(circuit, results);
  }

  renderCompoundSchematicSvg(circuit, results) {
    const container = document.getElementById('labSvgContainer');
    if (!container) return;

    if (circuit.id === 'half_adder') {
      const a = this.circuitInputs.a;
      const b = this.circuitInputs.b;
      const sum = results.sum;
      const carry = results.carry;

      const getC = (v) => v === 1 ? 'var(--wire-on)' : 'var(--wire-off)';

      container.innerHTML = `
        <svg viewBox="0 0 520 200" class="circuit-svg">
          <!-- Input A Wires -->
          <line x1="40" y1="45" x2="160" y2="45" stroke="${getC(a)}" stroke-width="4" stroke-linecap="round" />
          <line x1="80" y1="45" x2="80" y2="135" stroke="${getC(a)}" stroke-width="4" />
          <line x1="80" y1="135" x2="160" y2="135" stroke="${getC(a)}" stroke-width="4" stroke-linecap="round" />
          <text x="20" y="50" fill="var(--text-secondary)" font-family="var(--font-mono)" font-size="13" font-weight="bold">A=${a}</text>

          <!-- Input B Wires -->
          <line x1="40" y1="80" x2="160" y2="80" stroke="${getC(b)}" stroke-width="4" stroke-linecap="round" />
          <line x1="110" y1="80" x2="110" y2="170" stroke="${getC(b)}" stroke-width="4" />
          <line x1="110" y1="170" x2="160" y2="170" stroke="${getC(b)}" stroke-width="4" stroke-linecap="round" />
          <text x="20" y="85" fill="var(--text-secondary)" font-family="var(--font-mono)" font-size="13" font-weight="bold">B=${b}</text>

          <!-- XOR Gate (SUM) -->
          <rect x="160" y="35" width="110" height="55" rx="6" fill="var(--bg-surface-elevated)" stroke="#8b5cf6" stroke-width="2.5" />
          <text x="215" y="68" fill="#8b5cf6" font-family="var(--font-mono)" font-size="14" font-weight="bold" text-anchor="middle">XOR (Sum)</text>
          <line x1="270" y1="62" x2="380" y2="62" stroke="${getC(sum)}" stroke-width="4" stroke-linecap="round" />
          <text x="395" y="67" fill="${getC(sum)}" font-family="var(--font-mono)" font-size="14" font-weight="bold">SUM = ${sum}</text>

          <!-- AND Gate (CARRY) -->
          <rect x="160" y="125" width="110" height="55" rx="6" fill="var(--bg-surface-elevated)" stroke="#10b981" stroke-width="2.5" />
          <text x="215" y="158" fill="#10b981" font-family="var(--font-mono)" font-size="14" font-weight="bold" text-anchor="middle">AND (Carry)</text>
          <line x1="270" y1="152" x2="380" y2="152" stroke="${getC(carry)}" stroke-width="4" stroke-linecap="round" />
          <text x="395" y="157" fill="${getC(carry)}" font-family="var(--font-mono)" font-size="14" font-weight="bold">CARRY = ${carry}</text>
        </svg>
      `;
    } else {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-secondary); font-family: var(--font-mono); padding: 30px 16px;">
          <div style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">${circuit.name}</div>
          <div style="font-size: 12px; color: var(--text-tertiary);">Interactive digital logic simulation active.</div>
        </div>
      `;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new LogicSimulatorApp();
});
