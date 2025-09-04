import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Unit } from '../interfaces/unit';
import { map } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.getApiUrl('units');
  }
  
  getPropertyUnitData(){
    return this.http.get<Unit []>(this.baseUrl);
  }

  getUnitsByPropertyUid(uid:string){
    return this.http.get<Unit []>(`${this.baseUrl}/property/${uid}`);
  }
  
  savePropertyUnitData(data: Unit){
    return this.http.post(this.baseUrl,data);
  }

  getUnitByUid(uid: string) {
    return this.http.get<Unit>(`${this.baseUrl}/${uid}`);
  }
  
  // getPropertyUnitByUid(uid: string) {
  //   return this.http.get<any>(`${this.baseUrl}/${uid}`).pipe(
  //     map(res=> res.data)
  //   );
  // }
  
  deleteUnitByUid(uid: string){
    return this.http.delete(`${this.baseUrl}/${uid}`);
  }
}
