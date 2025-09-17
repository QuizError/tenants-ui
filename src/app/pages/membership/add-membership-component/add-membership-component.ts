import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user-service';
import { OwnershipService } from '../../../services/ownership-service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-membership-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './add-membership-component.html',
  styleUrls: ['./add-membership-component.css']
})
export class AddMembershipComponent implements OnInit {
  addMemebrshipForm: FormGroup;
  groupDataList: any[] = [];
  userDataList: any[] = [];
  loading = true;
  error: string | null = null;
  user: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService, 
    private ownershipService: OwnershipService,
    private cdr: ChangeDetectorRef
  ) {
    this.addMemebrshipForm = this.fb.group({
      userUid: ['', []],
      groupUid: ['', []],
      memberStatus: ['ACTIVE', []]
    });
  }

  ngOnInit(): void {
    this.loadUser();
    this.loadData();
  }

  private loadUser(): void {
    try {
      const savedUser = localStorage.getItem('employeeApp');
      this.user = savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.router.navigate(['/login']);
    }
  }

  private loadData(): void {
    console.log('Starting to load data...');
    this.loading = true;
    this.error = null;
    
    // Track if all operations completed
    let usersLoaded = false;
    let groupsLoaded = false;

    const checkLoadingComplete = () => {
      console.log('Checking loading state. Users:', usersLoaded, 'Groups:', groupsLoaded);
      if (usersLoaded && groupsLoaded) {
        console.log('All data loaded, stopping loading spinner');
        this.loading = false;
        this.cdr.detectChanges();
      }
    };

    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (this.loading) {
        console.error('Loading timeout reached. Current state - usersLoaded:', usersLoaded, 'groupsLoaded:', groupsLoaded);
        this.error = 'Loading is taking longer than expected. Please check your connection and try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    }, 10000); // 10 seconds timeout

    // Load users
    console.log('Fetching users from:', this.userService.getUserDataList());
    this.userService.getUserDataList().subscribe({
      next: (res: any) => {
        console.log('Users API Response:', res);
        this.userDataList = Array.isArray(res) ? res : [];
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = 'Failed to load users. Please try again later.';
        usersLoaded = true;
        checkLoadingComplete();
      },
      complete: () => {
        console.log('Users loaded successfully');
        usersLoaded = true;
        clearTimeout(loadingTimeout);
        checkLoadingComplete();
      }
    });

    // Load groups
    console.log('Fetching groups from ownership service');
    this.ownershipService.getGroupOwnershipData().subscribe({
      next: (res: any) => {
        console.log('Groups API Response:', res);
        this.groupDataList = Array.isArray(res) ? res : [];
      },
      error: (error) => {
        console.error('Error loading groups:', error);
        this.error = 'Failed to load groups. Please try again later.';
        groupsLoaded = true;
        checkLoadingComplete();
      },
      complete: () => {
        console.log('Groups loaded successfully');
        groupsLoaded = true;
        clearTimeout(loadingTimeout);
        checkLoadingComplete();
      }
    });
  }

  onSubmit(): void {
    if (this.addMemebrshipForm.invalid) {
      return;
    }

    this.loading = true;
    this.ownershipService.postGroupMembershipData(this.addMemebrshipForm.value).subscribe({
      next: () => {
        this.router.navigate(['/memberships']);
      },
      error: (error) => {
        console.error('Error creating membership:', error);
        this.error = 'Failed to create membership. Please try again.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/memberships']);
  }
}
