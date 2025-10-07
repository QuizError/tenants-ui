import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rental } from '../interfaces/rental';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.getApiUrl('rentals');
  }
  
  getRentalsData() {
    return this.http.get<Rental[]>(this.baseUrl);
  }

  getRentalsByOwnerUid(uid: string) {
    return this.http.get<Rental[]>(`${this.baseUrl}/owner/${uid}`);
  }

  getPropertyRentalsEndingThisMonthByOwnerUid(uid: string) {
    return this.http.get<Rental[]>(`${this.baseUrl}/contract-end/owner/${uid}`);
  }

  getExpiredPropertyRentalsContractsByOwnerUid(uid: string) {
    return this.http.get<Rental[]>(`${this.baseUrl}/contract-expired/owner/${uid}`);
  }

  getRentalsByClientUid(uid: string) {
    return this.http.get<Rental[]>(`${this.baseUrl}/client/${uid}`);
  }

  postRentalData(data: Rental) {
    return this.http.post(this.baseUrl, data);
  }

  getRentalByUid(uid: string) {
    return this.http.get<Rental>(`${this.baseUrl}/${uid}`);
  }

  deleteRentalByUid(uid: string) {
    return this.http.delete(`${this.baseUrl}/${uid}`);
  }
}
