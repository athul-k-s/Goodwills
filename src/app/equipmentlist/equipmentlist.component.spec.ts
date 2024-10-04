import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentlistComponent } from './equipmentlist.component';

describe('EquipmentlistComponent', () => {
  let component: EquipmentlistComponent;
  let fixture: ComponentFixture<EquipmentlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipmentlistComponent]
    });
    fixture = TestBed.createComponent(EquipmentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
