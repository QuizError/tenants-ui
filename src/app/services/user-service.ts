import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { GroupOwnership } from '../interfaces/group-ownership';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private baseUrl: string;
  private userBaseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.baseUrl = `${this.configService.apiBaseUrl}/api/login`;
    this.userBaseUrl = `${this.configService.apiBaseUrl}/users`;
  }

  postLoginData(data: User){
    return this.http.post(this.baseUrl,data);
  }

  getUserData(){
    return this.http.get<GroupOwnership []>(this.baseUrl);
  }

  getUserDataList(){
    return this.http.get<User []>(this.userBaseUrl);
  }

  postUserData(data: User){
    return this.http.post(this.baseUrl,data);
  }

  getUserByUid(uid: string){
    return this.http.get<User>(`${this.baseUrl}/${uid}`);
  }

  deleteUserByUid(uid: string){
    return this.http.delete(`${this.baseUrl}/${uid}`);
  }
}
