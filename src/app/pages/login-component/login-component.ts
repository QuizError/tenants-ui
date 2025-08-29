import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  userData: any;

  errorMessage:{message:string} = {message:''}


  constructor(private router: Router, private userService: UserService, private fb: FormBuilder){
    this.loginForm = fb.group({
      username: [''],
      password: ['']
    })
  }

  
  onSubmit(){
    console.log(this.loginForm.value)
    this.userService.postLoginData(this.loginForm.value).subscribe(res=>{
      this.userData  = res;
      if(this.userData.status){
        localStorage.setItem('employeeApp',JSON.stringify(this.userData.data))
        this.router.navigateByUrl('dashboard')
      }
      else{
        this.errorMessage = {
        message : this.userData.message
        }
      }
    })
  }


}
