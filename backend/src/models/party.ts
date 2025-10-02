

export type PartyResult = {
    partyName: string;
    partyCode: number;
    votes: number;
    votePercentage: number;
}

export function createPartyResult(partyData: any): PartyResult {
    return {
        partyName: partyData.NAZ_STR,
        partyCode: parseInt(partyData.KSTRANA, 10),
        votes: parseInt(partyData.HODNOTY_STRANA.HLASY, 10),
        votePercentage: parseFloat(partyData.HODNOTY_STRANA.PROC_HLASU)
    };
}