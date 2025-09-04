import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Property } from '../interfaces/property';
import { map } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.getApiUrl('properties');
  }
  
  getGroupOwnershipData(){
    return this.http.get<Property []>(this.baseUrl);
  }

  getMyProprtiesByUserUid(uid: string){
    return this.http.get<Property []>(`${this.baseUrl}/user/${uid}`);
  }
  
  savePropertyData(data: Property){
    return this.http.post(this.baseUrl,data);
  }
  
  getPropertyByUid(uid: string) {
    return this.http.get<Property>(`${this.baseUrl}/${uid}`);
  }
  // getPropertyByUid(uid: string) {
  //   return this.http.get<any>(`${this.baseUrl}/${uid}`).pipe(
  //     map(res=> res.data)
  //   );
  // }
  
  deletePropertyByUid(uid: string){
    return this.http.delete(`${this.baseUrl}/${uid}`);
  }
}
