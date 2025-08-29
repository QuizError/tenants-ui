import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Property } from '../interfaces/property';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  baseUrl = "http://localhost:9231/properties"

  constructor(private http: HttpClient) { }
  
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
