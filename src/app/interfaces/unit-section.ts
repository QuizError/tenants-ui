import { UnitSectionDefinition } from "./unit-section-definition";

export interface UnitSection {
    uid:string,
    name:string,
    available:boolean,
    unitUid:string,
    price:number,
    currency:string,
    unitName:string,
    waterMeter?: string,
    electricityMeter?: string,
    roomDtos: UnitSectionDefinition[],
}
