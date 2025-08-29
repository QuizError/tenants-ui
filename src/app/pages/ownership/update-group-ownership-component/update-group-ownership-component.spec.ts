import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGroupOwnershipComponent } from './update-group-ownership-component';

describe('UpdateGroupOwnershipComponent', () => {
  let component: UpdateGroupOwnershipComponent;
  let fixture: ComponentFixture<UpdateGroupOwnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateGroupOwnershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateGroupOwnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
