import { SubjectModule, IndustryUpdate } from './types';

export const SUBJECT_MODULES: SubjectModule[] = [
  {
    id: 'demp-1',
    type: 'DEMP',
    title: 'Digital Electronics & Microprocessors',
    topic: 'Binary to Gray Code Conversion',
    content: 'Binary to Gray conversion is crucial in digital systems to minimize errors during transitions. In Gray code, only one bit changes at a time. To convert Binary to Gray: MSB stays same, subsequent bits are XORed with the next binary bit.',
    icon: 'Cpu'
  },
  {
    id: 'vlsi-1',
    type: 'VLSI',
    title: 'Very Large Scale Integration',
    topic: 'CMOS Inverter',
    content: 'The CMOS Inverter consists of a PMOS (Pull-up) and an NMOS (Pull-down). When input is High, NMOS is ON and PMOS is OFF, pulling output to GND. It is the fundamental building block of complex digital circuits due to zero static power dissipation.',
    icon: 'Layers'
  },
  {
    id: 'ss-1',
    type: 'SS',
    title: 'Signals & Systems',
    topic: 'Linearity and Time-Invariance',
    content: 'A system is Linear if it satisfies Additivity and Homogeneity. It is Time-Invariant if a delay in the input results in an identical delay in the output. Think of a tea strainer: it filters the same way regardless of when you pour the tea (Time Invariant).',
    icon: 'Activity'
  }
];

export const INDUSTRY_UPDATES: IndustryUpdate[] = [
  {
    title: 'India Semiconductor Mission (ISM) 2.0 Launched',
    date: 'March 2026',
    source: 'MeitY',
    summary: 'ISM 2.0 expands incentives for fabless design companies and assembly units, focusing on 28nm and below nodes.'
  },
  {
    title: 'Delhi Semiconductor Policy 2026',
    date: 'February 2026',
    source: 'Delhi Govt',
    summary: 'A first-of-its-kind state policy offering 25% subsidy on capital investment for semiconductor R&D in the NCR region.'
  }
];
