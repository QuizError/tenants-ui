import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { UnitService } from '../../../services/unit-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-units-component',
  imports: [],
  templateUrl: './units-component.html',
  styleUrl: './units-component.css'
})
export class UnitsComponent implements OnInit, OnChanges {

  @Input() propertyUid!: string;

  unitsData: any

  constructor(private unitServive: UnitService, private router: Router, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.loadUnits();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['propertyUid'] && !changes['propertyUid'].firstChange) {
      this.loadUnits();
    }
  }

  private loadUnits(): void {
    // Clear cached data when propertyUid changes to ensure fresh data
    if (this.propertyUid) {
      localStorage.removeItem('units');
    }

    const cachedUnits = localStorage.getItem('units');
    if (cachedUnits) {
      this.unitsData = JSON.parse(cachedUnits);
      this.cdr.detectChanges();
    }
    
    console.log(`Property uid: ${this.propertyUid}`)
    if(this.propertyUid != null && this.propertyUid != ''){
      console.log(this.unitsData)
      this.getUnitsByPropertyUid(this.propertyUid)
    }else{
      this.getUnitsData()
    }
  }

  getUnitsData(){
    this.unitServive.getPropertyUnitData().subscribe(units=>{
      this.unitsData = units
      localStorage.setItem('units', JSON.stringify(this.unitsData));
      this.cdr.detectChanges();
    })
  }

    getUnitsByPropertyUid(uid:string){
    this.unitServive.getUnitsByPropertyUid(uid).subscribe(units=>{
      this.unitsData = units
      localStorage.setItem('units', JSON.stringify(this.unitsData));
      this.cdr.detectChanges();
    })
  }

  onAddUnit(){
    this.router.navigateByUrl('add-unit')
  }

  onUpdate(uid:string){
    this.router.navigate(['update-unit',uid])
  }

  onView(uid:string){
    this.router.navigate(['view-unit',uid])
  }
}
