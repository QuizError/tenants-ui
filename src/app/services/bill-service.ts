import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill } from '../interfaces/bill';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.getApiUrl('bills');
  }
  
  getBillsData(uid: string) {
    return this.http.get<Bill[]>(`${this.baseUrl}/my-properties/${uid}`);
  }

  getBillByUid(uid: string) {
    return this.http.get<Bill>(`${this.baseUrl}/${uid}`);
  }
}
