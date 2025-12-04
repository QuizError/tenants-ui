import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client-service';
import { RentalService } from '../../../services/rental-service';
import { Client } from '../../../interfaces/client';
import { Rental } from '../../../interfaces/rental';
import { AddRentalModalComponent } from '../../rentals/add-rental-modal/add-rental-modal.component';
import { of } from 'rxjs';
import { catchError, finalize, timeout, switchMap, map } from 'rxjs/operators';
import { UnitSectionService } from '../../../services/unit-section-service';
import { UnitService } from '../../../services/unit-service';
import { PropertiesService } from '../../../services/properties-service';
import { OwnershipService } from '../../../services/ownership-service';
import { MatButtonModule } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { FormsModule } from '@angular/forms';
import { MatInput } from "@angular/material/input";
import { MatDialog } from '@angular/material/dialog';
import { NoticeView } from '../../../shared/components/notice-view/notice-view';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { enumToObjectArray } from '../../../shared/helpers/utils.functions';
import { NoticeType } from '../client.model';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-view-client-component',
  imports: [
    CommonModule, FormsModule,
    AddRentalModalComponent,
    MatButtonModule, MatIcon,
    MatFormField, MatLabel,
    MatInput, MatAutocompleteModule, MatSelect
],
  templateUrl: './view-client-component.html',
  styleUrl: './view-client-component.css'
})
export class ViewClientComponent implements OnInit {

  dialog = inject(MatDialog);

  clientData: Client | undefined;
  clientUid: string | null = null;
  loading: boolean = true;
  clientRentals: Rental[] = [];
  showAddRentalModal: boolean = false;
  loadingRentals: boolean = false;
  rentalError: string | null = null;

  // Contract modal state
  showContractModal: boolean = false;
  contractText: string = '';
  contractLoading: boolean = false;
  contractError: string | null = null;
  contractRental: Rental | null = null;
  now: Date = new Date();
  companyName: string = '';
  companyAddress: string = '';
  companyPhone: string = '';
  // Default logo shown if no company logo is available
  companyLogoUrl: string = '/tmis.png';
  // Safe tenant name for certificate display
  tenantNameForCert: string = '';

  addingNotice = signal(false);
  message = signal(undefined);
  details = signal(undefined);
  noticeType = signal(undefined);
  rentalUid = signal(undefined);

  noticeTypes = signal(enumToObjectArray(NoticeType));

  constructor(private router: Router,
    private clientService: ClientService,
    private rentalService: RentalService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private unitSectionService: UnitSectionService,
    private unitService: UnitService,
    private propertiesService: PropertiesService,
    private ownershipService: OwnershipService) {}

