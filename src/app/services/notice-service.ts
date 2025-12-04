import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Notice } from '../interfaces/notice';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private apiUrl = `${environment.apiUrl}/notices`;

  constructor(private http: HttpClient) {}

  createNotice(notice: Partial<Notice>): Observable<Notice> {
    return this.http.post<Notice>(this.apiUrl, notice);
  }

  getNoticesByRentalUid(rentalUid: string): Observable<Notice[]> {
    return this.http.get<Notice[]>(`${this.apiUrl}/rental/${rentalUid}`);
  }

  getNotice(uid: string): Observable<Notice> {
    return this.http.get<Notice>(`${this.apiUrl}/${uid}`);
  }

  updateNotice(uid: string, notice: Partial<Notice>): Observable<Notice> {
    return this.http.put<Notice>(`${this.apiUrl}/${uid}`, notice);
  }

  deleteNotice(uid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uid}`);
  }
}
