/**
 * ============================================================================
 * COMPOUND DIGITAL CIRCUITS SANDBOX
 * Half Adder, Full Adder, SR Latch, and 2-to-1 Multiplexer (MUX)
 * ============================================================================
 */

const COMPOUND_CIRCUITS = {
  half_adder: {
    id: 'half_adder',
    name: 'Half Adder (1-Bit Binary Addition)',
    description: 'Computes the addition of two single binary bits without carry-in. Consists of an XOR gate (Sum) and an AND gate (Carry).',
    inputs: [
      { id: 'a', label: 'Input A', default: 1 },
      { id: 'b', label: 'Input B', default: 1 }
    ],
    outputs: [
      { id: 'sum', label: 'Sum (S = A ⊕ B)' },
      { id: 'carry', label: 'Carry (C = A · B)' }
    ],
    compute: (vals) => {
      const a = vals.a;
      const b = vals.b;
      return {
        sum: a ^ b,
        carry: a & b
      };
    },
    truthTable: [
      { a: 0, b: 0, sum: 0, carry: 0 },
      { a: 0, b: 1, sum: 1, carry: 0 },
      { a: 1, b: 0, sum: 1, carry: 0 },
      { a: 1, b: 1, sum: 0, carry: 1 }
    ],
    icChip: '74LS283 / Discrete 7486 (XOR) + 7408 (AND)'
  },

  full_adder: {
    id: 'full_adder',
    name: 'Full Adder (Complete 1-Bit Adder with Carry-In)',
    description: 'Cascades two half adders and an OR gate to add three binary digits: Input A, Input B, and Carry-In (Cin).',
    inputs: [
      { id: 'a', label: 'Input A', default: 1 },
      { id: 'b', label: 'Input B', default: 0 },
      { id: 'cin', label: 'Carry In (Cin)', default: 1 }
    ],
    outputs: [
      { id: 'sum', label: 'Sum (S = A ⊕ B ⊕ Cin)' },
      { id: 'cout', label: 'Carry Out (Cout)' }
    ],
    compute: (vals) => {
      const a = vals.a;
      const b = vals.b;
      const cin = vals.cin;
      const sum = a ^ b ^ cin;
      const cout = (a & b) | (cin & (a ^ b));
      return { sum, cout };
    },
    truthTable: [
      { a: 0, b: 0, cin: 0, sum: 0, cout: 0 },
      { a: 0, b: 0, cin: 1, sum: 1, cout: 0 },
      { a: 0, b: 1, cin: 0, sum: 1, cout: 0 },
      { a: 0, b: 1, cin: 1, sum: 0, cout: 1 },
      { a: 1, b: 0, cin: 0, sum: 1, cout: 0 },
      { a: 1, b: 0, cin: 1, sum: 0, cout: 1 },
      { a: 1, b: 1, cin: 0, sum: 0, cout: 1 },
      { a: 1, b: 1, cin: 1, sum: 1, cout: 1 }
    ],
    icChip: '7483 / 74283 4-Bit Binary Full Adder'
  },

  sr_latch: {
    id: 'sr_latch',
    name: 'SR Latch (Bistable Memory Element)',
    description: 'A cross-coupled NOR gate digital storage cell. Capable of retaining 1 bit of memory state (Q) across clock cycles.',
    inputs: [
      { id: 's', label: 'Set (S)', default: 0 },
      { id: 'r', label: 'Reset (R)', default: 0 }
    ],
    outputs: [
      { id: 'q', label: 'State Q' },
      { id: 'q_bar', label: "State Q' (Inverted)" }
    ],
    memoryState: 0, // internal latch storage
    compute: function(vals) {
      const s = vals.s;
      const r = vals.r;

      if (s === 1 && r === 0) {
        this.memoryState = 1; // SET
      } else if (s === 0 && r === 1) {
        this.memoryState = 0; // RESET
      } else if (s === 1 && r === 1) {
        // Forbidden condition (Race hazard)
        return { q: '!', q_bar: '!' };
      }
      // If s===0 && r===0 -> Hold state
      return {
        q: this.memoryState,
        q_bar: 1 - this.memoryState
      };
    },
    truthTable: [
      { s: 0, r: 0, state: 'No Change (Memory Latch)' },
      { s: 0, r: 1, state: 'Reset (Q = 0)' },
      { s: 1, r: 0, state: 'Set (Q = 1)' },
      { s: 1, r: 1, state: 'Forbidden / Invalid State' }
    ],
    icChip: '74279 (Quad Set-Reset Latch)'
  },

  mux_2to1: {
    id: 'mux_2to1',
    name: '2-to-1 Multiplexer (Data Selector)',
    description: 'Selects one of two data inputs (D0 or D1) and routes it directly to the output based on the control Select line (S).',
    inputs: [
      { id: 'd0', label: 'Data 0 (D0)', default: 1 },
      { id: 'd1', label: 'Data 1 (D1)', default: 0 },
      { id: 'sel', label: 'Select (S)', default: 0 }
    ],
    outputs: [
      { id: 'y', label: 'Output Y' }
    ],
    compute: (vals) => {
      const y = vals.sel === 0 ? vals.d0 : vals.d1;
      return { y };
    },
    truthTable: [
      { sel: 0, d0: 'A', d1: 'B', y: 'A (Selected D0)' },
      { sel: 1, d0: 'A', d1: 'B', y: 'B (Selected D1)' }
    ],
    icChip: '74157 (Quad 2-Input Data Selector/MUX)'
  }
};

window.COMPOUND_CIRCUITS = COMPOUND_CIRCUITS;
