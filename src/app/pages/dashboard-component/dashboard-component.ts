import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertiesService } from '../../services/properties-service';
import { OwnershipService } from '../../services/ownership-service';
import { UnitSectionService } from '../../services/unit-section-service';
import { ClientService } from '../../services/client-service';
import { RentalService } from '../../services/rental-service';
import { BillService } from '../../services/bill-service';

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.css'],
  providers: [PropertiesService, OwnershipService, UnitSectionService, ClientService, RentalService, BillService]
})
export class DashboardComponent implements OnInit {

  propertiesData: any[] = [];

  availableSectionData: any[] = [];

  endindRentalsData: any[] = [];

  expiredRentalsData: any[] = [];
  
  currentMonth: string | undefined;

  myClients: any[] = [];

  groupsData: any[] = [];

  unpaidBills: any[] = [];

  constructor(
    private propertiesService: PropertiesService,
    private ownershipService: OwnershipService,
    private unitSectionService: UnitSectionService,
    private clientService: ClientService,
    private rentalService: RentalService,
    private billService: BillService,
    private cdr: ChangeDetectorRef,
    private router: Router){}

  user:any;

  ngOnInit(): void {
    const savedUser = localStorage.getItem('employeeApp');
    if (savedUser) {
      this.user = JSON.parse(savedUser)

    const cachedProperties = localStorage.getItem('properties');
      if (cachedProperties) {
        this.propertiesData = JSON.parse(cachedProperties);
      }
      this.loadDashboardData();
      this.loadUnpaidBills();
    
    }

    
  }

  loadDashboardData() {
    this.getMyProperties(this.user.uid)
    this.getMyAvailableSections(this.user.uid)
    this.getMyClients(this.user.uid)
    this.getMyPropertiesRentalsEndingThisMonth(this.user.uid)
    this.getExpiredPropertyRentalsContractsByOwnerUid(this.user.uid)
    this.currentMonth = this.getCurrentMonth();
    this.getMyGroups(this.user.uid)
  }

  getMyProperties(uid:string){
      this.propertiesService.getMyProprtiesByUserUid(uid).subscribe(res=>{
      this.propertiesData = res;
      // console.log(this.propertiesData.length)   
      localStorage.setItem('properties', JSON.stringify(this.propertiesData));
      this.cdr.detectChanges();
    })
  }

  getMyAvailableSections(uid:string){
      this.unitSectionService.getAvailableUnitSectionByUserUid(uid).subscribe(res=>{
      this.availableSectionData = res;
      // console.log(`Available section for rent are ${this.availableSectionData.length}`)   
      this.cdr.detectChanges();
    })
  }

  getMyClients(uid:string){
      this.clientService.getClientsByOwnerUid(uid).subscribe(res=>{
      this.myClients = res;
      // console.log(`My registreded clients are ${this.myClients.length}`)   
      this.cdr.detectChanges();
    })
  }

  getMyPropertiesRentalsEndingThisMonth(uid:string){
      this.rentalService.getPropertyRentalsEndingThisMonthByOwnerUid(uid).subscribe(res=>{
      this.endindRentalsData = res;
      // console.log(this.endindRentalsData.length)   
      this.cdr.detectChanges();
    })
  }

  getExpiredPropertyRentalsContractsByOwnerUid(uid:string){
      this.rentalService.getExpiredPropertyRentalsContractsByOwnerUid(uid).subscribe(res=>{
      this.expiredRentalsData = res;
      console.log(`Expired contracts are ${this.expiredRentalsData}`)   
      this.cdr.detectChanges();
    })
  }

  getMyGroups(uid:string){
    this.ownershipService.getMyGroupsByUserUid(uid).subscribe(res=>{
      this.groupsData = res; 
      // console.log(this.groupsData)  
      localStorage.setItem('userGroups',JSON.stringify(this.groupsData))
      this.cdr.detectChanges();
    })
  }

  loadUnpaidBills() {
    if (!this.user?.uid) return;
    
    this.billService.getUnpaidBills(this.user.uid).subscribe({
      next: (bills) => {
        this.unpaidBills = bills || [];
      },
      error: (error) => {
        console.error('Error fetching unpaid bills:', error);
        this.unpaidBills = [];
      }
    });
  }

  getTotalUnpaidBills(): number {
    return this.unpaidBills.reduce((total, bill) => total + (bill.softwareBill || 0), 0);
  }

  getCurrentMonth(): string {
    return new Date().toLocaleString('default', { month: 'long' });
  }

  onViewProperties(){
    this.router.navigateByUrl('properties')
  }

  onViewAvailableSections(){
    this.router.navigateByUrl('unit-sections')
  }

  onViewClients(){
    this.router.navigateByUrl('clients')
  }

  // onViewRentals(){
  //   this.router.navigateByUrl('rentals')
  // }
  onViewRentals(rentalType: 'ending' | 'expired' = 'ending') {
    this.router.navigate(['/rentals'], { queryParams: { type: rentalType } });
  }
}
