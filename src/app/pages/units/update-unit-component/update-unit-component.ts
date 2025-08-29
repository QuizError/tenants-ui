import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UnitService } from '../../../services/unit-service';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyStateService } from '../../../services/property-state-service';

@Component({
  selector: 'app-update-unit-component',
  imports: [ReactiveFormsModule],
  templateUrl: './update-unit-component.html',
  styleUrl: './update-unit-component.css'
})
export class UpdateUnitComponent {

  updatePropertyUnitForm: FormGroup

  unitData :any

  unitUid : {uid:string} = {uid:''}

  propertyUid : {uid:string} = {uid:''}

  constructor(private fb: FormBuilder, 
              private unitService: UnitService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private propertyState: PropertyStateService){
    this.updatePropertyUnitForm = fb.group({
      uid:[''],
      name:[''],
      propertyUid:[''],
      descriptions:[''],
    })
  }

  ngOnInit(): void {

    this.unitUid ={
      uid: this.activatedRoute.snapshot.params['uid']
    }
    
    this.unitService.getUnitByUid(this.unitUid.uid).subscribe(unit=>{
      this.unitData = unit

      this.updatePropertyUnitForm.setValue({
        uid: this.unitData.data.uid,
        name: this.unitData.data.name,
        descriptions: this.unitData.data.descriptions,
        propertyUid: this.unitData.data.property.uid,
      })

      this.propertyUid  = {
        uid : this.unitData.data.property.uid
      }

    })

  }
  onSubmit(){
    console.log(this.updatePropertyUnitForm.value)
    this.unitService.savePropertyUnitData(this.updatePropertyUnitForm.value).subscribe(res=>{
      this.router.navigate(['view-property',this.propertyUid.uid])
    })
  }

  onCancel(){
    this.router.navigate(['view-property',this.propertyUid.uid])
  }
}
