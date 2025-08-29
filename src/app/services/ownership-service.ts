import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GroupOwnership } from '../interfaces/group-ownership';

@Injectable({
  providedIn: 'root'
})
export class OwnershipService {
  baseUrl = "http://localhost:9231/group-ownership-members"

  constructor(private http: HttpClient) { }
  
    getGroupOwnershipData(){
      return this.http.get<GroupOwnership []>(this.baseUrl);
    }

    getMyGroupsByUserUid(uid: string){
      return this.http.get<GroupOwnership []>(`${this.baseUrl}/groups/${uid}`);
    }
  
    postGroupOwnershipData(data: GroupOwnership){
      return this.http.post(this.baseUrl,data);
    }
  
    getGroupOwnershipByUid(uid: string){
      return this.http.get<GroupOwnership>(`${this.baseUrl}/${uid}`);
    }
  
    deleteGroupOwnershipByUid(uid: string){
      return this.http.delete(`${this.baseUrl}/${uid}`);
    }
}
