import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwnershipService } from '../../../services/ownership-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PropertiesService } from '../../../services/properties-service';

@Component({
  selector: 'app-add-property-component',
  imports: [ReactiveFormsModule],
  templateUrl: './add-property-component.html',
  styleUrl: './add-property-component.css'
})
export class AddPropertyComponent implements OnInit {

  addPropertyForm: FormGroup

  ownershipData: any

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private propertyService: PropertiesService, 
    private ownershipService: OwnershipService){
    this.addPropertyForm = fb.group({
      name:[''],
      ownershipType:[''],
      ownerUid:[''],
      startFunction:[''],
      location:[''],
      functionStatus:[''],
    })
  }

  user:any;

  groupsData:any;

    ngOnInit(): void {
    const savedUser = localStorage.getItem('employeeApp');
    if (savedUser) {
      this.user = JSON.parse(savedUser)

      const cachedGroups = localStorage.getItem('userGroups');

      if (cachedGroups) {
        this.groupsData = JSON.parse(cachedGroups);
      }

      this.getMyGroups(this.user.uid)
    }
  }


  getMyGroups(uid:string){
    this.ownershipService.getMyGroupsByUserUid(uid).subscribe(res=>{
      this.groupsData = res; 
      console.log(this.groupsData)  
      localStorage.setItem('userGroups',JSON.stringify(this.groupsData))
    })
  }

  onSubmit(){
    this.propertyService.savePropertyData(this.addPropertyForm.value).subscribe(res=>{
      this.router.navigateByUrl('properties')
    })
  }


  onCancel(){
    this.router.navigateByUrl('properties')
  }
}
