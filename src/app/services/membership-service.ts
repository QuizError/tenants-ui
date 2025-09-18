import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Membership, MembershipCreateDto, MembershipUpdateDto } from '../interfaces/membership';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private apiUrl = `${environment.apiUrl}/memberships`;

  constructor(private http: HttpClient) {}

  /**
   * Get all memberships with optional filters
   */
  getMemberships(params?: {
    userUid?: string;
    groupUid?: string;
    status?: string;
  }): Observable<Membership[]> {
    return this.http.get<Membership[]>(this.apiUrl, { params: params as any });
  }

  /**
   * Get a single membership by ID
   */
  getMembership(uid: string): Observable<Membership> {
    return this.http.get<Membership>(`${this.apiUrl}/${uid}`);
  }

  /**
   * Create a new membership
   */
  createMembership(membership: MembershipCreateDto): Observable<Membership> {
    return this.http.post<Membership>(this.apiUrl, membership);
  }

  /**
   * Update an existing membership
   */
  updateMembership(uid: string, updates: MembershipUpdateDto): Observable<Membership> {
    return this.http.put<Membership>(`${this.apiUrl}/${uid}`, updates);
  }

  /**
   * Delete a membership
   */
  deleteMembership(uid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uid}`);
  }

  /**
   * Get memberships for a specific user
   */
  getUserMemberships(userUid: string): Observable<Membership[]> {
    return this.getMemberships({ userUid });
  }

  /**
   * Get memberships for a specific group
   */
  getGroupMemberships(groupUid: string): Observable<Membership[]> {
    return this.getMemberships({ groupUid });
  }

  /**
   * Update a user's membership status
   */
  updateMembershipStatus(uid: string, status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'): Observable<Membership> {
    return this.updateMembership(uid, { memberStatus: status });
  }
}
