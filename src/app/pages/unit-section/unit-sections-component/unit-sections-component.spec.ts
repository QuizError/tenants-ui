import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSectionsComponent } from './unit-sections-component';

describe('UnitSectionsComponent', () => {
  let component: UnitSectionsComponent;
  let fixture: ComponentFixture<UnitSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitSectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
