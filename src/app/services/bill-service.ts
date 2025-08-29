import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bill } from '../interfaces/bill';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  baseUrl = "http://localhost:9231/bills"

  constructor(private http: HttpClient) { }
  
    getBillsData(){
      return this.http.get<Bill []>(this.baseUrl);
    }
  
    getBillByUid(uid: string) {
      return this.http.get<Bill>(`${this.baseUrl}/${uid}`);
    }
}
