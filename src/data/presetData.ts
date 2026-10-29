export interface PresetDataset {
  id: string;
  name: string;
  testLabel: string;
  description: string;
  expectedOutcome: string;
  rawText: string;
}

export const PRESET_DATASETS: PresetDataset[] = [
  {
    id: 'foothills',
    name: 'Test 1 Foothills Meter Station Upgrade',
    testLabel: 'Test 1',
    description: 'Foothills Meter Station Upgrade (CPI 0.94, SPI 0.89, EAC $11.23M, $131K beyond reserve flagged).',
    expectedOutcome: 'Overall CPI 0.94, SPI 0.89, EAC $11.23M CAD, $131K beyond reserve flagged.',
    rawText: `Test 1 Foothills Meter Station Upgrade. Approved budget 10,600,000. Management reserve 500,000.
1.0 Engineering | BAC 1,200,000 | PV 1,200,000 | EV 1,180,000 | AC 1,310,000
2.0 Procurement | 3,800,000 | 3,100,000 | 2,650,000 | 2,700,000
3.0 Civil and Foundations | 900,000 | 900,000 | 900,000 | 860,000
4.0 Mechanical Installation | 2,600,000 | 1,300,000 | 980,000 | 1,150,000
5.0 Electrical and Instrumentation | 1,400,000 | 420,000 | 390,000 | 405,000
6.0 Project Management | 700,000 | 455,000 | 455,000 | 520,000
Notes: Compressor delivery slipped 35 days after a factory test failure. Mechanical crew short 6 welders. In-Service Date forecast May 14, 2027 vs April 30, 2027 target.`,
  },
  {
    id: 'ridgeview',
    name: 'Test 2 Ridgeview Compressor Station Expansion',
    testLabel: 'Test 2',
    description: 'Ridgeview Compressor Station Expansion (CPI 1.00, SPI 0.97, Construction flagged, EAC $8.0M).',
    expectedOutcome: 'CPI 1.00, SPI 0.97, Construction flagged (CPI 0.93, SPI 0.90), EAC $8.0M CAD.',
    rawText: `Test 2 Ridgeview Compressor Station Expansion. Approved budget 8,000,000. Management reserve 400,000.
1.0 Engineering | 1,000,000 | 1,000,000 | 1,000,000 | 950,000
2.0 Procurement | 3,000,000 | 2,400,000 | 2,400,000 | 2,350,000
3.0 Construction | 3,500,000 | 1,400,000 | 1,260,000 | 1,350,000
4.0 Project Management | 500,000 | 300,000 | 300,000 | 310,000
Notes: Frozen ground delayed excavation by 10 days. In-Service Date forecast unchanged at Jun 30, 2027.`,
  },
  {
    id: 'lakeshore',
    name: 'Test 3 Lakeshore Valve Site Retrofit',
    testLabel: 'Test 3',
    description: 'Lakeshore Valve Site Retrofit (CPI 0.91, SPI 1.15, EAC $2.19M, $90K beyond reserve flagged).',
    expectedOutcome: 'CPI 0.91, SPI 1.15, EAC $2.19M CAD, $90K beyond reserve flagged.',
    rawText: `Test 3 Lakeshore Valve Site Retrofit. Approved budget 2,000,000. Management reserve 100,000.
1.0 Design | 300,000 | 300,000 | 300,000 | 330,000
2.0 Materials | 900,000 | 600,000 | 700,000 | 760,000
3.0 Installation | 800,000 | 200,000 | 260,000 | 290,000
Notes: Installation crew started early to use good weather; overtime premium paid. In-Service Date forecast Dec 15, 2026 vs Dec 31 target.`,
  },
  {
    id: 'messy-foothills',
    name: 'Test 4 Messy Foothills',
    testLabel: 'Test 4',
    description: 'Messy Foothills raw text (same totals as test 1, no invented causes).',
    expectedOutcome: 'Same totals as Test 1 (CPI 0.94, SPI 0.89, EAC $11.23M CAD, $131K beyond reserve). No invented causes.',
    rawText: `hey need the update for monday, numbers below sorry its a mess
engineering - budget 1.2M, planned 1,200,000 earned 1.18m spent $1.31 million
PROCUREMENT bac=3800k pv=3100k ev=2650k ac=2700k
mech install: BAC 2.6M | PV 1.3M | EV 980K | AC 1.15M
civil done, came in at 860k on a 900k budget
E&I 1.4m budget, 420k planned, 390k earned, 405k spent
PM 700 bac, 455 pv, 455 ev, 520 ac (thousands)
compressor late again, welders still short`,
  },
  {
    id: 'northgate',
    name: 'Test 5 Northgate Pipeline Tie-in',
    testLabel: 'Test 5',
    description: 'Northgate Pipeline Tie-in (missing AC on Procurement and Construction, $4.7M vs $5.0M budget gap).',
    expectedOutcome: 'No commentary generated; lists missing AC on Procurement & Construction and highlights $4.7M vs $5.0M budget gap.',
    rawText: `Test 5 Northgate Pipeline Tie-in. Approved budget 5,000,000.
1.0 Engineering | 800,000 | 800,000 | 780,000 | 820,000
2.0 Procurement | 2,000,000 | 1,500,000 | 1,350,000 | not yet received
3.0 Construction | 1,900,000 | 600,000 | 540,000 | not yet received`,
  },
];
