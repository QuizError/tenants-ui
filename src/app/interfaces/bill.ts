export interface Bill {
  uid: string;
  createdAt?: string;
  totalAMount?: number; // Note: source field uses capital M as provided
  paidAmount?: number;
  amountDue?: number;
  totalEquivalentAmount?: number;
  agentFee?: number;
  commission?: number;
  billReferenceNumber?: string;
  thirdPartyReference?: string;
  billDescription?: string;
  billType?: string;
  currency?: string;
  billStatus?: string;
  // Customer info
  customerName?: string;
  customerUid?: string;
}
