export interface Rental {

    clientUid: string;
    uid: string;
    unitSectionUid: string;
    startDate: string;
    endDate: string;

    // Optional fields returned by API for richer UI
    unitSectionName?: string;
    unitName?: string;
    price?: number;
    currency?: string;
    billStatus?: string; // e.g., 'WaitingForPayment', 'Paid'
    rentalStatus?: string;  // e.g., 'NOT_ACTIVE', 'ACTIVE', 'EXPIRED'

    // Optional branding/organization fields (if backend provides)
    ownerName?: string;
    ownerLogoUrl?: string;
    ownerAddress?: string;
    ownerPhone?: string;
    groupName?: string;
    groupLogoUrl?: string;
    groupAddress?: string;
    groupPhone?: string;
    companyName?: string;
    companyLogoUrl?: string;
    companyAddress?: string;
    companyPhone?: string;
}
