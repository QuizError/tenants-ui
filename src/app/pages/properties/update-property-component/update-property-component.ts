import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertiesService } from '../../../services/properties-service';
import { OwnershipService } from '../../../services/ownership-service';

@Component({
  selector: 'app-update-property-component',
  imports: [ReactiveFormsModule],
  templateUrl: './update-property-component.html',
  styleUrl: './update-property-component.css'
})
export class UpdatePropertyComponent {

  updatePropertyForm: FormGroup

  ownershipData: any

  propertyData: any;

  propertyUid: { uid: string} = {uid : ''}

  constructor(private router: Router, private activatedReoute: ActivatedRoute, private fb: FormBuilder,private propertyService: PropertiesService, private ownershipService: OwnershipService){
    this.updatePropertyForm = fb.group({
      uid:[''],
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

      this.propertyUid = {
        uid : this.activatedReoute.snapshot.params['uid']
      }

      this.propertyService.getPropertyByUid(this.propertyUid.uid).subscribe(property => {
        this.propertyData = property;

        this.updatePropertyForm.setValue({
          uid: this.propertyData.data.uid,
          name: this.propertyData.data.name,
          ownershipType: this.propertyData.data.ownershipType,
          ownerUid: this.propertyData.data.ownerId,
          startFunction: this.propertyData.data.startFunction,
          location: this.propertyData.data.location,
          functionStatus: this.propertyData.data.functionStatus,
        })
      })

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
    this.propertyService.savePropertyData(this.updatePropertyForm.value).subscribe(res=>{
      this.router.navigateByUrl('properties')
    })
  }


  onCancel(){
    this.router.navigateByUrl('properties')
  }
}
