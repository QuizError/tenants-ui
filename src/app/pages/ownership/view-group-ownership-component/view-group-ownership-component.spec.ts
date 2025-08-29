import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGroupOwnershipComponent } from './view-group-ownership-component';

describe('ViewGroupOwnershipComponent', () => {
  let component: ViewGroupOwnershipComponent;
  let fixture: ComponentFixture<ViewGroupOwnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewGroupOwnershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewGroupOwnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
