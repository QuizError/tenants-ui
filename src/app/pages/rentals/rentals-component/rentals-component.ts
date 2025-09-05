import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Rental } from '../../../interfaces/rental';
import { RentalService } from '../../../services/rental-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

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
    'unitName',
    'unitSectionName',
    'startDate',
    'endDate',
    'price',
    'rentalStatus'
  ];
  dataSource = new MatTableDataSource<Rental>();
  loading = true;
  error: string | null = null;
  user: any;

  constructor(
    private rentalService: RentalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const savedUser = localStorage.getItem('employeeApp');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.loadEndingRentals(this.user.uid);
    }
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
}
