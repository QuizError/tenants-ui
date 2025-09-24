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
    this.updatePropertyForm = this.fb.group({
      uid: [''],
      name: [''],
      ownershipType: [''],
      ownerUid: [''],
      startFunction: [''],
      location: [''],
      functionStatus: [''],
      hasServiceCharge: [false],
      serviceChargeAmount: [{value: 0, disabled: true}],
      serviceChargeCurrency: [{value: '', disabled: true}],
      serviceChargeDescription: [{value: '', disabled: true}]
    });

    // Watch for changes to hasServiceCharge
    this.updatePropertyForm.get('hasServiceCharge')?.valueChanges.subscribe(hasServiceCharge => {
      const serviceChargeAmount = this.updatePropertyForm.get('serviceChargeAmount');
      const serviceChargeCurrency = this.updatePropertyForm.get('serviceChargeCurrency');
      const serviceChargeDescription = this.updatePropertyForm.get('serviceChargeDescription');
      
      if (hasServiceCharge) {
        serviceChargeAmount?.enable();
        serviceChargeCurrency?.enable();
        serviceChargeDescription?.enable();
      } else {
        serviceChargeAmount?.disable();
        serviceChargeCurrency?.disable();
        serviceChargeDescription?.disable();
      }
    });
  }

  user:any;

  groupsData:any;

  ngOnInit(): void {
    this.propertyUid = {
      uid: this.activatedReoute.snapshot.params['uid']
    };

    // First, load the property data
    this.propertyService.getPropertyByUid(this.propertyUid.uid).subscribe(property => {
      this.propertyData = property;
      
      // Set the form values
      this.updatePropertyForm.patchValue({
        uid: this.propertyData.data.uid,
        name: this.propertyData.data.name,
        ownershipType: this.propertyData.data.ownershipType,
        ownerUid: this.propertyData.data.ownerUid,
        startFunction: this.propertyData.data.startFunction,
        location: this.propertyData.data.location,
        functionStatus: this.propertyData.data.functionStatus,
        hasServiceCharge: this.propertyData.data.hasServiceCharge || false,
        serviceChargeAmount: this.propertyData.data.serviceChargeAmount || 0,
        serviceChargeCurrency: this.propertyData.data.serviceChargeCurrency || '',
        serviceChargeDescription: this.propertyData.data.serviceChargeDescription || ''
      });

      // Manually trigger the service charge fields state based on hasServiceCharge
      const hasServiceCharge = this.updatePropertyForm.get('hasServiceCharge')?.value;
      if (hasServiceCharge) {
        this.updatePropertyForm.get('serviceChargeAmount')?.enable();
        this.updatePropertyForm.get('serviceChargeCurrency')?.enable();
        this.updatePropertyForm.get('serviceChargeDescription')?.enable();
      }
    });

    // Load user groups
    const savedUser = localStorage.getItem('employeeApp');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      const cachedGroups = localStorage.getItem('userGroups');
      if (cachedGroups) {
        this.groupsData = JSON.parse(cachedGroups);
      }
      this.getMyGroups(this.user.uid);
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
