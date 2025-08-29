import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertiesService } from '../../services/properties-service';
import { OwnershipService } from '../../services/ownership-service';

@Component({
  selector: 'app-dashboard-component',
  imports: [],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css'
})
export class DashboardComponent implements OnInit {

  propertiesData: any;

  groupsData: any;

  constructor(private propertiesService: PropertiesService, private cdr: ChangeDetectorRef , private ownershipService: OwnershipService, private router: Router){}

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
    
    }

    
  }


  getMyProperties(uid:string){
      this.propertiesService.getMyProprtiesByUserUid(uid).subscribe(res=>{
      this.propertiesData = res;
      console.log(this.propertiesData.length)   
      localStorage.setItem('properties', JSON.stringify(this.propertiesData));
      this.cdr.detectChanges();
    })
  }

  getMyGroups(uid:string){
    this.ownershipService.getMyGroupsByUserUid(uid).subscribe(res=>{
      this.groupsData = res; 
      console.log(this.groupsData)  
      localStorage.setItem('userGroups',JSON.stringify(this.groupsData))
      this.cdr.detectChanges();
    })
  }

  onViewProperties(){
    this.router.navigateByUrl('properties')
  }

  onViewGroups(){
    this.router.navigateByUrl('ownership-groups')
  }


}
