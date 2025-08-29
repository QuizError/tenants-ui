export interface Payment {
    uid: string;
    billUid: string;
    fspName: string;
    fspCode: string;
    currency: string;
    amountDue: number;
    paidAmount: number;
    billReferenceNumber: string;
    thirdPartyReference: string;
    paymentDate: string | null;
    paymentChannel: string;
    status?: 'Paid' | 'PartyPaid' | 'Failed';
    createdAt?: string;
    updatedAt?: string;
}

export interface PaymentResponse {
    content: Payment[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
