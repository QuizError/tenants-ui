import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { Payment, PaymentResponse } from '../interfaces/payment';
import { environment } from '../../environments/environment';

// Define an interface for the wrapped API response
interface ApiResponse<T> {
  status: boolean;
  responseCode: number;
  message: string;
  data: T;
  dataList: null;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    // Ensure the API URL is properly constructed
    this.apiUrl = `${environment.apiUrl}${environment.endpoints.payments}`;
    console.log('PaymentService initialized with API URL:', this.apiUrl);
  }

  // Use POST for paginated payments to accommodate backend requirements
  getPayments(
    page: number = 0,
    size: number = environment.pagination.defaultPageSize,
    extra: Record<string, any> = {}
  ): Observable<PaymentResponse> {
    try {
      const savedUser = localStorage.getItem('employeeApp');
      const user = savedUser ? JSON.parse(savedUser) : null;
      const userUid = user?.uid || '';
      
      const body = { 
        page, 
        size, 
        userUid, 
        ...extra 
      };
      
      console.log('Making request to:', `${this.apiUrl}/search`);
      console.log('Request body:', body);
      
      return this.http.post<PaymentResponse>(`${this.apiUrl}/search`, body).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      console.error('Error in getPayments:', error);
      return throwError(() => new Error('Failed to process payments request'));
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client-side error:', error.error.message);
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`
      );
      errorMessage = `Backend returned code ${error.status}: ${error.statusText}`;
    }
    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }

  getPaymentByUid(uid: string): Observable<Payment> {
    return this.http.get<ApiResponse<Payment>>(`${this.apiUrl}/${uid}`).pipe(
      map(response => {
        if (!response.status || !response.data) {
          throw new Error(response.message || 'Failed to get payment');
        }
        return response.data;
      }),
      catchError(err => {
        console.error('Error in getPaymentByUid:', err);
        return throwError(() => new Error('Failed to retrieve payment'));
      })
    );
  }

  createPayment(payment: Partial<Payment>): Observable<Payment> {
    try {
      console.log('Making request to:', this.apiUrl);
      console.log('Request body:', payment);
      return this.http.post<Payment>(this.apiUrl, payment).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      console.error('Error in createPayment:', error);
      return throwError(() => new Error('Failed to create payment'));
    }
  }

  updatePayment(uid: string, payment: Partial<Payment>): Observable<Payment> {
    try {
      console.log('Making request to:', `${this.apiUrl}/${uid}`);
      console.log('Request body:', payment);
      return this.http.put<Payment>(`${this.apiUrl}/${uid}`, payment).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      console.error('Error in updatePayment:', error);
      return throwError(() => new Error('Failed to update payment'));
    }
  }

  deletePayment(uid: string): Observable<void> {
    try {
      console.log('Making request to:', `${this.apiUrl}/${uid}`);
      return this.http.delete<void>(`${this.apiUrl}/${uid}`).pipe(
        catchError(this.handleError)
      );
    } catch (error) {
      console.error('Error in deletePayment:', error);
      return throwError(() => new Error('Failed to delete payment'));
    }
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
