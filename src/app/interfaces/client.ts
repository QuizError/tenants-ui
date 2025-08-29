export interface Room {
    id: string;
    name: string;
    type: string;
    status: 'active' | 'pending' | 'expired';
    monthlyRent: number;
    startDate: string;
    endDate?: string;
}

export interface Damage {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    reportedBy: 'client' | 'manager';
    reportedDate: string;
    roomName: string;
    estimatedCost?: number;
    status: 'reported' | 'investigating' | 'in-repair' | 'resolved';
}

export interface Client {
    ownerUid: string;
    userUid: string;
    uid: string;
    user:{
        uid: string;
        firstname: string;
        lastname: string;
        middleName: string;
        msisdn: string;
        email: string;
        password: string;
        idNumber: string;
        gender: string; 
    }
    occupation: string;
    dob: string;
    rooms?: Room[];
    damages?: Damage[];
}
