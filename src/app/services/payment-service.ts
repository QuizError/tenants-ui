import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment } from '../interfaces/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  
  baseUrl = "http://localhost:9231/payments"

  constructor(private http: HttpClient) { }
  
    getPaymentsData(){
      return this.http.get<Payment []>(this.baseUrl);
    }
  
    savePaymentData(data: Payment){
      return this.http.post(`${this.baseUrl}/receive-payment`,data);
    }
  
    getPaymentByUid(uid: string) {
      return this.http.get<Payment>(`${this.baseUrl}/${uid}`);
    }
}
