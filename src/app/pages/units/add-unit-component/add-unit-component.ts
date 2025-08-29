import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UnitService } from '../../../services/unit-service';
import { PropertyStateService } from '../../../services/property-state-service';

@Component({
  selector: 'app-add-unit-component',
  imports: [ReactiveFormsModule],
  templateUrl: './add-unit-component.html',
  styleUrl: './add-unit-component.css'
})
export class AddUnitComponent implements OnInit {

  addPropertyUnitForm: FormGroup

  propertyUid : {uid:string} = {uid:''}

  constructor(
    private fb: FormBuilder, 
    private unitService: UnitService, 
    private router: Router, 
    private propertyState: PropertyStateService){
    this.addPropertyUnitForm = fb.group({
      name:[''],
      propertyUid:[''],
      descriptions:[''],
    })
  }

  ngOnInit(): void {
      this.propertyState.propertyData$.subscribe(data => {
        this.addPropertyUnitForm.patchValue({
          propertyUid: data.uid
        })

        this.propertyUid = {
          uid: data.uid
        }
        console.log(this.propertyUid.uid)
  });
  }
  onSubmit(){
    console.log(this.addPropertyUnitForm.value)
    this.unitService.savePropertyUnitData(this.addPropertyUnitForm.value).subscribe(res=>{
      console.log(this.addPropertyUnitForm.value)
      this.router.navigate(['view-property',this.propertyUid.uid])
    })
  }

  onCancel(){
    this.router.navigate(['view-property',this.propertyUid.uid])
  }
}
