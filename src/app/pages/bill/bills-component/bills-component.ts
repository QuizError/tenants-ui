import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Bill } from '../../../interfaces/bill';
import { BillService } from '../../../services/bill-service';

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

  constructor(private billService: BillService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.billService.getBillsData().subscribe({
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
    return [
      {
        uid: '3f4962da-774e-45b1-b00c-28104b9d88a5',
        createdAt: '2025-08-25T09:22:13.851416',
        totalAMount: 2000000,
        amountDue: 0,
        totalEquivalentAmount: 2000000,
        agentFee: 500000,
        commission: 15000,
        billReferenceNumber: '1816250825092213',
        thirdPartyReference: 'CRDB106',
        billDescription: 'Bill of Wing B apartment of Nyumba Two from 2025-09-01 to 2025-12-31',
        billType: 'RENTALS',
        currency: 'TZS',
        billStatus: 'Paid'
      }
    ];
  }
}
