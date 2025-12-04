export interface BaseEntity{
  id: number;
  uid: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;
  active: boolean;
}