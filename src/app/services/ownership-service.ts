import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GroupOwnership } from '../interfaces/group-ownership';
import { ConfigService } from './config.service';
import { Membership } from '../interfaces/membership';

@Injectable({
  providedIn: 'root'
})
export class OwnershipService {
  private membersBaseUrl: string;
  private groupsBaseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.membersBaseUrl = this.configService.getApiUrl('group-ownership-members');
    this.groupsBaseUrl = this.configService.getApiUrl('group-ownerships');
  }
  
  getGroupOwnershipData() {
    return this.http.get<GroupOwnership[]>(this.groupsBaseUrl);
  }

  getGroupMembersData() {
    return this.http.get<Membership[]>(this.membersBaseUrl);
  }

  getMyGroupsByUserUid(uid: string) {
    return this.http.get<GroupOwnership[]>(`${this.membersBaseUrl}/groups/${uid}`);
  }

  postGroupOwnershipData(data: GroupOwnership) {
    return this.http.post(this.groupsBaseUrl, data);
  }

  postGroupMembershipData(data: Membership) {
    return this.http.post(this.membersBaseUrl, data);
  }

  getGroupOwnershipByUid(uid: string) {
    return this.http.get<GroupOwnership>(`${this.groupsBaseUrl}/${uid}`);
  }

  deleteGroupOwnershipByUid(uid: string) {
    return this.http.delete(`${this.groupsBaseUrl}/${uid}`);
  }
}
