import type { Coalition, CoalitionSeries, RegionShare, TurnoutPoint } from '../types/election';


export const COALITIONS: Coalition[] = [
    { id: 'KOALICE_A', name: 'Koalice A', color: '#2563eb' }, // modrá
    { id: 'KOALICE_B', name: 'Koalice B', color: '#16a34a' }, // zelená
    { id: 'KOALICE_C', name: 'Koalice C', color: '#ef4444' }, // červená
];


// "Sobotní 18:00 – 23:00" každých 30 min (mock)
const times = [
    '2025-10-04T18:00:00Z', '2025-10-04T18:30:00Z', '2025-10-04T19:00:00Z',
    '2025-10-04T19:30:00Z', '2025-10-04T20:00:00Z', '2025-10-04T20:30:00Z',
    '2025-10-04T21:00:00Z', '2025-10-04T21:30:00Z', '2025-10-04T22:00:00Z',
    '2025-10-04T22:30:00Z', '2025-10-04T23:00:00Z'
];


// Pro jednoduchost: simulujme postup sčítání a dynamiku podílů
function makeSeries(base: { A: number; B: number; C: number }): CoalitionSeries[] {
    const jit = (n: number) => Math.random() * n - n / 2;

    const mk = (baseShare: number, driftPerStep: number, jitter: number) =>
        times.map((t, i, arr) => {
            const countedPct = Math.min(100, Math.round((i / (arr.length - 1)) * 100));
            const sharePct = Math.max(0, baseShare + jit(jitter) + (i - 5) * driftPerStep);
            return { t, countedPct, sharePct }; // <- countedPct je čisté number
        });

    const sharesA = mk(base.A,  0.12, 1.8);
    const sharesB = mk(base.B, -0.05, 1.6);
    const sharesC = mk(base.C, -0.07, 1.5);

    return [
        { coalitionId: 'KOALICE_A', points: sharesA },
        { coalitionId: 'KOALICE_B', points: sharesB },
        { coalitionId: 'KOALICE_C', points: sharesC },
    ];
}


export const TALLY_SERIES: CoalitionSeries[] = makeSeries({ A: 38, B: 33, C: 17 });


// Regionální rozpad (podíly v % – nesoučet nemusí být přesně 100 kvůli jiným stranám)
export const REGION_BREAKDOWN: RegionShare[] = [
    { region: 'Praha', shares: { KOALICE_A: 42, KOALICE_B: 28, KOALICE_C: 14 } },
    { region: 'Středočeský', shares: { KOALICE_A: 36, KOALICE_B: 34, KOALICE_C: 16 } },
    { region: 'Jihomoravský', shares: { KOALICE_A: 33, KOALICE_B: 37, KOALICE_C: 18 } },
    { region: 'Moravskoslezský', shares: { KOALICE_A: 30, KOALICE_B: 39, KOALICE_C: 17 } },
    { region: 'Plzeňský', shares: { KOALICE_A: 35, KOALICE_B: 32, KOALICE_C: 19 } },
];


// Účast v čase (kumulativně během soboty)
export const TURNOUT_TIMELINE: TurnoutPoint[] = [
    { t: '2025-10-04T08:00:00Z', turnoutPct: 12 },
    { t: '2025-10-04T10:00:00Z', turnoutPct: 21 },
    { t: '2025-10-04T12:00:00Z', turnoutPct: 31 },
    { t: '2025-10-04T14:00:00Z', turnoutPct: 39 },
    { t: '2025-10-04T16:00:00Z', turnoutPct: 46 },
    { t: '2025-10-04T18:00:00Z', turnoutPct: 52 },
    { t: '2025-10-04T20:00:00Z', turnoutPct: 57 },
];