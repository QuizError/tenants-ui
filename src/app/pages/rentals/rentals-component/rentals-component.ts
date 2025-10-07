import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Rental } from '../../../interfaces/rental';
import { RentalService } from '../../../services/rental-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-rentals-component',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule, MatIconModule, RouterModule],
  templateUrl: './rentals-component.html',
  styleUrls: ['./rentals-component.css']
})
export class RentalsComponent implements OnInit {

  displayedColumns: string[] = [
    'clientName',
    'propertyName',
    'unitName',
    'unitSectionName',
    'clientMobile',
    'daysLeft',
    'endDate',
    'rentalStatus'
  ];
  dataSource = new MatTableDataSource<Rental>();
  loading = true;
  error: string | null = null;
  user: any;
  rentalType: 'ending' | 'expired' = 'ending';
  pageTitle = 'Rentals Ending This Month';
  daysColumnName = 'Days Left';

  constructor(
    private rentalService: RentalService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const savedUser = localStorage.getItem('employeeApp');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.loadEndingRentals(this.user.uid);
      this.loadExpiredRentals(this.user.uid);
    }
    this.route.queryParamMap.subscribe((params) => {
      this.rentalType = params.get('type') as 'ending' | 'expired' || 'ending';
      this.pageTitle = this.rentalType === 'ending' ? 'Rentals Ending This Month' : 'Expired Rentals';
      this.daysColumnName = this.rentalType === 'ending' ? 'Days Left' : 'Days Exceeded';  // Update column name
      this.loadRentals();
    });
  }

  loadEndingRentals(uid: string): void {
    this.loading = true;
    this.error = null;
    this.rentalService.getPropertyRentalsEndingThisMonthByOwnerUid(uid).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load rentals data.';
        this.loading = false;
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  loadExpiredRentals(uid: string): void {
    this.loading = true;
    this.error = null;
    this.rentalService.getExpiredPropertyRentalsContractsByOwnerUid(uid).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load expired rentals data.';
        this.loading = false;
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  loadRentals(): void {
    if (this.rentalType === 'ending') {
      this.loadEndingRentals(this.user.uid);
    } else {
      this.loadExpiredRentals(this.user.uid);
    }
  }

  // getDaysLeft(endDate: string): number {
  //   const today = new Date();
  //   const end = new Date(endDate);
  //   const diffTime = Math.abs(end.getTime() - today.getTime());
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   return diffDays;
  // }
  
  getDaysLeft(endDate: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // For expired rentals, return positive number of days exceeded
    // For ending rentals, return 0 if the date is today or in the past
    if (this.rentalType === 'expired') {
      return Math.max(0, -diffDays);
    } else {
      return Math.max(0, diffDays);
    }
  }
  
}
