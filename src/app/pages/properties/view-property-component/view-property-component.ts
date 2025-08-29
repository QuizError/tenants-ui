import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertiesService } from '../../../services/properties-service';
import { PropertyStateService } from '../../../services/property-state-service';
import { UnitService } from '../../../services/unit-service';
import { UnitsComponent } from '../../units/units-component/units-component';

@Component({
  selector: 'app-view-property-component',
  imports: [UnitsComponent],
  templateUrl: './view-property-component.html',
  styleUrl: './view-property-component.css'
})
export class ViewPropertyComponent implements OnInit {

  propertyUid: {uid: string} = {uid:''}

  propertyData: any

  constructor(
    private router: Router, 
    private activateRoute: ActivatedRoute,
    private propertyState: PropertyStateService,
    private propertyService: PropertiesService,
    private cdr: ChangeDetectorRef){}

  ngOnInit(): void {

    this.propertyUid ={
      uid: this.activateRoute.snapshot.params['uid']
    }
    const cachedPropertyData = localStorage.getItem('viewPropertyData');
      if (cachedPropertyData) {
        this.propertyData = JSON.parse(cachedPropertyData);
        this.cdr.detectChanges();
      }
    this.getProppertyDataByUid(this.propertyUid.uid)
    
  }

  getProppertyDataByUid(uid:string){
    this.propertyService.getPropertyByUid(uid).subscribe(property=>{
      this.propertyData = property
      this.propertyState.setPropertyData(this.propertyData.data)
      localStorage.setItem('viewPropertyData', JSON.stringify(this.propertyData));
      this.cdr.detectChanges();
    })
  }

  onCancel(){
    this.router.navigateByUrl('properties')
  }
}
