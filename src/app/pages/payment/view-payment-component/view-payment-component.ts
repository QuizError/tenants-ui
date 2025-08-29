import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { BillService } from '../../../services/bill-service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-view-payment-component',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './view-payment-component.html',
  styleUrls: ['./view-payment-component.css']
})
export class ViewPaymentComponent implements OnInit {
  payment: any;
  bill: any;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private billService: BillService
  ) {}

  ngOnInit(): void {
    const paymentUid = this.route.snapshot.paramMap.get('uid');
    if (paymentUid) {
      this.loadPayment(paymentUid);
    } else {
      this.error = 'No payment UID provided';
      this.loading = false;
    }
  }

  loadPayment(uid: string): void {
    this.paymentService.getPaymentByUid(uid).subscribe({
      next: (payment) => {
        this.payment = payment;
        if (payment.billUid) {
          this.loadBill(payment.billUid);
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error loading payment:', err);
        this.error = 'Failed to load payment details';
        this.loading = false;
      }
    });
  }

  loadBill(uid: string): void {
    this.billService.getBillByUid(uid).subscribe({
      next: (bill) => {
        this.bill = bill;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bill:', err);
        // Continue even if bill fails to load
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  goBack(): void {
    this.router.navigate(['/payments']);
  }

  printReceipt(): void {
    window.print();
  }
}
