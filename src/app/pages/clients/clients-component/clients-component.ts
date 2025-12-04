import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../interfaces/client';
import { ClientService } from '../../../services/client-service';
import { Router, RouterModule } from '@angular/router';
import { enumToObjectArray } from '../../../shared/helpers/utils.functions';
import { NoticeType } from '../client.model';

@Component({
  selector: 'app-clients-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clients-component.html',
  styleUrls: ['./clients-component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ for performance
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  loading: boolean = false;
  error: string = '';

  currentUserUid: string = '';
  user: any;

  // Pagination state
  pageSizeOptions: number[] = [10, 25, 50, 100];
  pageSize: number = 10;
  currentPage: number = 1; // 1-based index

  constructor(
    private clientService: ClientService,
    private router: Router,
    private cdr: ChangeDetectorRef // ✅ inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const savedUser = localStorage.getItem('employeeApp');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.currentUserUid = this.user.uid;
    }
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.error = '';

    this.clientService.getClientsByOwnerUid(this.currentUserUid).subscribe({
      next: (data: Client[]) => {
        this.clients = [...data]; // ✅ new reference for OnPush
        this.loading = false;
        console.log(this.clients)
        this.currentPage = 1; // reset to first page on load
        this.cdr.detectChanges(); // ✅ force UI refresh
      },
      error: (err) => {
        this.error = 'Failed to load clients. Please try again.';
        this.loading = false;
        console.error('Error loading clients:', err);
        this.cdr.detectChanges();
      }
    });
  }

  onAddNewClient(): void {
    this.router.navigate(['/add-client']);
  }

  onEditClient(uid: string): void {
    this.router.navigate(['/update-client', uid]);
  }

  onViewClient(uid: string): void {
    this.router.navigate(['/clients', uid]);
  }

  onDeleteClient(uid: string): void {
    this.deleteClient(uid);
  }

  deleteClient(uid: string): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClientByUid(uid).subscribe({
        next: () => {
          this.clients = this.clients.filter(client => client.uid !== uid); // ✅ new reference
          // Adjust current page if we deleted the last item on the last page
          if (this.currentPage > this.totalPages) {
            this.currentPage = Math.max(1, this.totalPages);
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Failed to delete client. Please try again.';
          console.error('Error deleting client:', err);
          this.cdr.detectChanges();
        }
      });
    }
  }

  // Pagination helpers
  get totalItems(): number { return this.clients.length; }
  get totalPages(): number { return Math.max(1, Math.ceil(this.totalItems / this.pageSize)); }
  get pageStartIndex(): number { return (this.currentPage - 1) * this.pageSize; }
  get pageEndIndex(): number { return Math.min(this.pageStartIndex + this.pageSize, this.totalItems); }
  get pagedClients(): Client[] { return this.clients.slice(this.pageStartIndex, this.pageEndIndex); }

  goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(1, page), this.totalPages);
  }

  setPageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }
}
