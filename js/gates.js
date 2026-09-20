/**
 * ============================================================================
 * DIGITAL LOGIC GATES ENGINE
 * 8 Standard Gates, Mathematical Models, Truth Tables & Silicon Specs
 * ============================================================================
 */

const LOGIC_GATES = {
  AND: {
    id: 'AND',
    name: 'AND Gate',
    inputs: 2,
    symbol: '·',
    formula: 'Y = A · B',
    booleanExpr: 'Y = A AND B',
    description: 'Output is HIGH (1) if and only if both input A and input B are HIGH (1).',
    color: '#10b981',
    accentClass: 'gate-and',
    icChip: '7408 (Quad 2-Input AND Gate)',
    technology: 'TTL / CMOS',
    propagationDelay: '7 ns',
    transistorCount: '6 Transistors (CMOS: 3 PMOS + 3 NMOS with inverter)',
    logicFn: (a, b = 0) => (a & b),
    truthTable: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 0 },
      { a: 1, b: 0, y: 0 },
      { a: 1, b: 1, y: 1 }
    ]
  },

  OR: {
    id: 'OR',
    name: 'OR Gate',
    inputs: 2,
    symbol: '+',
    formula: 'Y = A + B',
    booleanExpr: 'Y = A OR B',
    description: 'Output is HIGH (1) if at least one input (A or B) is HIGH (1).',
    color: '#38bdf8',
    accentClass: 'gate-or',
    icChip: '7432 (Quad 2-Input OR Gate)',
    technology: 'TTL / CMOS',
    propagationDelay: '9 ns',
    transistorCount: '6 Transistors (Parallel PMOS + Series NMOS followed by NOT)',
    logicFn: (a, b = 0) => (a | b),
    truthTable: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 1 }
    ]
  },

  NOT: {
    id: 'NOT',
    name: 'NOT Gate (Inverter)',
    inputs: 1,
    symbol: 'Ā',
    formula: 'Y = Ā',
    booleanExpr: 'Y = NOT A',
    description: 'Inverts the logical state: a HIGH (1) becomes LOW (0), and a LOW (0) becomes HIGH (1).',
    color: '#f43f5e',
    accentClass: 'gate-not',
    icChip: '7404 (Hex Inverter)',
    technology: 'TTL / CMOS',
    propagationDelay: '5 ns',
    transistorCount: '2 Transistors (1 PMOS Pull-Up + 1 NMOS Pull-Down)',
    logicFn: (a, b = 0) => (1 - a),
    truthTable: [
      { a: 0, y: 1 },
      { a: 1, y: 0 }
    ]
  },

  NAND: {
    id: 'NAND',
    name: 'NAND Gate',
    inputs: 2,
    symbol: '(A·B)\'',
    formula: 'Y = (A · B)\'',
    booleanExpr: 'Y = NOT (A AND B)',
    description: 'Universal Gate. Output is LOW (0) only when both inputs are HIGH (1); otherwise HIGH.',
    color: '#f59e0b',
    accentClass: 'gate-nand',
    icChip: '7400 (Quad 2-Input NAND Gate)',
    technology: 'TTL / CMOS',
    propagationDelay: '6 ns',
    transistorCount: '4 Transistors (Native CMOS primitive cell)',
    logicFn: (a, b = 0) => (1 - (a & b)),
    truthTable: [
      { a: 0, b: 0, y: 1 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 0 }
    ]
  },

  NOR: {
    id: 'NOR',
    name: 'NOR Gate',
    inputs: 2,
    symbol: '(A+B)\'',
    formula: 'Y = (A + B)\'',
    booleanExpr: 'Y = NOT (A OR B)',
    description: 'Universal Gate. Output is HIGH (1) only when all inputs are LOW (0); otherwise LOW.',
    color: '#ec4899',
    accentClass: 'gate-nor',
    icChip: '7402 (Quad 2-Input NOR Gate)',
    technology: 'TTL / CMOS',
    propagationDelay: '8 ns',
    transistorCount: '4 Transistors (Series PMOS + Parallel NMOS)',
    logicFn: (a, b = 0) => (1 - (a | b)),
    truthTable: [
      { a: 0, b: 0, y: 1 },
      { a: 0, b: 1, y: 0 },
      { a: 1, b: 0, y: 0 },
      { a: 1, b: 1, y: 0 }
    ]
  },

  XOR: {
    id: 'XOR',
    name: 'XOR Gate (Exclusive OR)',
    inputs: 2,
    symbol: '⊕',
    formula: 'Y = A ⊕ B',
    booleanExpr: 'Y = (A · B\') + (A\' · B)',
    description: 'Output is HIGH (1) if and only if inputs are different. Fundamental to digital adders.',
    color: '#8b5cf6',
    accentClass: 'gate-xor',
    icChip: '7486 (Quad 2-Input XOR Gate)',
    technology: 'TTL / CMOS',
    propagationDelay: '10 ns',
    transistorCount: '8 - 12 Transistors (Transmission gate or AOI logic)',
    logicFn: (a, b = 0) => (a ^ b),
    truthTable: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 0 }
    ]
  },

  XNOR: {
    id: 'XNOR',
    name: 'XNOR Gate (Equivalence)',
    inputs: 2,
    symbol: '⊙',
    formula: 'Y = (A ⊕ B)\'',
    booleanExpr: 'Y = (A · B) + (A\' · B\')',
    description: 'Equality comparator. Output is HIGH (1) if both inputs have the exact same logic value.',
    color: '#06b6d4',
    accentClass: 'gate-xnor',
    icChip: '74266 (Quad 2-Input XNOR Gate)',
    technology: 'TTL / CMOS',
    propagationDelay: '11 ns',
    transistorCount: '8 - 12 Transistors',
    logicFn: (a, b = 0) => (1 - (a ^ b)),
    truthTable: [
      { a: 0, b: 0, y: 1 },
      { a: 0, b: 1, y: 0 },
      { a: 1, b: 0, y: 0 },
      { a: 1, b: 1, y: 1 }
    ]
  },

  BUFFER: {
    id: 'BUFFER',
    name: 'BUFFER (Driver)',
    inputs: 1,
    symbol: 'A',
    formula: 'Y = A',
    booleanExpr: 'Y = A',
    description: 'Preserves logic state while regenerating signal amplitude and increasing fan-out drive.',
    color: '#14b8a6',
    accentClass: 'gate-buffer',
    icChip: '7407 (Hex Buffer/Driver with Open-Collector)',
    technology: 'TTL / CMOS',
    propagationDelay: '4 ns',
    transistorCount: '4 Transistors (Two cascaded inverters)',
    logicFn: (a, b = 0) => a,
    truthTable: [
      { a: 0, y: 0 },
      { a: 1, y: 1 }
    ]
  }
};

window.LOGIC_GATES = LOGIC_GATES;
