import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnitSectionComponent } from './add-unit-section-component';

describe('AddUnitSectionComponent', () => {
  let component: AddUnitSectionComponent;
  let fixture: ComponentFixture<AddUnitSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUnitSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUnitSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
