import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettycashComponent } from './pettycash.component';

describe('PettycashComponent', () => {
  let component: PettycashComponent;
  let fixture: ComponentFixture<PettycashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PettycashComponent]
    });
    fixture = TestBed.createComponent(PettycashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
