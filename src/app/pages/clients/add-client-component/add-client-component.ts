import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from '../../../interfaces/client';
import { ClientService } from '../../../services/client-service';

@Component({
  selector: 'app-add-client-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-client-component.html',
  styleUrl: './add-client-component.css'
})
export class AddClientComponent {
  clientForm: FormGroup;
  loading: boolean = false;
  error: string = '';
  success: string = '';
  currentUserUid: string = '';
  user: any;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      email: ['', [Validators.required, Validators.email]],
      msisdn: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      idNumber: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      occupation: [''],
      dob: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const savedUser = localStorage.getItem('employeeApp');
    console.log({savedUser});
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.currentUserUid = this.user.uid;
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const payload = {
        ...this.clientForm.value,
        ownerUid: this.currentUserUid,
      } as any;

      this.clientService.postClientData(payload).subscribe({
        next: (response) => {
          this.loading = false;
          this.success = 'Client added successfully!';
          setTimeout(() => {
            this.router.navigate(['/clients']);
          }, 2000);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Failed to add client. Please try again.';
          console.error('Error adding client:', err);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.clientForm.controls).forEach(key => {
      const control = this.clientForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }

  getFieldError(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) return 'Please enter a valid phone number';
    }
    return '';
  }
}
