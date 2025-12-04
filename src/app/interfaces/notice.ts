export type NoticeType = 'Exit' | 'Warning' | 'RentArrears' | 'Termination' | 'Eviction' | 'Maintenance' | 'Entry' | 'UtilityShutdown' | 'General' | 'RentIncrease';

export interface Notice {
  message: string;
  details: string;
  noticeType: NoticeType;
  rentalUid: string;
  uid?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
