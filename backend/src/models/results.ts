import { createRegionResult, RegionResult } from "./region";

export type Results = {
    regions: RegionResult[];
    wholeCountry: RegionResult;
}

export function createResults(data: any): Results {
    return {
        regions: data.VYSLEDKY.KRAJ.map((regionData: any) => createRegionResult(regionData)),
        wholeCountry: createRegionResult(data.VYSLEDKY.CR),
    };
}