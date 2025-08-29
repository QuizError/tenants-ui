import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PropertiesService } from '../../../services/properties-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-property-component',
  imports: [],
  templateUrl: './property-component.html',
  styleUrl: './property-component.css'
})
export class PropertyComponent implements OnInit {

  propertiesData: any;

  constructor(private router:Router, private propertiesService: PropertiesService, private cdr: ChangeDetectorRef){}

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
      localStorage.setItem('properties', JSON.stringify(this.propertiesData));
      this.cdr.detectChanges();
    })
  }


  addProperty(){
    this.router.navigateByUrl('add-property')
  }

  onView(uid:string){
    this.router.navigate(['view-property',uid])
  }

  onUpdate(uid:string){
    this.router.navigate(['update-property',uid])
  }
  

}
