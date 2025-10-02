import { createPartyResult, PartyResult } from "./party";

export type RegionResult = {
    regionName: string;
    votes: number,
    maxVotes: number,
    participationRate: number,
    parties: PartyResult[];
}

export function createRegionResult(regionData: any): RegionResult {
    return {
        regionName: regionData.NAZ_KRAJ,
        votes: parseInt(regionData.UCAST.PLATNE_HLASY, 10),
        maxVotes: parseInt(regionData.UCAST.ZAPSANI_VOLICI, 10),
        participationRate: parseFloat(regionData.UCAST.UCAST_PROC),
        parties: regionData.STRANA.map((partyData: any) => createPartyResult(partyData)),
    };
}
