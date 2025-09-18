import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <!-- Loading State -->
      <div *ngIf="loading" class="text-center p-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="mt-2">Loading user data...</div>
      </div>

      <!-- Error State -->
      <div *ngIf="!loading && !user" class="alert alert-warning">
        Failed to load user data. Please try again later.
      </div>

      <!-- User Data -->
      <div *ngIf="!loading && user" class="card">
        <div class="card-body">
          <div class="text-center mb-4">
            <div class="avatar-circle mb-3">
              <span class="initials">
                {{ user.firstname.charAt(0) || '' }}{{ user.lastname.charAt(0) || '' }}
              </span>
            </div>
            <h3 class="mb-1">{{ user.firstname }} {{ user.middleName || '' }} {{ user.lastname }}</h3>
            <div class="text-muted">
              <span class="badge" [ngClass]="user.userType === 'INTERNAL' ? 'bg-primary' : 'bg-secondary'">
                {{ user.userType }}
              </span>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <h5 class="text-muted mb-3">Personal Information</h5>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <strong>Email:</strong>
                  <div class="text-muted">{{ user.email || 'N/A' }}</div>
                </li>
                <li class="mb-2">
                  <strong>Phone:</strong>
                  <div class="text-muted">{{ user.msisdn || user.mobileNo || 'N/A' }}</div>
                </li>
                <li class="mb-2">
                  <strong>ID Number:</strong>
                  <div class="text-muted">{{ user.idNumber || 'N/A' }}</div>
                </li>
              </ul>
            </div>
            <div class="col-md-6 mb-3">
              <h5 class="text-muted mb-3">Account Information</h5>
              <ul class="list-unstyled">
                <li class="mb-2">
                  <strong>Account Type:</strong>
                  <div class="text-muted">{{ user.userType || 'N/A' }}</div>
                </li>
                <li class="mb-2">
                  <strong>Status:</strong>
                  <span class="badge" [ngClass]="user.active ? 'bg-success' : 'bg-danger'">
                    {{ user.active ? 'Active' : 'Inactive' }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-circle {
      width: 80px;
      height: 80px;
      background-color: #e9ecef;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-size: 32px;
      font-weight: bold;
      color: #6c757d;
    }
    
    .badge {
      font-size: 0.8em;
      padding: 0.35em 0.65em;
    }
  `]
})
export class UserViewComponent implements OnInit {
  user: User | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    console.log('Initializing with user ID:', userId);
    if (userId) {
      this.loadUser(userId);
    } else {
      this.loading = false;
      this.router.navigate(['/users']);
    }
  }

  loadUser(userId: string): void {
    console.log('1. Starting to load user with ID:', userId);
    this.loading = true;
    
    this.userService.getUser(userId).subscribe({
      next: (user: User) => {
        console.log('2. Received user data in component:', user);
        if (user && user.uid) {
          console.log('3. Setting user data to component property');
          this.user = user;
          console.log('4. User data set:', this.user);
        } else {
          console.error('5. Invalid user data received:', user);
        }
        this.loading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (error) => {
        console.error('6. Error in subscription:', error);
        this.loading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
        this.router.navigate(['/users']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  copyToClipboard(text: string): void {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here if you have one
      console.log('Copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }
}
