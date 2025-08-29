import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUnitSectionComponent } from './update-unit-section-component';

describe('UpdateUnitSectionComponent', () => {
  let component: UpdateUnitSectionComponent;
  let fixture: ComponentFixture<UpdateUnitSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateUnitSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateUnitSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
