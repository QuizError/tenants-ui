import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { OwnershipService } from '../../../services/ownership-service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GroupOwnership } from '../../../interfaces/group-ownership';
import { Membership } from '../../../interfaces/membership';

interface User {
  uid: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface Group {
  uid: string;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-membership-management',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatOptionModule
  ],
  template: `
   <div class="container-fluid py-4">
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h3 class="mb-0">
        <i class="fas fa-users me-2 text-primary"></i>
        Membership Management
      </h3>
      <button 
        class="btn btn-primary"
        [routerLink]="['/add-membership']"
        *ngIf="user?.role === 'Admin' || user?.role === 'MANAGER'"
      >
        <i class="fas fa-plus me-2"></i>Add Membership
      </button>
    </div>
    
    <div class="card-body">
      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading memberships...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !members.length" class="text-center py-5">
        <div class="empty-state">
          <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
          <h4>No Membership Found</h4>
          <p class="text-muted">There are no memberships available at the moment.</p>
          <button 
            *ngIf="user?.role === 'Admin' || user?.role === 'MANAGER'"
            class="btn btn-primary"
            [routerLink]="['/add-membership']"
          >
            <i class="fas fa-plus me-2"></i>Create First Membership
          </button>
        </div>
      </div>

      <!-- Groups Table -->
      <div *ngIf="!loading && members.length" class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th scope="col" class="text-center" style="width: 60px;">#</th>
              <th scope="col">Member name</th>
              <th scope="col">Group name</th>
              <th scope="col">Ownership Type</th>
              <th scope="col">Created Date</th>
              <th scope="col" class="text-center">Status</th>
              <th scope="col" class="text-end" style="width: 150px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let member of members; let i = index">
              <td class="text-center fw-semibold">{{ i + 1 }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <div>
                    <h6 class="mb-0">{{ member.user.firstname }} {{ member.user.middleName }} {{ member.user.lastname }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div>
                    <h6 class="mb-0">{{ member.group.name }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div>
                    <h6 class="mb-0">{{ member.group.ownershipType }}</h6>
                  </div>
                </div>
              </td>
              <td>{{ member.createdAt | date:'mediumDate' }}</td>
              <td class="text-center">
                <span 
                  class="badge" 
                  [ngClass]="member.active ? 'bg-soft-success text-success' : 'bg-soft-danger text-danger'"
                >
                  {{ member.active ? 'ACTIVE' : 'INACTIVE' }}
                </span>
              </td>
              <td class="text-end">
                <div class="btn-group" role="group">
                  <button 
                    type="button" 
                    class="btn btn-sm btn-outline-primary"
                    [routerLink]="['/update-membership', member.uid]"
                  >
                    <i class="fas fa-pencil me-1"></i> Edit
                  </button>
                  <button 
                    *ngIf="user?.role === 'ADMIN'"
                    type="button" 
                    class="btn btn-sm btn-outline-secondary"
                    [routerLink]="['/update-membership', member.uid]"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Pagination -->
    <div class="card-footer d-flex justify-content-between align-items-center" *ngIf="members.length > 0">
      <div class="text-muted">
        Showing <strong>{{ members.length }}</strong> of <strong>{{ members.length }}</strong> memberships
      </div>
      <nav>
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
          </li>
          <li class="page-item active"><a class="page-link" href="#">1</a></li>
          <li class="page-item">
            <a class="page-link" href="#">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</div>
  `
})
export class MembershipManagementComponent implements OnInit {
  users: User[] = [];
  groups: GroupOwnership[] = [];
  members: Membership[] = [];
  loading = true;
  user: any;
  error: string | null = null;

  constructor(
    private ownershipService: OwnershipService, 
    private cdr: ChangeDetectorRef, 
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadMemberships();
  }

  private loadUser(): void {
    try {
      const savedUser = localStorage.getItem('employeeApp');
      this.user = savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.toastr.error('Failed to load user data', 'Error');
      this.router.navigate(['/login']);
    }
  }

  loadMemberships(): void {

    this.loading = true;
    this.error = null;

    this.ownershipService.getGroupMembersData().subscribe({
      next: (members: Membership[]) => {
        this.members = members || [];
        
        if (this.members.length === 0) {
          this.toastr.info('No memberships found', 'Information');
        }
        console.log(this.members);
        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading memberships:', error);
        this.error = 'Failed to load memberships. Please try again later.';
        this.toastr.error(this.error, 'Error');
        this.members = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onViewMembership(groupId: string): void {
    if (!groupId) {
      this.toastr.warning('Invalid group ID', 'Warning');
      return;
    }
    this.router.navigate(['/membership', groupId]);
  }

  onEditMembership(groupId: string, event: Event): void {
    event.stopPropagation();
    if (!groupId) {
      this.toastr.warning('Invalid group ID', 'Warning');
      return;
    }
    this.router.navigate(['/update-membership', groupId]);
  }

  onCreateNew(): void {
    this.router.navigate(['/add-membership']);
  }

  // Helper method to check if user has admin role
  get isAdmin(): boolean {
    return this.user?.role === 'Admin';
  }

  // Helper method to check if user has manager role
  get isManager(): boolean {
    return this.user?.role === 'MANAGER';
  }
}