  ngOnInit(): void {
    this.clientUid = this.route.snapshot.paramMap.get('uid');
    if (this.clientUid) {
      this.clientService.getClientByUid(this.clientUid).subscribe({
        next: (response: any) => {
          this.clientData = response.data;
          this.loadClientRentals(); // Load rentals after client data is loaded
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching client:', error);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  loadClientRentals(): void {
    if (!this.clientUid) return;

    this.loadingRentals = true;
    this.rentalError = null;

    this.rentalService.getRentalsByClientUid(this.clientUid).subscribe({
      next: (rentals) => {
        this.clientRentals = rentals;
        this.loadingRentals = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading client rentals:', error);
        this.rentalError = 'Failed to load rentals';
        this.loadingRentals = false;
        this.cdr.detectChanges();
      }
    });
  }

  getCurrentRentals(): Rental[] {
    const today = new Date();
    return (this.clientRentals || []).filter(r => {
      const endOk = r.endDate ? new Date(r.endDate) >= today : true;
      const status = (r.rentalStatus || '').toUpperCase();
      const statusOk = status === 'ACTIVE' || status === 'NOT_ACTIVE' || status === '';
      return endOk || statusOk;
    });
  }

  getInitials(firstName: string, lastName: string): string {
    if (!firstName || !lastName) return '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }

  editClient(): void {
    if (this.clientData) {
      this.router.navigate(['/update-client/', this.clientData.uid]);
    }
  }

  deleteClient(): void {
    if (this.clientData && confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClientByUid(this.clientData.uid).subscribe({
        next: () => {
          console.log('Client deleted successfully');
          this.router.navigate(['/clients']);
        },
        error: (error) => {
          console.error('Error deleting client:', error);
        }
      });
    }
  }

  getRoomStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'expired':
        return 'status-expired';
      default:
        return 'status-default';
    }
  }

  formatCurrency(amount: number): string {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatCurrencyWith(amount?: number, currency: string = 'USD'): string {
    if (amount == null) return 'N/A';
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${currency}`;
    }
  }

  getPaymentStatusClass(status?: string): string {
    switch ((status || '').toLowerCase()) {
      case 'paid':
        return 'payment-paid';
      case 'waitingforpayment':
      case 'waiting_for_payment':
        return 'payment-pending';
      case 'failed':
        return 'payment-failed';
      case 'partypaid':
      case 'party_paid':
      case 'partiallypaid':
      case 'partialpaid':
      case 'partial_paid':
        return 'payment-partial';
      case 'overdue':
        return 'payment-overdue';
      default:
        return 'payment-default';
    }
  }

  getRentalStateClass(status?: string): string {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return 'rental-active';
      case 'not_active':
      case 'notactive':
        return 'rental-not-active';
      case 'expired':
      case 'completed':
        return 'rental-completed';
      default:
        return 'rental-default';
    }
  }

  getDamageSeverityClass(severity: string): string {
    switch (severity) {
      case 'low':
        return 'severity-low';
      case 'medium':
        return 'severity-medium';
      case 'high':
        return 'severity-high';
      case 'critical':
        return 'severity-critical';
      default:
        return 'severity-default';
    }
  }

  getReporterClass(reportedBy: string): string {
    switch (reportedBy) {
      case 'client':
        return 'reporter-client';
      case 'manager':
        return 'reporter-manager';
      default:
        return 'reporter-default';
    }
  }

  getDamageStatusClass(status: string): string {
    switch (status) {
      case 'reported':
        return 'damage-status-reported';
      case 'investigating':
        return 'damage-status-investigating';
      case 'in-repair':
        return 'damage-status-repair';
      case 'resolved':
        return 'damage-status-resolved';
      default:
        return 'damage-status-default';
    }
  }

  reportDamage(): void {
    if (this.clientData) {
      this.router.navigate(['/damages/report', this.clientData.uid]);
    }
  }

  getRentalStatus(endDate: string): string {
    const today = new Date();
    const end = new Date(endDate);
    return end >= today ? 'active' : 'completed';
  }

  viewRental(rentalUid: string): void {
    this.router.navigate(['/rentals', rentalUid]);
  }

  addRental(): void {
    this.showAddRentalModal = true;
  }

  onCloseRentalModal(): void {
    this.showAddRentalModal = false;
  }

  onRentalAdded(rental: Rental): void {
    this.clientRentals.push(rental);
    this.showAddRentalModal = false;
    this.cdr.detectChanges();
    // Ensure list is up to date (backend may enrich fields like unitSectionName)
    this.loadClientRentals();
  }

  // Eligibility: rental is ACTIVE and billStatus is Paid
  isEligibleForContract(rental: Rental): boolean {
    const status = (rental.rentalStatus || '').toLowerCase();
    const bill = (rental.billStatus || '').toLowerCase();
    return status === 'active' && bill === 'paid';
  }

  // Open modal and fetch latest rental (if needed) then compose contract text
  viewContract(rentalUid: string): void {
    this.contractError = null;
    this.contractLoading = true;
    this.showContractModal = true;
    this.contractText = '';
    this.contractRental = null;
    this.tenantNameForCert = '';

    this.rentalService
      .getRentalByUid(rentalUid)
      .pipe(
        timeout(10000),
        catchError((err) => {
          console.error('Failed to load rental for contract', err);
          // Fall back to any rental we already have to still show a statement
          const fallback = (this.clientRentals || []).find(r => r.uid === rentalUid);
          if (fallback) {
            this.contractRental = fallback;
            this.contractText = this.buildContractText(fallback);
            this.loadCertificateOrgInfo(fallback);
            this.tenantNameForCert = this.resolveTenantName(fallback);
          } else {
            this.contractError = 'Could not load contract details (network error or timeout).';
          }
          return of(null);
        }),
        finalize(() => {
          this.contractLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe((response: any) => {
        if (!response) return;
        const rental = (response && typeof response === 'object' && 'data' in response)
          ? (response.data as Rental)
          : (response as Rental);
        if (!rental) {
          this.contractError = 'Invalid contract response.';
          return;
        }
        this.contractRental = rental;
        this.contractText = this.buildContractText(rental);
        this.loadCertificateOrgInfo(rental);
        this.tenantNameForCert = this.resolveTenantName(rental);
      });
  }

  closeContract(): void {
    this.showContractModal = false;
    this.contractText = '';
    this.contractError = null;
    this.contractLoading = false;
    this.contractRental = null;
    this.tenantNameForCert = '';
  }

  printContract(): void {
    window.print();
  }

  private buildContractText(rental: Rental): string {
    const respClientName = (rental as any)?.clientName as string | undefined;
    const clientName = respClientName
      || (this.clientData ? `${this.clientData.user.firstname} ${this.clientData.user.lastname}` : 'The client');
    const unit = rental.unitName || rental.unitSectionName || 'the rented unit';
    const start = rental.startDate ? new Date(rental.startDate).toLocaleDateString() : 'N/A';
    const end = rental.endDate ? new Date(rental.endDate).toLocaleDateString() : 'N/A';
    return `This is to certify that ${clientName} is a valid tenant of ${unit} from ${start} to ${end}.`;
  }

  private resolveTenantName(rental: Rental): string {
    const nameFromApi = (rental as any)?.clientName as string | undefined;
    if (nameFromApi && nameFromApi.trim().length > 0) return nameFromApi.trim();
    const first = this.clientData?.user?.firstname ?? '';
    const last = this.clientData?.user?.lastname ?? '';
    return `${first} ${last}`.trim() || 'Tenant';
  }

  private loadCertificateOrgInfo(rental: Rental): void {
    // Reset to defaults first
    this.companyName = '';
    this.companyAddress = '';
    this.companyPhone = '';
    // Keep default logo; if backend provides a logo later, we can override companyLogoUrl here.
    const unitSectionUid = rental.unitSectionUid;
    if (!unitSectionUid) {
      return;
    }

    // unitSection -> unit -> property -> (group ownership if applicable)
    this.unitSectionService.getUnitSectionByUid(unitSectionUid).pipe(
      switchMap((unitSection: any) => {
        const unitUid = unitSection?.unitUid;
        if (!unitUid) return of(null);
        return this.unitService.getUnitByUid(unitUid);
      }),
      switchMap((unit: any) => {
        const propertyUid = unit?.property?.uid;
        if (!propertyUid) return of(null);
        return this.propertiesService.getPropertyByUid(propertyUid);
      }),
      switchMap((property: any) => {
        if (!property) return of(null);
        // Populate defaults from property
        this.companyName = property.name || this.companyName;
        // If ownershipType indicates a group, fetch group details
        if (property.ownershipType && property.ownershipType.toUpperCase() === 'GROUP' && property.ownerUid) {
          return this.ownershipService.getGroupOwnershipByUid(property.ownerUid);
        }
        return of(null);
      }),
      catchError(err => {
        console.warn('Failed to resolve organization info for certificate', err);
        return of(null);
      })
    ).subscribe((group: any) => {
      if (group && group.name) {
        this.companyName = group.name;
      }
      this.cdr.detectChanges();
    });
  }

  onLogoError(evt: Event): void {
    // Fallback to bundled default logo if the provided URL fails
    const img = evt.target as HTMLImageElement;
    if (img && img.src.indexOf('tmis.png') === -1) {
      this.companyLogoUrl = '/tmis.png';
      this.cdr.detectChanges();
    }
  }

  issueNotice(rental: Rental){
    this.addingNotice.set(!this.addingNotice());
  }

  saveNotice(rental: any){
    const dto = {
      message: this.message(),
        details: this.details(),
        noticeType: this.noticeType(),
        rentalUid: rental.uid,
        uid: null
    };
    this.clientService.issueNotice(dto)
  }

  async viewNotice(rental: Rental){
    const notice = await this.clientService.getRentalNotice(rental);
    console.log({notice});
    const dialogRef = this.dialog.open(NoticeView, {
      width: '75%',
      data: notice
    });
    dialogRef.afterClosed().pipe(
      map((data)=>{
        console.log(data);

      })
    )
  }
}
