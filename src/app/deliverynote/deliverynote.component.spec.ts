import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverynoteComponent } from './deliverynote.component';

describe('DeliverynoteComponent', () => {
  let component: DeliverynoteComponent;
  let fixture: ComponentFixture<DeliverynoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliverynoteComponent]
    });
    fixture = TestBed.createComponent(DeliverynoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
