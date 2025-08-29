import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Unit } from '../interfaces/unit';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
    baseUrl = "http://localhost:9231/units"

  constructor(private http: HttpClient) { }
  
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
