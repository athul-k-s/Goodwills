import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryFormViewComponent } from './delivery-form-view.component';

describe('DeliveryFormViewComponent', () => {
  let component: DeliveryFormViewComponent;
  let fixture: ComponentFixture<DeliveryFormViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryFormViewComponent]
    });
    fixture = TestBed.createComponent(DeliveryFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
