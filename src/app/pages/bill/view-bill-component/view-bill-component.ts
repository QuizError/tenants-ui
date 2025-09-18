import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Bill } from '../../../interfaces/bill';
import { BillService } from '../../../services/bill-service';
import { PaymentService } from '../../../services/payment-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-bill-component',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './view-bill-component.html',
  styleUrls: ['./view-bill-component.css']
})
export class ViewBillComponent implements OnInit {
  bill: Bill | null = null;
  loading = false;
  error: string | null = null;
  makingPayment = false;
  paymentError: string | null = null;
  showPaymentModal = false;
  paymentForm = {
    paidAmount: 2000000,
    paymentChannel: 'CASH',
    billReferenceNumber: '',
    thirdPartyReference: 'CRDB107',
    fspName: 'CRDB BANK',
    fspCode: 'CORUTZTZ',
    currency: 'TZS'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billService: BillService,
    private cdr: ChangeDetectorRef,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const uid = this.route.snapshot.paramMap.get('id'); // route uses ':id'
    if (uid) {
      this.fetchBill(uid);
    } else {
      this.error = 'No bill id provided';
      this.cdr.detectChanges();
    }
  }

  fetchBill(uid: string): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.billService.getBillByUid(uid).subscribe({
      next: (data: Bill | any) => {
        // Backend shape: { status, responseCode, message, data: Bill }
        const payload = (data && (data.data ?? data)) as Bill;
        this.bill = payload as Bill;
        // Prefill form fields from bill
        this.paymentForm.billReferenceNumber = this.bill?.billReferenceNumber ?? '';
        this.paymentForm.currency = this.bill?.currency ?? 'TZS';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        // Fallback to mock example provided
        this.bill = {
          uid: '3f4962da-774e-45b1-b00c-28104b9d88a5',
          createdAt: '2025-08-25T09:22:13.851416',
          totalAMount: 2000000,
          paidAmount: 2000000,
          amountDue: 0,
          totalEquivalentAmount: 2000000,
          agentFee: 500000,
          commission: 15000,
          billReferenceNumber: '1816250825092213',
          thirdPartyReference: 'CRDB106',
          billDescription: 'Bill of Wing B apartment of Nyumba Two from 2025-09-01 to 2025-12-31',
          billType: 'RENTALS',
          currency: 'TZS',
          billStatus: 'Paid',
          customerName: 'Sample Customer',
          customerUid: '00000000-0000-0000-0000-000000000000'
        };
        this.paymentForm.paidAmount = this.bill?.totalAMount ?? 2000000;
        this.paymentForm.billReferenceNumber = this.bill?.billReferenceNumber ?? '';
        this.paymentForm.currency = this.bill?.currency ?? 'TZS';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openPaymentModal(): void {
    if (!this.bill) return;
    // Ensure bill-derived fields are set
    this.paymentForm.paidAmount = this.bill?.totalAMount ?? 2000000;
    this.paymentForm.billReferenceNumber = this.bill?.billReferenceNumber ?? '';
    this.paymentForm.currency = this.bill?.currency ?? 'TZS';
    this.paymentError = null;
    this.showPaymentModal = true;
    this.cdr.detectChanges();
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.cdr.detectChanges();
  }

  submitPayment(): void {
    if (!this.bill) return;
    this.makingPayment = true;
    this.paymentError = null;
    this.cdr.detectChanges();

    const payload = { ...this.paymentForm } as any;

    this.paymentService.savePaymentData(payload).subscribe({
      next: () => {
        // Refresh bill to reflect updated status
        const uid = this.route.snapshot.paramMap.get('id');
        if (uid) {
          this.fetchBill(uid);
        }
        this.makingPayment = false;
        this.showPaymentModal = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Payment failed', err);
        this.paymentError = 'Payment failed. Please try again.';
        this.makingPayment = false;
        this.cdr.detectChanges();
      }
    });
  }

  isWaitingForPayment(){
    return this.bill?.billStatus === 'WaitingForPayment';
  }

  back(): void {
    this.router.navigate(['/bills']);
  }
}
