import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize } from 'rxjs/operators';
import { Payment, PaymentResponse } from '../../../interfaces/payment';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-payments-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './payments-component.html',
  styleUrls: ['./payments-component.css']
})
export class PaymentsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'index',
    'paymentDate',
    'billReferenceNumber',
    'thirdPartyReference',
    'paidAmount',
    'paymentChannel',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<Payment>([]);
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 100];
  
  loading = false;
  error: string | null = null;

  constructor(private paymentService: PaymentService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges();
  }

  loadPayments(): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.paymentService.getPayments(this.pageIndex, this.pageSize)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: PaymentResponse) => {
          this.dataSource.data = response.content || [];
          this.totalItems = response.totalElements || 0;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading payments:', err);
          this.error = 'Failed to load payments. Please try again later.';
          this.useMockData();
          this.cdr.detectChanges();
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPayments();
  }

  onSortChange(sort: Sort): void {
    // Reset to first page when sorting
    this.pageIndex = 0;
    this.loadPayments();
  }

  getStatusBadgeClass(status: string | undefined): string {
    if (!status) return 'badge bg-secondary';
    
    switch (status) {
      case 'Paid':
        return 'badge bg-success';
      case 'PartyPaid':
        return 'badge bg-warning';
      case 'Failed':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  // Compute serial number respecting pagination
  getRowNumber(payment: Payment): number {
    const localIndex = this.dataSource.data.indexOf(payment);
    return this.pageIndex * this.pageSize + (localIndex >= 0 ? localIndex + 1 : 0);
  }

  // For development/testing when API is not available
  private useMockData(): void {
    const mockPayments: Payment[] = [
      {
        uid: 'eaf5560e-6029-408e-8067-a3cfba8ea3ed',
        billUid: 'a0591dc9-7f20-48b3-9b07-c2937c623c8e',
        fspName: 'CRDB BANK',
        fspCode: 'CORUTZTZ',
        currency: 'TZS',
        amountDue: 0,
        paidAmount: 1500000,
        billReferenceNumber: '1813250823152909',
        thirdPartyReference: 'CRDB101',
        paymentDate: new Date().toISOString(),
        paymentChannel: 'CASH',
        status: 'Paid'
      },
    ];

    this.dataSource.data = mockPayments;
    this.totalItems = mockPayments.length;
  }
}
