import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertiesService } from '../../services/properties-service';
import { OwnershipService } from '../../services/ownership-service';
import { UnitSectionService } from '../../services/unit-section-service';
import { ClientService } from '../../services/client-service';
import { RentalService } from '../../services/rental-service';

@Component({
  selector: 'app-dashboard-component',
  imports: [],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css'
})
export class DashboardComponent implements OnInit {

  propertiesData: any[] = [];

  availableSectionData: any[] = [];

  endindRentalsData: any[] = [];
  
  currentMonth: string | undefined;

  myClients: any[] = [];

  groupsData: any[] = [];

  constructor(
    private propertiesService: PropertiesService,
    private unitSectionService: UnitSectionService, 
    private cdr: ChangeDetectorRef , 
    private ownershipService: OwnershipService,
    private clientService: ClientService, 
    private rentalService: RentalService,
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
      this.getMyProperties(this.user.uid)
      this.getMyAvailableSections(this.user.uid)
      this.getMyClients(this.user.uid)
      this.getMyPropertiesRentalsEndingThisMonth(this.user.uid)
      this.currentMonth = this.getCurrentMonth();
      // console.log(this.user.uid)
    
    }

    
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


  getMyGroups(uid:string){
    this.ownershipService.getMyGroupsByUserUid(uid).subscribe(res=>{
      this.groupsData = res; 
      // console.log(this.groupsData)  
      localStorage.setItem('userGroups',JSON.stringify(this.groupsData))
      this.cdr.detectChanges();
    })
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

  onViewRentals(){
    this.router.navigateByUrl('rentals')
  }
}
