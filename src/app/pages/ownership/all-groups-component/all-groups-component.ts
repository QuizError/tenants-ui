import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OwnershipService } from '../../../services/ownership-service';
import { GroupOwnership } from '../../../interfaces/group-ownership';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-groups-component',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './all-groups-component.html',
  styleUrls: ['./all-groups-component.css']
})
export class AllGroupsComponent implements OnInit {
  groupsData: GroupOwnership[] = [];
  loading = true;
  error: string | null = null;
  user: any;

  constructor(
    private ownershipService: OwnershipService, 
    private cdr: ChangeDetectorRef, 
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadGroups();
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

  loadGroups(): void {
    if (!this.user?.uid) {
      this.error = 'User not authenticated';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = null;

    this.ownershipService.getGroupOwnershipData().subscribe({
      next: (groups: GroupOwnership[]) => {
        this.groupsData = groups || [];
        
        if (this.groupsData.length === 0) {
          this.toastr.info('No groups found', 'Information');
        }
        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading groups:', error);
        this.error = 'Failed to load groups. Please try again later.';
        this.toastr.error(this.error, 'Error');
        this.groupsData = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onViewGroup(groupId: string): void {
    if (!groupId) {
      this.toastr.warning('Invalid group ID', 'Warning');
      return;
    }
    this.router.navigate(['/group', groupId]);
  }

  onEditGroup(groupId: string, event: Event): void {
    event.stopPropagation();
    if (!groupId) {
      this.toastr.warning('Invalid group ID', 'Warning');
      return;
    }
    this.router.navigate(['/groups/edit', groupId]);
  }

  onCreateNew(): void {
    this.router.navigate(['/groups/new']);
  }

  // Helper method to check if user has admin role
  get isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }

  // Helper method to check if user has manager role
  get isManager(): boolean {
    return this.user?.role === 'MANAGER';
  }
}
