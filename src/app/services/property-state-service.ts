import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyStateService {
  private propertyDataSource = new BehaviorSubject<any>(null);
  propertyData$ = this.propertyDataSource.asObservable();

  setPropertyData(data: any) {
    this.propertyDataSource.next(data);
  }
}
