import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { GroupOwnership } from '../interfaces/group-ownership';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  baseUrl = "http://localhost:9231/api/login"

  constructor(private http: HttpClient) { }

  postLoginData(data: User){
    return this.http.post(this.baseUrl,data);
  }

  getUserData(){
    return this.http.get<GroupOwnership []>(this.baseUrl);
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


