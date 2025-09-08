import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../interfaces/client';
import { ConfigService } from './config.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.getApiUrl('clients');
  }
  
  getClientData(){
    return this.http.get<Client []>(this.baseUrl);
  }

  getClientsByOwnerUid(uid: string){
    return this.http.get<Client []>(`${this.baseUrl}/owner/${uid}`);
  }
  
  // Accept partial payloads built from form + ownerUid
  postClientData(data: Partial<Client> | any){
    return this.http.post(this.baseUrl,data);
  }
  
  getClientByUid(uid: string) {
    console.log('Making API call to:', `${this.baseUrl}/${uid}`);
    return this.http.get<Client>(`${this.baseUrl}/${uid}`).pipe(
      tap({
        // next: (response) => console.log('API Response:', response),
        error: (error) => console.error('API Error:', error)
      })
    );
  }
  
  deleteClientByUid(uid: string){
    return this.http.delete(`${this.baseUrl}/${uid}`);
  }

  // Update an existing client using the save endpoint
  updateClient(clientData: any) {
    console.log('Saving updated client data:', clientData);
    return this.http.post(this.baseUrl, clientData).pipe(
      tap({
        next: (response) => console.log('Client update successful:', response),
        error: (error) => console.error('Client update error:', error)
      })
    );
  }
}
