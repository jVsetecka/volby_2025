export type CoalitionId = 'KOALICE_A' | 'KOALICE_B' | 'KOALICE_C';


export interface Coalition {
    id: CoalitionId;
    name: string;
    color: string; // hex barva pro grafy
}


export interface TallyPoint {
    /** timestamp jako ISO string (nebo číslo minut od začátku sčítání) */
    t: string;
    /** procenta sečtených okrsků 0–100 */
    countedPct: number;
    /** podíl hlasů dané koalice v tomto čase (v %) */
    sharePct: number;
}


export interface CoalitionSeries {
    coalitionId: CoalitionId;
    points: TallyPoint[]; // časová řada
}


export interface RegionShare {
    region: string; // např. "Praha", "Jihomoravský"
    shares: Record<CoalitionId, number>; // podíly v % v daném regionu
}


export interface TurnoutPoint {
    t: string; // čas
    turnoutPct: number; // účast v % (kumulativně)
}