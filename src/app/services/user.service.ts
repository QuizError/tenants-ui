import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { User } from '../interfaces/user';

// Define an interface for the pageable response
interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

interface ApiResponse<T> {
  status: boolean;
  responseCode: number;
  message: string;
  data: T;
  dataList: T[] | null;
  pageable?: PageableResponse<T>;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`; // Make sure to set this in your environment files

  constructor(private http: HttpClient) {}

  // Get paginated users - returns pageable response
  getUsers(
    page: number = 0,
    size: number = 10,
    searchTerm: string = ''
  ): Observable<PageableResponse<User>> {
    const params: any = { page, size };
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    return this.http.get<ApiResponse<PageableResponse<User>>>(`${this.apiUrl}/search`, { params }).pipe(
      map(response => {
        if (!response.status) {
          throw new Error(response.message || 'Failed to fetch users');
        }
        return response.data;
      })
    );
  }

  // Get single user by ID - returns wrapped response
  getUser(id: string): Observable<User> {
    console.log('Fetching user with ID:', id);
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log('Raw API response:', response)),
      map(response => {
        if (!response) {
          throw new Error('Empty response from server');
        }
        if (!response.data) {
          console.error('No data in response:', response);
          throw new Error('No user data in response');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error in getUser:', error);
        return throwError(() => error);
      })
    );
  }

  // Create or update user - uses the same endpoint
  saveUser(user: Partial<User>): Observable<User> {
    if (user.uid) {
      // If user has UID, it's an update
      return this.http.post<ApiResponse<User>>(`${this.apiUrl}`, user).pipe(
        map(response => response.data)
      );
    } else {
      // No UID means it's a new user
      return this.http.post<ApiResponse<User>>(this.apiUrl, user).pipe(
        map(response => response.data)
      );
    }
  }

  // Delete a user - returns wrapped response
  deleteUser(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(() => {})
    );
  }

  // Update user status (active/inactive) - returns wrapped response
  updateUserStatus(id: string, status: boolean): Observable<User> {
    return this.http.patch<ApiResponse<User>>(
      `${this.apiUrl}/${id}/status`, 
      { active: status }
    ).pipe(
      map(response => response.data)
    );
  }

  // Reset user password (admin function) - returns wrapped response
  resetPassword(id: string, newPassword: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(
      `${this.apiUrl}/${id}/reset-password`, 
      { newPassword }
    ).pipe(
      map(() => {})
    );
  }

  // Search users with pagination and filters - POST request
  searchUsers(searchRequest: {
    pageNumber: number;
    pageSize: number;
    searchTerm?: string;
    userType?: string;
    active?: boolean;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/search`, searchRequest).pipe(
      map(response => {
        if (!response) {
          throw new Error('Empty response from server');
        }
        return response;
      })
    );
  }
}
