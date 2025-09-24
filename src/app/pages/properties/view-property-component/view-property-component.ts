import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertiesService } from '../../../services/properties-service';
import { PropertyStateService } from '../../../services/property-state-service';
import { CommonModule } from '@angular/common';
import { UnitsComponent } from '../../units/units-component/units-component';

@Component({
  selector: 'app-view-property-component',
  standalone: true,
  imports: [CommonModule, UnitsComponent],
  templateUrl: './view-property-component.html',
  styleUrls: ['./view-property-component.css']
})
export class ViewPropertyComponent implements OnInit {
  propertyUid: string = '';
  propertyData: any = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private propertyState: PropertyStateService,
    private propertyService: PropertiesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.propertyUid = this.activatedRoute.snapshot.params['uid'];
    this.loadPropertyData();
  }

  private loadPropertyData(): void {
    this.isLoading = true;
    this.error = null;

    // Try to load from cache first
    const cachedPropertyData = localStorage.getItem('viewPropertyData');
    if (cachedPropertyData) {
      try {
        const parsedData = JSON.parse(cachedPropertyData);
        if (parsedData?.data?.uid === this.propertyUid) {
          this.propertyData = parsedData;
          this.propertyState.setPropertyData(this.propertyData.data);
          this.isLoading = false;
        }
      } catch (e) {
        console.error('Error parsing cached property data:', e);
      }
    }

    // Always fetch fresh data
    this.getPropertyDataByUid(this.propertyUid);
  }

  private getPropertyDataByUid(uid: string): void {
    this.propertyService.getPropertyByUid(uid).subscribe({
      next: (property) => {
        this.propertyData = property;
        this.propertyState.setPropertyData(this.propertyData.data);
        localStorage.setItem('viewPropertyData', JSON.stringify(this.propertyData));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading property:', err);
        this.error = 'Failed to load property data. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCancel(): void {
    this.router.navigateByUrl('properties');
  }

  // Helper method to format date
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }
}
