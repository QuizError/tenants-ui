import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../interfaces/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  baseUrl = "http://localhost:9231/clients"

  constructor(private http: HttpClient) { }
  
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
  
    getClientByUid(uid: string){
      return this.http.get<Client>(`${this.baseUrl}/${uid}`);
    }
  
    deleteClientByUid(uid: string){
      return this.http.delete(`${this.baseUrl}/${uid}`);
    }
}
