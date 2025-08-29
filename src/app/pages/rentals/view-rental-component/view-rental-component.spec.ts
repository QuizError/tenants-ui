import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRentalComponent } from './view-rental-component';

describe('ViewRentalComponent', () => {
  let component: ViewRentalComponent;
  let fixture: ComponentFixture<ViewRentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRentalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
