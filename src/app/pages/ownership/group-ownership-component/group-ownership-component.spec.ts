import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupOwnershipComponent } from './group-ownership-component';

describe('GroupOwnershipComponent', () => {
  let component: GroupOwnershipComponent;
  let fixture: ComponentFixture<GroupOwnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupOwnershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupOwnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
