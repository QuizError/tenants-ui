import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Bill } from '../../../interfaces/bill';
import { BillService } from '../../../services/bill-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bills-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bills-component.html',
  styleUrls: ['./bills-component.css']
})
export class BillsComponent implements OnInit {
  bills: Bill[] = [];
  loading = false;
  error: string | null = null;
  user: any;

  constructor(private billService: BillService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    const savedUser = localStorage.getItem('employeeApp');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
    this.loadBills();
  }

  loadBills(): void {
    if (!this.user || !this.user.uid) {
      this.error = 'User not authenticated';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.billService.getBillsData(this.user.uid).subscribe({
      next: (data: any) => {
        // Support: [] or { data: Bill[] } or { dataList: Bill[] }
        const list: Bill[] = Array.isArray(data)
          ? data
          : (data?.dataList ?? data?.data ?? []);
        this.bills = list && list.length ? list : this.mockBills();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.bills = this.mockBills();
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private mockBills(): Bill[] {
    return [];
  }
}
