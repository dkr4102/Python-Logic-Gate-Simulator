# LogicGate Studio - Digital Logic Simulator & Architecture Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.8+](https://img.shields.io/badge/Python-3.8+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Desktop-10b981.svg)]()
[![Audio](https://img.shields.io/badge/Audio-Procedural%20Web%20Audio-8b5cf6.svg)]()
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-black?logo=vercel&logoColor=white)](https://logicgate-studio.vercel.app)
[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages%20Ready-38bdf8.svg)]()

> Designed & Engineered by **[Darsh K. Raval (dkr4102)](https://github.com/dkr4102)**

🌐 **Live Production Web Studio**: **[https://logicgate-studio.vercel.app](https://logicgate-studio.vercel.app)**

A next-generation digital logic gate simulation and computer architecture learning suite. Features a minimalist **Web Studio** with Light and Dark themes, Lucide icons, multi-layered glowing electrical conduits with flowing electron animations, real-time waveform logic analyzer, interactive truth tables, and compound circuit sandbox — alongside a completely bug-fixed, modernized **Python Tkinter Desktop Application**.

---

## Key Highlights & Features

### 1. Minimalist Studio Architecture (Light & Dark Modes)
- **Zero Emojis**: Clean, professional Lucide SVG icons throughout the entire application.
- **Light Theme**: Nordic clean aesthetic with pure white surfaces, high-contrast typography, crisp borders, and subtle natural shadows.
- **Dark Theme**: OLED obsidian backdrop (`#080c14`), deep slate panels (`#0f172a`), neon electric conduits (`#00f2fe` and `#10b981`).
- Seamless 1-click theme toggle with persistent storage in `localStorage`.

### 2. Dynamic Electrical Flow & Multi-Layered Circuit Traces
- **Conduit Tracks**: Multi-layered PCB channels with metallic solder pads, voltage telemetry (`+5.0V` / `0.0V`), and pin designations.
- **Luminous Energy Core**: High-bloom neon electrical streams illuminating active lines.
- **Animated Laser Dashes**: High-frequency pulsing dashes running continuously along conducting wires.
- **Flowing Electron Photons**: Physical light packet beads that glide along the wire tracks from input terminals into the gate and toward the output.
- **Internal Silicon Logic Core**: Internal converging micro-circuit traces and an illuminated central logic die inside the gate symbol.
- **Output Corona & Sparks**: Radial ripple rings and spark bursts when the output switches to HIGH.

### 3. Procedural Web Audio API Sound Engine
- **100% Zero external audio files** — fully synthesized procedurally in real-time.
- Tactile mechanical switch click on input toggling.
- High-logic ping (523 Hz) vs low-logic click (220 Hz).
- Tri-tone harmonic chord celebration on output HIGH transition.
- Distinct audio chimes on Light/Dark theme toggle.
- Persistent mute/unmute control (`localStorage` and keyboard shortcut `M`).

### 4. Real-Time Digital Logic Analyzer (Oscilloscope)
- Docked 3-channel digital square wave monitor (Channel 1: Input A, Channel 2: Input B, Channel 3: Output Y).
- Built-in **Auto-Clock Generator** (0.5 Hz, 1.0 Hz, 2.0 Hz, 4.0 Hz) to observe dynamic clock cycles and digital logic timing automatically.

### 5. Interactive Truth Tables & Silicon Specs
- Real-time row illumination highlighting the active input combination.
- Click any row in the truth table to instantly set the circuit inputs to that state.
- Commercial TTL/CMOS IC chip references (7408, 7432, 7404, 7400, 7402, 7486, 74266, 7407) with propagation delays and transistor counts.

### 6. Compound Digital Circuit Lab
Interactive simulation of multi-gate digital subsystems:
- **Half Adder**: 1-bit binary addition using XOR (Sum) and AND (Carry).
- **Full Adder**: Complete 3-input binary adder with Carry-In and Carry-Out.
- **SR Latch (Flip-Flop)**: Cross-coupled NOR gates showing 1-bit digital storage and memory state retention.
- **2-to-1 Multiplexer (MUX)**: Data selector routing between two data channels using a control select line.

---

## Supported Logic Gates & Mathematical Models

| Gate | Function | Formula | Boolean Expression | Standard IC |
| :--- | :--- | :--- | :--- | :--- |
| **AND** | Conjunction | $Y = A \cdot B$ | `Y = A AND B` | 7408 |
| **OR** | Disjunction | $Y = A + B$ | `Y = A OR B` | 7432 |
| **NOT** | Inversion | $Y = \bar{A}$ | `Y = NOT A` | 7404 |
| **NAND** | Universal Negation | $Y = (A \cdot B)'$ | `Y = NOT (A AND B)` | 7400 |
| **NOR** | Universal Joint Denial | $Y = (A + B)'$ | `Y = NOT (A OR B)` | 7402 |
| **XOR** | Exclusive OR | $Y = A \oplus B$ | `Y = (A · B') + (A' · B)` | 7486 |
| **XNOR** | Equivalence | $Y = (A \oplus B)'$ | `Y = (A · B) + (A' · B')` | 74266 |
| **BUFFER** | Driver / Amplifier | $Y = A$ | `Y = A` | 7407 |

---

## Resolved Legacy Python Bugs

1. **Hardcoded OneDrive Path Crashes**: Replaced broken absolute paths (`C:\Users\darsh\OneDrive...`) in `and_gate.py`, `or_gate.py`, and `not_gate.py` with dynamic relative path resolution (`os.path.dirname(__file__)`).
2. **Fixed Screen Resolution Coordinate Bug**: Replaced hardcoded pixel placements (`place(x=1250, y=300)`) with responsive, centered layouts ensuring the application renders cleanly across any monitor resolution.
3. **Tkinter Multi-Root Crash**: Eliminated destructive `root.destroy()` cycles that caused window focus glitches and memory leaks.
4. **Typo & Dead Code Cleanup**: Corrected "Project Definetion" to "Project Definition" and removed broken dummy methods.
5. **Asset Restoration**: Recovered missing schematic PNG assets into `assets/` and provided dynamic vector fallbacks.

---

## Getting Started

### Option 1: Launch the Modern Web Simulator (Zero Setup)
Simply open `index.html` in any modern web browser, or launch a local server:
```powershell
python -m http.server 8080
```
Then navigate to: `http://localhost:8080`

#### GitHub Pages Deployment (Free 1-Click Hosting)
1. Go to your GitHub repository: **Settings > Pages**
2. Under **Build and deployment > Source**, select **Deploy from a branch**
3. Select branch `main` and folder `/ (root)`
4. Click **Save** — your simulator is now live worldwide!

---

### Option 2: Run the Python Desktop Application
1. Install dependencies:
```powershell
pip install -r requirements.txt
```

2. Launch the Main Dashboard:
```powershell
python firstpage.py
```

3. Launch the All-In-One Modern Pro Simulator:
```powershell
python python_app/simulator.py
```

---

## Keyboard Shortcuts (Web App)

| Key | Action |
| :--- | :--- |
| <kbd>A</kbd> | Toggle Input A (0 ↔ 1) |
| <kbd>B</kbd> | Toggle Input B (0 ↔ 1) |
| <kbd>1</kbd> - <kbd>8</kbd> | Switch Gate (1=AND, 2=OR, 3=NOT, 4=NAND, etc.) |
| <kbd>C</kbd> | Start / Stop Auto-Clock Oscillator |
| <kbd>T</kbd> | Toggle Light / Dark Theme |
| <kbd>M</kbd> | Mute / Unmute Procedural Audio |

---

## Project Architecture

```
Python-Logic-Gate-Simulator/
├── index.html                   # Modern Web Simulator entry point
├── css/
│   ├── main.css                 # Core design tokens, layout, typography, Lucide icons
│   ├── themes.css               # Light and Dark theme specifications
│   └── components.css           # Tactile switches, truth tables, docked oscilloscope
├── js/
│   ├── app.js                   # Application controller & keyboard shortcuts
│   ├── audio.js                 # Procedural Web Audio API sound synthesizer
│   ├── gates.js                 # Digital logic math, truth tables, IC specifications
│   ├── canvas-circuit.js        # Multi-layer conduits, traveling photons, SVG schematics
│   ├── waveform.js              # Real-time oscilloscope logic analyzer canvas
│   ├── circuit-builder.js       # Compound circuits (Half Adder, Full Adder, Latch, MUX)
│   └── themes.js                # Light/Dark theme manager
├── assets/                      # Circuit schematic images
│   ├── and_gate.png
│   ├── or_gate.png
│   └── not_gate.png
├── python_app/
│   └── simulator.py             # All-in-one multi-gate Python desktop application
├── and_gate.py                  # Standalone AND gate simulator (Fixed & responsive)
├── or_gate.py                   # Standalone OR gate simulator (Fixed & responsive)
├── not_gate.py                  # Standalone NOT gate simulator (Fixed & responsive)
├── firstpage.py                 # Desktop application entry dashboard
├── requirements.txt             # Python dependencies (Pillow)
├── LICENSE                      # MIT License
└── README.md                    # Project documentation
```

---

## Author & Credits
- **Darsh K. Raval** — [GitHub Profile (@dkr4102)](https://github.com/dkr4102)
- Computer Science & Engineering (AI & ML)
