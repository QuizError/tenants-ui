import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnitSectionService } from '../../../services/unit-section-service';
import { UnitService } from '../../../services/unit-service';
import { UnitSection } from '../../../interfaces/unit-section';
import { Unit } from '../../../interfaces/unit';

@Component({
  selector: 'app-view-unit-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-unit-component.html',
  styleUrl: './view-unit-component.css'
})
export class ViewUnitComponent implements OnInit {
  
  unitSections: UnitSection[] = [];
  unitUid: string = '';
  unitName: string = '';
  propertyUid: string = '';
  loading: boolean = false;
  error: string = '';
  
  // UI state
  filterText: string = '';
  showOnlyAvailable: boolean = false;
  
  // Modal states
  showAddModal: boolean = false;
  showUpdateModal: boolean = false;
  
  // Form data
  newSection: Partial<UnitSection> = {
    name: '',
    price: 0,
    currency: 'TZS',
    available: true,
    waterMeter: '',
    electricityMeter: '',
    roomDtos: []
  };
  
  editingSection: Partial<UnitSection> = {};
  
  // Room types for selection
  availableRoomTypes = [
    'MasterBedRoom', 'Bedroom', 'SittingRoom', 'Kitchen', 
    'PublicToilet', 'Bathroom', 'DiningRoom', 'Store'
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private unitSectionService: UnitSectionService,
    private unitService: UnitService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ){}
  
  ngOnInit(): void {
    this.unitUid = this.activatedRoute.snapshot.params['uid'];
    if (this.unitUid) {
      this.loadUnitDetails();
      this.loadUnitSections();
    } else {
      this.error = 'No unit UID provided in route parameters';
    }
  }

  loadUnitDetails(): void {
    console.log('Loading unit details for UID:', this.unitUid);
    this.unitService.getUnitByUid(this.unitUid).subscribe({
      next: (response: any) => {
        console.log('Unit details API response:', response);
        const unit = response.data;
        this.unitName = unit.name;
        this.propertyUid = unit.property.uid;
        console.log('Set unit name to:', this.unitName);
        console.log('Set property UID to:', this.propertyUid);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading unit details:', err);
        this.error = 'Failed to load unit details';
        this.cdr.detectChanges();
      }
    });
  }

  loadUnitSections(): void {
    this.loading = true;
    this.error = '';
    this.unitSections = []; // Clear existing data to prevent stale data issues
    this.cdr.detectChanges();
    
    this.unitSectionService.getUnitSectionByUnityUid(this.unitUid).subscribe({
      next: (data: UnitSection[]) => {
        console.log('API Response for unit sections:', data); // Debug log
        this.unitSections = [...data]; // Create new array reference to trigger change detection
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = 'Failed to load unit sections';
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error loading unit sections:', err);
      }
    });
  }

  addSection(): void {
    this.newSection = {
      name: '',
      price: 0,
      currency: 'TZS',
      available: true,
      unitUid: this.unitUid,
      waterMeter: '',
      electricityMeter: '',
      roomDtos: []
    };
    this.showAddModal = true;
  }

  updateSection(sectionUid: string): void {
    const section = this.unitSections.find(s => s.uid === sectionUid);
    if (section) {
      this.editingSection = { ...section };
      this.showUpdateModal = true;
    }
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.newSection = {
      name: '',
      price: 0,
      currency: 'TZS',
      available: true,
      waterMeter: '',
      electricityMeter: '',
      roomDtos: []
    };
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.editingSection = {};
  }

  addRoom(section: Partial<UnitSection>): void {
    if (!section.roomDtos) {
      section.roomDtos = [];
    }
    section.roomDtos.push({ count: 1, room: this.availableRoomTypes[0] });
  }

  removeRoom(section: Partial<UnitSection>, index: number): void {
    if (section.roomDtos) {
      section.roomDtos.splice(index, 1);
    }
  }

  saveNewSection(): void {
    if (this.isValidSection(this.newSection)) {
      this.unitSectionService.saveUnitSectionData(this.newSection as UnitSection).subscribe({
        next: () => {
          this.closeAddModal();
          this.loadUnitSections();
        },
        error: (err) => {
          console.error('Error saving section:', err);
          this.error = 'Failed to save section';
        }
      });
    }
  }

  saveUpdatedSection(): void {
    if (this.isValidSection(this.editingSection) && this.editingSection.uid) {
      // Note: You'll need to add an update method to your service
      this.unitSectionService.saveUnitSectionData(this.editingSection as UnitSection).subscribe({
        next: () => {
          this.closeUpdateModal();
          this.loadUnitSections();
        },
        error: (err) => {
          console.error('Error updating section:', err);
          this.error = 'Failed to update section';
        }
      });
    }
  }

  private isValidSection(section: Partial<UnitSection>): boolean {
    return !!(section.name && section.price !== undefined && section.roomDtos && section.roomDtos.length > 0);
  }

  goBackToProperty(): void {
    // Navigate back to view property page
    // You may need to adjust the route based on your routing structure
    console.log(this.propertyUid)
    this.router.navigate(['/view-property', this.propertyUid]);
  }

  // Derived data for UI
  get filteredSections(): UnitSection[] {
    const text = (this.filterText || '').toLowerCase().trim();
    return this.unitSections.filter(s => {
      if (this.showOnlyAvailable && !s.available) return false;
      if (!text) return true;
      const hay = `${s.name} ${s.unitName} ${s.currency} ${s.waterMeter ?? ''} ${s.electricityMeter ?? ''}`.toLowerCase();
      return hay.includes(text);
    });
  }

  get totalSections(): number { return this.unitSections.length; }
  get availableCount(): number { return this.unitSections.filter(s => s.available).length; }
  get unavailableCount(): number { return this.unitSections.filter(s => !s.available).length; }
}
