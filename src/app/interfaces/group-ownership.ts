import { User } from "./user";

export interface GroupOwnership {
    name:number,
    uid:string,
    ownershipType:string,
    createdAt:string,
    updatedAt:string,
    active:boolean,
    user: User,
    group: GroupOwnership
}
