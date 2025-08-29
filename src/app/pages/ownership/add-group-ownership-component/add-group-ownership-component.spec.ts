import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupOwnershipComponent } from './add-group-ownership-component';

describe('AddGroupOwnershipComponent', () => {
  let component: AddGroupOwnershipComponent;
  let fixture: ComponentFixture<AddGroupOwnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGroupOwnershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGroupOwnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
