import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GroupOwnership } from '../interfaces/group-ownership';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = `${environment.apiUrl}/group-ownerships`;

  constructor(private http: HttpClient) {}

  getGroups(): Observable<GroupOwnership[]> {
    return this.http.get<GroupOwnership[]>(this.apiUrl);
  }

  getGroup(uid: string): Observable<GroupOwnership> {
    return this.http.get<GroupOwnership>(`${this.apiUrl}/${uid}`);
  }

  createGroup(group: Omit<GroupOwnership, 'uid'>): Observable<GroupOwnership> {
    return this.http.post<GroupOwnership>(this.apiUrl, group);
  }

  updateGroup(uid: string, group: Partial<GroupOwnership>): Observable<GroupOwnership> {
    return this.http.put<GroupOwnership>(`${this.apiUrl}/${uid}`, group);
  }

  deleteGroup(uid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uid}`);
  }
}
