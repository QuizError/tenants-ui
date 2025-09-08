import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
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
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
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

  get showForm(): boolean {
    return !this.loading && this.client !== null;
  }

  loadClient(): void {
    this.loading = true;
    this.error = '';
    
    this.clientService.getClientByUid(this.clientUid).subscribe({
      next: (response: any) => {
        try {
          if (response && response.status === true && response.data) {
            this.client = response.data;
            this.populateForm(this.client);
          } else {
            this.error = response?.message || 'Invalid client data received';
            console.error('Invalid client data structure:', response);
          }
        } catch (e) {
          this.error = 'Error processing client data';
          console.error('Error in process response:', e);
        } finally {
          this.loading = false;
          this.cdr.detectChanges(); // Force change detection
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load client data. Please try again.';
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection
        console.error('API Error:', err);
      }
    });
  }
  

  populateForm(client: Client | null): void {
    if (!client || !client.user) return;
    
    this.clientForm.patchValue({
      firstname: client.user.firstname,
      lastname: client.user.lastname,
      middleName: client.user.middleName,
      email: client.user.email,
      msisdn: client.user.msisdn,
      idNumber: client.user.idNumber,
      gender: client.user.gender,
      occupation: client.occupation,
      dob: client.dob ? formatDate(client.dob, 'yyyy-MM-dd', 'en-US') : ''
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid && this.client) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const formData = this.clientForm.value;
      
      // Prepare data for the save API
      const clientToSave = {
        uid: this.client.uid,  // Include the client UID for update
        userUid: this.client.user.uid,  // Include the user UID for update
        firstname: formData.firstname,
        lastname: formData.lastname,
        middleName: formData.middleName,
        msisdn: formData.msisdn,
        email: formData.email,
        idNumber: formData.idNumber,
        gender: formData.gender,
        occupation: formData.occupation,
        dob: formData.dob
      };

      this.clientService.updateClient(clientToSave).subscribe({
        next: (response) => {
          this.loading = false;
          this.success = 'Client updated successfully!';
          setTimeout(() => {
            this.router.navigate(['/clients']);
          }, 2000);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Failed to update client. Please try again.';
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
    this.router.navigate(['/clients',this.clientUid]);
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
