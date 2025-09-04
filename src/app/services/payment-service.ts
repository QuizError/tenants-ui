import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment } from '../interfaces/payment';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.getApiUrl('payments');
  }
  
  getPaymentsData() {
    return this.http.get<Payment[]>(this.baseUrl);
  }

  savePaymentData(data: Payment) {
    return this.http.post(`${this.baseUrl}/receive-payment`, data);
  }
}
