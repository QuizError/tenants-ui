import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rental } from '../interfaces/rental';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  baseUrl = "http://localhost:9231/rentals"

  constructor(private http: HttpClient) { }
  
    getRentalsData(){
      return this.http.get<Rental []>(this.baseUrl);
    }

    getRentalsByOwnerUid(uid: string){
      return this.http.get<Rental []>(`${this.baseUrl}/owner/${uid}`);
    }

    getRentalsByClientUid(uid: string){
      return this.http.get<Rental []>(`${this.baseUrl}/client/${uid}`);
    }
  
    postRentalData(data: Rental){
      return this.http.post(this.baseUrl,data);
    }
  
    getRentalByUid(uid: string){
      return this.http.get<Rental>(`${this.baseUrl}/${uid}`);
    }
  
    deleteRentalByUid(uid: string){
      return this.http.delete(`${this.baseUrl}/${uid}`);
    }
}
