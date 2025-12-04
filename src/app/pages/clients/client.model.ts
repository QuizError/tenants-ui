import { BaseEntity } from "../../shared/global.interface";

export enum NoticeType{
  Exit = "Exit",
  Warning = "Warning",
  RentArrears = "RentArrears",
  Termination = "Termination",
  Eviction = "Eviction",
  Maintenance = "Maintenance",
  Entry = "Entry",
  UtilityShutdown = "UtilityShutdown",
  General = "General",
  RentIncrease = "RentIncrease"
}

export interface ClientNotice extends BaseEntity{
  deatils: string;
  
}