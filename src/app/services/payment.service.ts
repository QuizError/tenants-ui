import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, PaymentResponse } from '../interfaces/payment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.payments}`;

  constructor(private http: HttpClient) {}

  // Use POST for paginated payments to accommodate backend requirements
  getPayments(
    page: number = 0,
    size: number = environment.pagination.defaultPageSize,
    extra: Record<string, any> = {}
  ): Observable<PaymentResponse> {
    const savedUser = localStorage.getItem('employeeApp');
    const user = savedUser ? JSON.parse(savedUser) : null;
    const userUid = user?.uid || '';
    
    const body = { 
      page, 
      size, 
      userUid, 
      ...extra 
    };
    
    return this.http.post<PaymentResponse>(`${this.apiUrl}/search`, body);
  }

  getPaymentByUid(uid: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${uid}`);
  }

  createPayment(payment: Partial<Payment>): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  updatePayment(uid: string, payment: Partial<Payment>): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${uid}`, payment);
  }

  deletePayment(uid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uid}`);
  }

  // Helper method to create a mock payment (for testing)
  createMockPayment(overrides: Partial<Payment> = {}): Payment {
    const defaultPayment: Payment = {
      uid: `pay-${Math.random().toString(36).substr(2, 9)}`,
      billUid: `bill-${Math.random().toString(36).substr(2, 9)}`,
      fspName: 'CRDB BANK',
      fspCode: 'CORUTZTZ',
      currency: environment.app.defaultCurrency,
      amountDue: 0,
      paidAmount: 1500000,
      billReferenceNumber: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      thirdPartyReference: `TP-${Math.floor(100 + Math.random() * 900)}`,
      paymentDate: new Date().toISOString(),
      paymentChannel: 'CASH',
      status: 'Paid',
      ...overrides
    };
    
    return defaultPayment;
  }
}
