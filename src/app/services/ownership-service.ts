import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GroupOwnership } from '../interfaces/group-ownership';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class OwnershipService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.getApiUrl('group-ownership-members');
  }
  
  getGroupOwnershipData() {
    return this.http.get<GroupOwnership[]>(this.baseUrl);
  }

  getMyGroupsByUserUid(uid: string) {
    return this.http.get<GroupOwnership[]>(`${this.baseUrl}/groups/${uid}`);
  }

  postGroupOwnershipData(data: GroupOwnership) {
    return this.http.post(this.baseUrl, data);
  }

  getGroupOwnershipByUid(uid: string) {
    return this.http.get<GroupOwnership>(`${this.baseUrl}/${uid}`);
  }

  deleteGroupOwnershipByUid(uid: string) {
    return this.http.delete(`${this.baseUrl}/${uid}`);
  }
}
