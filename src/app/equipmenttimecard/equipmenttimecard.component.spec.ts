import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmenttimecardComponent } from './equipmenttimecard.component';

describe('EquipmenttimecardComponent', () => {
  let component: EquipmenttimecardComponent;
  let fixture: ComponentFixture<EquipmenttimecardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipmenttimecardComponent]
    });
    fixture = TestBed.createComponent(EquipmenttimecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
