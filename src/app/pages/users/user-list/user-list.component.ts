import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <a routerLink="/users/add" class="btn btn-primary">
          <i class="fas fa-plus me-2"></i>Add New User
        </a>
      </div>

      <div class="card">
        <div class="card-body">
          <!-- Search and Filters -->
          <div class="row mb-3">
            <div class="col-md-4">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Search users..." 
                       [(ngModel)]="searchTerm" (keyup.enter)="onSearch()">
                <button class="btn btn-outline-secondary" type="button" (click)="onSearch()">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filters.userType" (change)="applyFilters()">
                <option [ngValue]="null">All User Types</option>
                <option value="TENANT">Tenant</option>
                <option value="ADMIN">Admin</option>
                <option value="FINANCE">Finance</option>
                <option value="OWNER">Owner</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filters.active" (change)="applyFilters()">
                <option [ngValue]="null">All Statuses</option>
                <option [ngValue]="true">Active</option>
                <option [ngValue]="false">Inactive</option>
              </select>
            </div>
            <div class="col-md-2">
              <button class="btn btn-outline-secondary w-100" (click)="resetFilters()">
                <i class="fas fa-undo me-1"></i> Reset
              </button>
            </div>
          </div>
          
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>ID Number</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users">
                  <td>{{ user.firstname }} {{ user.middleName || '' }} {{ user.lastname }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ formatPhoneNumber(user.msisdn) }}</td>
                  <td>{{ user.idNumber || 'N/A' }}</td>
                  <td>
                    <span class="badge" [ngClass]="getUserTypeClass(user.userType)">
                      {{ user.userType }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="user.active ? 'bg-success' : 'bg-danger'">
                      {{ user.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <a [routerLink]="['/users', user.uid, 'view']" class="btn btn-outline-primary">
                        <i class="fas fa-eye"></i>
                      </a>
                      <a [routerLink]="['/users', user.uid, 'edit']" class="btn btn-outline-secondary">
                        <i class="fas fa-edit"></i>
                      </a>
                      <button (click)="deleteUser(user.uid)" class="btn btn-outline-danger" [disabled]="user.deleted">
                        <i class="fas" [ngClass]="user.deleted ? 'fa-ban' : 'fa-trash'"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="!loading && users.length === 0">
                  <td colspan="7" class="text-center py-4">No users found</td>
                </tr>
                <tr *ngIf="loading">
                  <td colspan="7" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="d-flex justify-content-between align-items-center mt-3" *ngIf="pageData.totalElements > 0">
            <div class="text-muted">
              Showing {{ (pageData.number * pageData.size) + 1 }} to 
              {{ Math.min((pageData.number + 1) * pageData.size, pageData.totalElements) }} 
              of {{ pageData.totalElements }} entries
            </div>
            <nav>
              <ul class="pagination mb-0">
                <li class="page-item" [class.disabled]="pageData.first">
                  <a class="page-link" (click)="onPageChange(0)">First</a>
                </li>
                <li class="page-item" [class.disabled]="pageData.first">
                  <a class="page-link" (click)="onPageChange(pageData.number - 1)">Previous</a>
                </li>
                
                <li class="page-item" *ngFor="let p of getPageNumbers()" [class.active]="p === pageData.number">
                  <a class="page-link" (click)="onPageChange(p)">{{ p + 1 }}</a>
                </li>
                
                <li class="page-item" [class.disabled]="pageData.last">
                  <a class="page-link" (click)="onPageChange(pageData.number + 1)">Next</a>
                </li>
                <li class="page-item" [class.disabled]="pageData.last">
                  <a class="page-link" (click)="onPageChange(pageData.totalPages - 1)">Last</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge {
      font-size: 0.8em;
      padding: 0.35em 0.65em;
    }
    .btn-group-sm .btn {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
    }
    .page-link {
      cursor: pointer;
    }
    .bg-tenant { background-color: #6c757d; }
    .bg-admin { background-color: #0d6efd; }
    .bg-finance { background-color: #6f42c1; }
    .bg-owner { background-color: #fd7e14; }
  `]
})
export class UserListComponent implements OnInit {
  // Make Math available in the template
  Math = Math;
  
  users: User[] = [];
  loading = true;
  searchTerm = '';
  
  // Filters
  filters = {
    userType: null as string | null,
    active: null as boolean | null
  };

  // Pagination
  pageData = {
    number: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false
  };

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    
    const searchRequest: any = {
      pageNumber: this.pageData.number,
      pageSize: this.pageData.size,
      searchTerm: this.searchTerm || undefined
    };

    // Add filters if they have values
    if (this.filters.userType) {
      searchRequest.userType = this.filters.userType;
    }
    if (this.filters.active !== null) {
      searchRequest.active = this.filters.active;
    }

    this.userService.searchUsers(searchRequest).subscribe({
      next: (response: any) => {
        this.users = response.content || [];
        this.pageData = {
          ...this.pageData,
          number: response.pageable?.pageNumber || 0,
          size: response.pageable?.pageSize || 10,
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 0,
          first: response.first ?? true,
          last: response.last ?? false
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.pageData.totalPages && page !== this.pageData.number) {
      this.pageData.number = page;
      this.loadUsers();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, this.pageData.number - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.pageData.totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  onSearch(): void {
    this.pageData.number = 0; // Reset to first page when searching
    this.loadUsers();
  }

  applyFilters(): void {
    this.pageData.number = 0; // Reset to first page when filters change
    this.loadUsers();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filters = {
      userType: null,
      active: null
    };
    this.pageData.number = 0;
    this.loadUsers();
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  getUserTypeClass(userType: string): string {
    switch (userType?.toUpperCase()) {
      case 'INTERNAL':
        return 'bg-admin';
      case 'TENANT':
        return 'bg-tenant';
      default:
        return 'bg-secondary';
    }
  }

  formatPhoneNumber(msisdn: string): string {
    if (!msisdn) return 'N/A';
    // Remove any non-digit characters and take last 9 digits
    const last9Digits = msisdn.replace(/\D/g, '').slice(-9);
    return last9Digits ? `0${last9Digits}` : 'N/A';
  }
}
