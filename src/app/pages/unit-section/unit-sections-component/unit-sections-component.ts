import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { UnitSection } from '../../../interfaces/unit-section';
import { UnitSectionService } from '../../../services/unit-section-service';

@Component({
  selector: 'app-unit-sections-component',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './unit-sections-component.html',
  styleUrls: ['./unit-sections-component.css']
})
export class UnitSectionsComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'unitName',
    'propertyName',
    'location',
    'price',
    'availability'
  ];
  dataSource = new MatTableDataSource<UnitSection>();
  loading = true;
  error: string | null = null;
  user: any;

  constructor(
    private unitSectionService: UnitSectionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const savedUser = localStorage.getItem('employeeApp');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.loadAvailableUnits(this.user.uid);
    }
  }

  loadAvailableUnits(uid: string): void {
    this.loading = true;
    this.error = null;
    this.unitSectionService.getAvailableUnitSectionByUserUid(uid).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load available units data.';
        this.loading = false;
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }
}
