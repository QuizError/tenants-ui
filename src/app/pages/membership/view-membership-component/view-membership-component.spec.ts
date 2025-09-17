import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMembershipComponent } from './view-membership-component';

describe('ViewMembershipComponent', () => {
  let component: ViewMembershipComponent;
  let fixture: ComponentFixture<ViewMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMembershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
