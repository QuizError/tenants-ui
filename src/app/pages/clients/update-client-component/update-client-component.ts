import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Client } from '../../../interfaces/client';
import { ClientService } from '../../../services/client-service';

@Component({
  selector: 'app-update-client-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-client-component.html',
  styleUrl: './update-client-component.css'
})
export class UpdateClientComponent implements OnInit {
  clientForm: FormGroup;
  loading: boolean = false;
  error: string = '';
  success: string = '';
  currentUserUid: string = '';
  clientUid: string = '';
  user: any;
  client: Client | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
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
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.currentUserUid = this.user.uid;
    } else {
      this.router.navigate(['/login']);
      return;
    }

    this.clientUid = this.route.snapshot.paramMap.get('uid') || '';
    if (this.clientUid) {
      this.loadClient();
    } else {
      this.router.navigate(['/clients']);
    }
  }

  loadClient(): void {
    this.loading = true;
    this.clientService.getClientByUid(this.clientUid).subscribe({
      next: (client: Client) => {
        this.client = client;
        console.log(client)
        this.populateForm(client);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load client data. Please try again.';
        this.loading = false;
        console.error('Error loading client:', err);
      }
    });
  }

  populateForm(client: Client): void {
    this.clientForm.patchValue({
      firstname: client.user.firstname,
      lastname: client.user.lastname,
      middleName: client.user.middleName,
      email: client.user.email,
      msisdn: client.user.msisdn,
      idNumber: client.user.idNumber,
      gender: client.user.gender,
      occupation: client.occupation,
      dob: client.dob
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid && this.client) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const formData = this.clientForm.value;
      const updatedClient: Client = {
        ...this.client,
        user: {
          ...this.client.user,
          firstname: formData.firstname,
          lastname: formData.lastname,
          middleName: formData.middleName,
          email: formData.email,
          msisdn: formData.msisdn,
          idNumber: formData.idNumber,
          gender: formData.gender
        },
        occupation: formData.occupation,
        dob: formData.dob
      };

      this.clientService.postClientData(updatedClient).subscribe({
        next: (response) => {
          this.loading = false;
          this.success = 'Client updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/clients']);
          }, 2000);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Failed to update client. Please try again.';
          console.error('Error updating client:', err);
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
