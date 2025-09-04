import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UnitSection } from '../interfaces/unit-section';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UnitSectionService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.getApiUrl('unit-sections');
  }
  
  getUnitSectionDataList(){
    return this.http.get<UnitSection[]>(this.baseUrl);
  }

  getUnitSectionByUnityUid(uid:string){
    return this.http.get<UnitSection []>(`${this.baseUrl}/unit/${uid}`);
  }

  getAvailableUnitSectionByUserUid(uid:string){
    return this.http.get<UnitSection []>(`${this.baseUrl}/available-units/${uid}`);
  }
  
  saveUnitSectionData(data: UnitSection){
    return this.http.post(this.baseUrl,data);
  }

  getUnitSectionByUid(uid: string) {
    return this.http.get<UnitSection>(`${this.baseUrl}/${uid}`);
  }
  
  deleteUnitSectionByUid(uid: string){
    return this.http.delete(`${this.baseUrl}/${uid}`);
  }
}
