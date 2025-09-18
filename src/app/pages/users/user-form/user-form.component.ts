import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header bg-white border-0">
              <h3 class="mb-0">{{ isEditMode ? 'Edit' : 'Add New' }} User</h3>
            </div>
            <div class="card-body">
              <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
                <div class="row g-3">
                  <!-- First Name -->
                  <div class="col-md-4">
                    <label class="form-label">First Name</label>
                    <input type="text" class="form-control" formControlName="firstname" 
                           [ngClass]="{'is-invalid': submitted && f['firstname'].errors}">
                    <div *ngIf="submitted && f['firstname'].errors" class="invalid-feedback">
                      <div *ngIf="f['firstname'].errors['required']">First name is required</div>
                    </div>
                  </div>
                  
                  <!-- Middle Name -->
                  <div class="col-md-4">
                    <label class="form-label">Middle Name</label>
                    <input type="text" class="form-control" formControlName="middleName">
                  </div>
                  
                  <!-- Last Name -->
                  <div class="col-md-4">
                    <label class="form-label">Last Name</label>
                    <input type="text" class="form-control" formControlName="lastname"
                           [ngClass]="{'is-invalid': submitted && f['lastname'].errors}">
                    <div *ngIf="submitted && f['lastname'].errors" class="invalid-feedback">
                      <div *ngIf="f['lastname'].errors['required']">Last name is required</div>
                    </div>
                  </div>
                  
                  <!-- Email -->
                  <div class="col-md-6">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" formControlName="email"
                           [ngClass]="{'is-invalid': submitted && f['email'].errors}">
                    <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
                      <div *ngIf="f['email'].errors['required']">Email is required</div>
                      <div *ngIf="f['email'].errors['email']">Please enter a valid email</div>
                    </div>
                  </div>
                  
                  <!-- Phone -->
                  <div class="col-md-6">
                    <label class="form-label">Phone Number</label>
                    <input type="tel" class="form-control" formControlName="mobileNo"
                           [ngClass]="{'is-invalid': submitted && f['mobileNo'].errors}">
                    <div *ngIf="submitted && f['mobileNo'].errors" class="invalid-feedback">
                      <div *ngIf="f['mobileNo'].errors['required']">Phone number is required</div>
                    </div>
                  </div>
                  
                  <!-- ID Number -->
                  <div class="col-md-6">
                    <label class="form-label">ID Number</label>
                    <input type="text" class="form-control" formControlName="idNumber"
                           [ngClass]="{'is-invalid': submitted && f['idNumber'].errors}">
                    <div *ngIf="submitted && f['idNumber'].errors" class="invalid-feedback">
                      <div *ngIf="f['idNumber'].errors['required']">ID number is required</div>
                    </div>
                  </div>
                  
                  <!-- User Type -->
                  <div class="col-md-6">
                    <label class="form-label">User Type</label>
                    <select class="form-select" formControlName="userType"
                            [ngClass]="{'is-invalid': submitted && f['userType'].errors}">
                      <option value="">Select user type</option>
                      <option value="INTERNAL">Internal</option>
                      <option value="MANAGER">Manager</option>
                      <option value="FINANCE">Finance</option>
                      <option value="OWNER">Owner</option>
                    </select>
                    <div *ngIf="submitted && f['userType'].errors" class="invalid-feedback">
                      <div *ngIf="f['userType'].errors['required']">User type is required</div>
                    </div>
                  </div>
                  
                  <!-- Password (only for new users) -->
                  <div class="col-12" *ngIf="!isEditMode">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" formControlName="password"
                           [ngClass]="{'is-invalid': submitted && f['password'].errors}">
                    <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
                      <div *ngIf="f['password'].errors['required']">Password is required</div>
                      <div *ngIf="f['password'].errors['minlength']">Password must be at least 6 characters</div>
                    </div>
                  </div>
                </div>
                
                <div class="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" class="btn btn-outline-secondary" routerLink="/users">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary">
                    {{ isEditMode ? 'Update' : 'Create' }} User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  submitted = false;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      middleName: [''],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', Validators.required],
      idNumber: ['', Validators.required],
      userType: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    
    if (this.userId) {
      this.isEditMode = true;
      // Remove password validation for edit mode
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      
      // Load user data
      this.userService.getUser(this.userId).subscribe({
        next: (user: User) => {
          this.userForm.patchValue(user);
          // Remove password field for edit
          this.userForm.get('password')?.setValue('');
        },
        error: (error: any) => console.error('Error loading user:', error)
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.userForm.invalid) {
      return;
    }

    const userData = this.userForm.value;
    
    if (this.isEditMode && this.userId) {
      // For update, include the UID in the payload
      userData.uid = this.userId;
    }
    this.userService.saveUser(userData).subscribe({
      next: () => {
        this.router.navigate(['/users']);
        // Show success message
      },
      error: (error) => {
        console.error('Error creating/updating user:', error);
        // Show error message
      }
    });
  }
}
